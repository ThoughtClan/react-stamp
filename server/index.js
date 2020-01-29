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
  .option('-b, --browser', 'Show browser (run without headless mode)', false);

commander.parse(process.argv);

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
  const browser = await puppeteer.launch({ headless: !commander.browser });
  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1200,
    deviceScaleFactor: 2
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
