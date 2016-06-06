var express = require('express');

export default function makeServer(rootPath) {
  let app = express();

  console.log('mounting root path: ', rootPath);
  app.use('/', express.static(rootPath));

  app.get('/', function (req, res) {
    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Example Page</title>
        <meta name="description" content="Example Page">
        <link rel="stylesheet" href="css/main.css">
      </head>
      <body>
        <h1>Example Page</h1>
        <p>
          Lorem ipsum.
        </p>
        <script src="/packages/package1/lib/blah/a.js"></script>
      </body>
      </html>
    `);
  });

  return app;
}






