'use strict';

var publicdir = './public',
    express = require('express'),
    compress = require('compression'),
    fs = require('fs'),
    server = express();

server.use(compress());

server.use(function(req, res, next) {
  if (req.path.indexOf('.') === -1) {
    var file = publicdir + req.path + '.html';
    fs.exists(file, function(exists) {
      if (exists) {
        req.url += '.html';
      }
      next();
    });
  } else {
    next();
  }
});

server.use(express.static(publicdir));
server.listen(process.env.PORT || 3000);
