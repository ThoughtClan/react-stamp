const express = require('express');
const fs = require('fs-extra');
const child_process = require('child_process');
const commander = require('commander');
const request_id = require('express-request-id');

const options = commander
  .option('-p, --port', 'The port to run the express server on', 11000);

const app = express();

app.use(bodyParser.json());
app.use(request_id());

app.post('/create-image', function (req, res) {
  const json = req.body;

  if (!json || isNaN(json.height) || isNaN(json.width) || !Array.isArray(json.shapes)) {
    res.status = 400;
    res.send({ code: 'E_INVALID_JSON' });
    return;
  }

  const FILE_PATH = path.join('/tmp', `${req.id}.png`);

  child_process.execSync(`node index.js -o ${FILE_PATH} -i ${JSON.stringify(json)}`);

  res.sendFile(FILE_PATH, function (err) {
    try {
      fs.unlinkSync(FILE_PATH);
    } catch (e) {
      console.error('Error removing file');
      console.error(e);
    }
  })
});



let port = 8001;
app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});
