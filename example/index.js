require('source-map-support').install();

var path = require('path');
var makeServer = require('../packages/server/').default;

var rootPath = path.resolve(__dirname, '../');

var server = makeServer(rootPath);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
