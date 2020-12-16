const fs = require('fs');
const url  = require('url');
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

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);

  // Find the requested path name
  var url_parts = url.parse(req.url);
  var pathName = url_parts.pathname;
  // 'spec/missing.jpg'
  console.log(pathName);
  switch (pathName) {
    case '/background.jpg':
      if (req.method === 'GET') {
        // read image from disk
        fs.readFile(path.join('.', pathName), 'utf8', (err, data) => {
          if (err) {
            // if it doesn't exist return 404 status code
            res.writeHead(404, headers);
            return;
          }

          res.writeHead(200, headers);
          // return image and 200 status code
          res.write(data, 'utf8');
          res.end();
          next();
        });

        // res.writeHead(200, headers);
        // res.end();
        // next();
        return;
      }

    case '/spec/missing.jpg':
      res.writeHead(404, headers);
      res.end();
      next();
    case '/':
      if (req.method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
        next();
        return;
      }

      if (req.method === 'GET') {
        res.writeHead(200, headers);

        res.write(messageQueue.dequeue() || 'up', 'utf-8');
        res.end();
        next();
        return;
      }
    default:
      // 404
      res.writeHead(404, headers);
      res.end();
      next();
  }
};


