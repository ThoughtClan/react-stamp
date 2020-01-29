const express = require('express');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
const commander = require('commander');
const request_id = require('express-request-id');
const body_parser = require('body-parser');

const options = commander
  .option('-p, --port', 'The port to run the express server on', 11000)
  .option('-d, --debug', 'Print more logs', false);

options.parse(process.argv);

const app = express();

const START_TIME = Date.now();

function isBuildFresh() {
  const buildPath = path.join(__dirname, 'build');

  if (!fs.existsSync(buildPath))
    return false;

  const stat = fs.statSync(buildDir);

  if (stat.mtimeMs > START_TIME)
    return true;

  return false;
}

app.use(body_parser.json());
app.use(request_id());

app.get('/', function (req, res) {
  res.send(`Image generator API listening on port ${options.port}`);
});

app.post('/create-image', function (req, res) {
  const json = req.body;

  if (options.debug)
    console.info('Processing request JSON', json);

  if (!json || isNaN(json.height) || isNaN(json.width) || !Array.isArray(json.shapes)) {
    res.status = 400;
    res.send({ code: 'E_INVALID_JSON' });
    return;
  }

  const FILE_PATH = path.join(os.tmpdir(), `${req.id}.png`);

  const args = [
    `-o ${FILE_PATH}`,
    `-i "${JSON.stringify(json).replace(/\"/g, "\\\"")}"`,
    `--no-cleanup`
  ];

  if (options.debug)
    args.push('--debug');

  if (isBuildFresh()) {
    args.push(`--skip-build`);
  }

  const command = `node index.js ${args.join(' ')}`;

  if (options.debug)
    console.info('Executing image generation command', command);

  child_process.execSync(command);

  res.sendFile(FILE_PATH, function (err) {
    try {
      fs.unlinkSync(FILE_PATH);
    } catch (e) {
      console.error('Error removing file');
      console.error(e);
    }
  })
});

app.listen(options.port, () => {
  console.info(`Express server listening on port ${options.port}`);
});
