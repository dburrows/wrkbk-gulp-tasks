var gutil = require('gulp-util');
var path = require('path');

module.exports = function destinationDirectory(watchfolderAbsPaths, fileDir, destRelativePath) {
  var destPath;

  watchfolderAbsPaths.forEach(function(absPath) {
    if(fileDir.match(absPath)) {
      destPath =  path.resolve(absPath, destRelativePath, fileDir.replace(absPath, './'));
    }
  });

  if (!destPath) {
    gutil.log(gutil.colors.red('Destination path not found?'));
  }
  return destPath;
};
