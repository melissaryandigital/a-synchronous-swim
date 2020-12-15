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

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {
    res.writeHead(200, headers);
    // Create random swim move

    var randomMove = Swim.random();
    res.write(randomMove, 'utf-8');
    res.end();
    next();
  }

  res.writeHead(200, headers);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};


