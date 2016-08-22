module.exports = function filePathToDirPath(filePath) {
  var dp = filePath.split('/');
  dp.pop();
  return dp.join('/');
};
