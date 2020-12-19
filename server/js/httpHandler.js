const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const Swim = require('./swim.js');



// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => { }) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  // POST
  if (req.method === 'POST') {
    const backgroundPath = module.exports.backgroundImageFile;

    let data = [];

    req.on('data', (chunk) => {
      data.push(chunk);
    });

    req.on('end', () => {
      res.writeHead(201, headers);

      // data is type Buffer
      data = Buffer.concat(data);
      // console.log(`Buffer length: ${data.length}`);

      let parsedFile = multipart.getFile(data);

      // console.log(`Parsed File: ${parsedFile}`);

      fs.writeFile(backgroundPath, parsedFile.data, { encoding: 'binary' }, (err) => {
        res.end();
        next();

        if (err) {
          console.log(`ERROR writing file: ${err}`);
          return;
        }

        console.log(`saved image with size ${data.length} to "${backgroundPath}"`);
      });

    });

    return;
  }

  // GET
  if (req.method === 'GET') {
    var mypath = path.join('.', req.url);

    if (path.extname(mypath) === '.jpg') {
      console.log(mypath);
      var readStream = fs.createReadStream(mypath);

      readStream.on('open', function () {
        var stat = fs.statSync(mypath);
        res.writeHead(200,
          { 'Content-Type': 'image/jpeg',
           'Content-Length': stat.size
          });
        readStream.pipe(res);
      }).on('close', function () {
        res.end();
        next();
      })

      readStream.on('error', function () {
        res.writeHead(404, headers);
        res.end();
        next();
      })

      // GET request for key directions
    } else {
      res.writeHead(200, headers);
      res.write(messageQueue.dequeue() || 'up', 'utf-8');
      res.end();
      next();
      return;
    };
  };

  // OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
    return;
  };
};


