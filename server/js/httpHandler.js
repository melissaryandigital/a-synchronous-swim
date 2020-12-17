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

  // res.setHeader('Access-Control-Allow-Origin', '*');
	// res.setHeader('Access-Control-Request-Method', '*');
	// res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	// res.setHeader('Access-Control-Allow-Headers', '*');

  // GET
  if (req.method === 'GET') {
    var mypath = path.join('.', req.url);
    console.log(path.extname(mypath));
    // Check file extension for images
    if (path.extname(mypath) === '.jpg') {
      // console.log(mypath);
      const filePath = path.join(__dirname, mypath);
      const readStream = fs.createReadStream(filePath);
      let stat = {};
      try {
        stat = fs.statSync(filePath);

        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': stat.size
        })

        readStream.pipe(res);

        res.end();
        next();

      } catch (err) {
        res.writeHead(404, headers);
        // res.write(err, 'utf8');
        // console.log(err);
        res.end();
        next();
        return;
      }

      readStream.on('error', (err) => {
        res.writeHead(404, headers);
        // res.write(err, 'utf8');
        console.log(err);
        res.end();
        next();
      });


    } else {
      res.writeHead(200, headers);
      res.write(messageQueue.dequeue() || 'up', 'utf-8');
      res.end();
      next();
      return;
    }
  };
  // OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
    return;
  };
};


