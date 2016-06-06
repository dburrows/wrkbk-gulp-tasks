var gulp = require('gulp');
var makeTaskFunctions = require('./packages/wrkbk-gulp-tasks');

var config = {
  paths: [
    'packages/package1/src',
    'packages/package2/src',
    'packages/server/src',
    'example/src'
  ],
  jsGlob: '**/*.js',
  testGlob: '**/*Tests.js',
  relativePathFromSrcToCompileDestination: '../lib',
  relativePathFromSrcToTestFolder: '../tests',
  runMatchingTestOnCompile: true,
  NODE_ENV: 'test'
};

var tasks = makeTaskFunctions(config, __dirname);

gulp.task("default", ['compile'], function () {
  // compile on change
  gulp.watch(tasks.watchPaths, tasks.compileOnSrcChange);
  // run single test on test change
  gulp.watch(tasks.testGlobs, tasks.runTestOnTestChange);
  // run all test on /index.js change
  gulp.watch(tasks.indexPaths, tasks.runAllTestsOnIndexChange);
});

gulp.task('clean', tasks.clean);
gulp.task('compile', ['clean'], tasks.compile);
gulp.task('compile-test', ['compile'], tasks.test);
gulp.task('test', tasks.test);



