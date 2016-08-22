'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeServer;
var express = require('express');

function makeServer(rootPath) {
  var app = express();

  console.log('mounting root path: ', rootPath);
  app.use('/', express.static(rootPath));

  app.get('/', function (req, res) {
    res.send('\n      <!doctype html>\n      <html lang="en">\n      <head>\n        <meta charset="utf-8">\n        <title>Example Page</title>\n        <meta name="description" content="Example Page">\n        <link rel="stylesheet" href="css/main.css">\n      </head>\n      <body>\n        <h1>Example Page</h1>\n        <p>\n          Lorem ipsum.\n        </p>\n        <script src="/packages/package1/lib/blah/a.js"></script>\n      </body>\n      </html>\n    ');
  });

  return app;
}
//# sourceMappingURL=server.js.map
