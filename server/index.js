/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 ThoughtClan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const puppeteer = require('puppeteer');
const commander = require('commander');
const child_process = require('child_process');

commander
  .requiredOption('-o, --output <output>', 'Output file path for generated image')
  .requiredOption('-i, --input <input>', 'Canvas JSON string or path to JSON file containing canvas data')
  .option('-s, --skip-build', 'Skip installing packages and building the example app', false)
  .option('-d, --debug', 'Show more logs', false)
  .option('-b, --browser', 'Show browser (run without headless mode)', false)
  .option('-N, --no-sandbox', 'Skip Chromium sandbox', false)
  .option('-S, --scale-factor <scale>', 'Set the device scale factor for the browser', 2)
  .option('-n, --no-cleanup', 'Don\'t remove the built example app used by the process', false);

commander.parse(process.argv);

if (commander.scaleFactor !== undefined && isNaN(parseFloat(commander.scaleFactor)))
  throw new Error(`Scale factor must be a number! Received ${commander.scaleFactor}`);

if (fs.existsSync(commander.output)) {
  console.error(`Output file ${commander.output} already exists`);
  exit(1);
}

const outputDirectory = path.basename(path.dirname(commander.output));

if (!fs.existsSync(outputDirectory))
  fs.mkdirsSync(outputDirectory);

let json;

json = parseJson(commander.input);

if (json === null && fs.existsSync(commander.input)) {
  json = parseJson(fs.readFileSync(commander.input));
}

if (!json) {
  console.error('--input parameter must be a valid JSON or a path to a valid JSON file. Received ', commander.input);
  exit(1);
}

const INDEX_HTML_PATH = path.join(__dirname, './build/index.html');

var start = process.hrtime();

function prepareReactApp() {
  const buildCopyPath = path.join(__dirname, 'build');

  // FIXME: probably want to use different options instead of bending the same option for multiple effects
  if (fs.existsSync(buildCopyPath) && commander.skipBuild) {
    console.info('Built react app already exists, skipping build and copy');
    return;
  }

  if (fs.existsSync(buildCopyPath))
    fs.removeSync(buildCopyPath);

  console.info('Preparing example app for rendering the canvas...');

  // store the cwd to restore it after prepearing the example app
  const cwd = process.cwd();

  const exampleAppPath = path.join(__dirname, '../example');

  if (!fs.existsSync(exampleAppPath)) {
    console.error('Could not locate example app. Ensure that the repository structure has not been modified when running this script');
    exit(1);
  }

  process.chdir(exampleAppPath);

  if (!commander.skipBuild) {
    child_process.execSync('yarn install');
    child_process.execSync('yarn build');
  }

  // Change back to original working directory and copy the built example app
  process.chdir(cwd);

  fs.copySync(path.join(exampleAppPath, 'build'), path.join(__dirname, './build'));

  let html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // example app generates an index file to be served from a webserver, we want to load this file as a local HTML so fix the paths
  html = html.replace(/(src|href)\=\"\/react-stamp\/static/g, 'src="./static');

  fs.writeFileSync(INDEX_HTML_PATH, html, 'utf-8');

  // 出来た！
  console.info('React app is ready!');
}

function cleanup() {
  if (commander.cleanup === false) {
    console.info('Skipping cleanup');
    return;
  }

  console.info('Cleaning up...');
  fs.removeSync(path.join(__dirname, 'build'));
}

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

async function createImage() {
  const puppeteerArgs = [];

  if (commander.sandbox === false)
    puppeteerArgs.push('--no-sandbox', '--disable-setuid-sandbox');

  if (commander.debug)
    console.info('Running puppeteer with args', puppeteerArgs);

  const browser = await puppeteer.launch({ headless: !commander.browser, args: puppeteerArgs });
  const page = await browser.newPage();

  console.info(`Using device scale factor ${commander.scaleFactor}`);

  page.setViewport({
    width: 1920,
    height: 1200,
    deviceScaleFactor: parseFloat(commander.scaleFactor),
  });

  page.evaluateOnNewDocument((j) => {
    window.__puppeteer = j;
  }, json);

  await page.goto(`file://${INDEX_HTML_PATH}`);

  console.info('Waiting for screen grab ready flag...');

  await page.waitForFunction(() => window.__puppeteer && window.__screenGrabReady);

  const rect = await page.evaluate(selector => {
    console.info('Finding .konvajs-content in document');

    const element = document.querySelector(selector);

    if (!element) {
      console.warn('No element matching selector found');
      return null;
    }

    const {
      x,
      y,
      width,
      height
    } = element.getBoundingClientRect();

    return {
      left: x,
      top: y,
      width,
      height,
      id: element.id
    };
  }, '.konvajs-content');


  if (rect) {
    console.info('Found element rectangle', rect);

    await page.screenshot({
      path: commander.output,
      clip: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }
    });
  } else {
    console.error('Could not find canvas rectangle, image was not generated');
  }

  await browser.close();

  const end = process.hrtime(start);

  console.info('Execution time (hr): %ds %dms', end[0], end[1] / 1000000);
}

function exit(code) {
  cleanup();
  console.info('o7');
  process.exit(code === undefined ? 0 : code);
}

prepareReactApp();

createImage()
  .then(() => {
    exit(0);
  })
  .catch((e) => {
    console.error('Failed to create image');

    if (commander.debug)
      console.error(e);

    exit(1);
  });
