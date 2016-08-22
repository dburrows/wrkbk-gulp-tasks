var filePathToDirPath = require('./filePathToDirPath');

module.exports = function getFileInfo(config, filePath) {
  var pathArray = filePath.split('/');
  var filename = pathArray.pop();

  return {
    dir: filePathToDirPath(filePath),
    pathArray: pathArray,
    filename: filename,
    directory: pathArray.join('/'),
    testFilename: filename.slice(0,-3) + 'Test.js'
  };
};
