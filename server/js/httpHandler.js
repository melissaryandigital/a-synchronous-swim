const fs = require('fs');
// const url  = require('url');
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
    //let backgroundImage = '';

    const buff = Buffer.alloc(1024);

    req.on('data', (chunk) => {
      //backgroundImage += chunk;
      buff.write(chunk.toString());
    });

    req.on('end', () => {
      res.writeHead(201, headers);
      // console.log('POSTED')
      // console.log(`\t${backgroundImage}`);
      fs.writeFile(module.exports.backgroundImageFile, buff.toString(), (err) => {
        res.end();
        if (!err) {
          console.log('wrote file to disk!');
          return;
        }

        console.log(`ERROR: ${err}`);
      })
      next();
    });

    return;
  }

  // GET
  if (req.method === 'GET') {
    var mypath = path.join('.', req.url);

    if (path.extname(mypath) === '.jpg') {

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


