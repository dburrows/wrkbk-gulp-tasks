module.exports = function relativePath(filePath, rootDir) {
  return filePath.replace(rootDir, '');
};
