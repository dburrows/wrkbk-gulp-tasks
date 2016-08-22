var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');
var babelCompiler = require('babel-core/register');
var del = require('del');
var fs = require('fs');
var path = require('path');

var destinationDirectory = require('./utils/destinationDirectory');
var filePathToDirPath = require('./utils/filePathToDirPath');
var getFileInfo = require('./utils/getFileInfo');
var relativePath = require('./utils/relativePath');

/* ---------- Task Functions ---------- */

/* Generate gulp task functions for the following:
 *
 * Watch Tasks
 *
 * - compile ES5 to ES6 with Babel
 * - generate external source maps for compiled code
 * - run relevant single test when source or test file changes (if enabled in config)
 * - run all tests when root index.js changes
 * - delete files from compilation folder when deleted in src
 *
 * Single Run Tasks
 *
 * - clean all destination folders then compile ES6
 * - compile all ES6
 * - run all tests
 *
 */

module.exports = function makeTaskFunctions(config, rootDir) {
  var watchPaths = config.paths.map(function(p) {
    return path.join(p, '/', config.jsGlob);
  });

  var watchFolderAbsPaths = config.paths.map( function(folderRelPath) {
    return path.resolve(rootDir, folderRelPath);
  });

  var testFolderPaths = config.paths.map( function(srcPath) {
    return path.join(srcPath, config.relativePathFromSrcToTestFolder);
  });

  var indexPaths = config.paths.map(function(srcPath) {
    return path.join(srcPath, '../index.js');
  });

  var watchGlobs = config.paths.map( function(p) {
    return path.join(p, config.jsGlob);
  });
  var testGlobs = testFolderPaths.map( function(p) {
    return path.join(p, config.testGlob);
  });

  return {
    watchPaths: watchPaths,
    watchFolderAbsPaths: watchFolderAbsPaths,
    testFolderPaths: testFolderPaths,
    watchGlobs: watchGlobs,
    testGlobs: testGlobs,
    indexPaths: indexPaths,
    compileOnSrcChange: compileOnSrcChange(config, watchFolderAbsPaths, rootDir),
    runTestOnTestChange: runTestOnTestChange(config),
    runAllTestsOnIndexChange: runAllTestsOnIndexChange(config),
    clean: makeClean(config, rootDir),
    compile: makeCompile(config, watchGlobs),
    test: makeTest(config, testGlobs)
  };
};


// CLEAN TASKS

function makeClean(config, rootDir) {

  return function () {
    var cleanPaths = config.paths.map(function(srcFolderPath) {
      var srcPath = path.resolve(rootDir, srcFolderPath);
      var destPath = path.resolve(srcPath, config.relativePathFromSrcToCompileDestination );
      return destPath;
    });

    del.sync(cleanPaths);
  };

}


// COMPILE TASKS

function makeCompile(config, watchGlobs) {
  return function() {

    return gulp.src(watchGlobs)
      .pipe(sourcemaps.init())
      .pipe(babel())
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'));
        gutil.log(gutil.colors.red(err.message));
        gutil.log('\n' + err.codeFrame);
      })
      .pipe(sourcemaps.write('.', {
        sourceRoot: function(file) {
          var srcDirPath = filePathToDirPath(file.path);
          var dirRelToRoot = path.relative(file.base, srcDirPath);
          var destRoot = path.resolve(file.base, config.relativePathFromSrcToCompileDestination);
          var destDir = path.join( destRoot, dirRelToRoot);

          return path.relative(destDir, file.base);
        }
      }))
      .pipe(gulp.dest(function(file) {
        return path.resolve(file.base, config.relativePathFromSrcToCompileDestination);
      }));
  };
}


// WATCH TASKS

function compileOnSrcChange(config, watchfolderAbsPaths, rootDir) {
  // watch and compile
  return function(event) {
    gutil.log('File', event.type, relativePath(event.path, rootDir));

    var isFile = event.path.match(/\.js$/gi) ? true : false;

    var fi = getFileInfo(config, event.path);

    var destDir = destinationDirectory(watchfolderAbsPaths, fi.directory, config.relativePathFromSrcToCompileDestination);

    if( (event.type === 'added' || event.type === 'changed') && destDir && isFile) {
      // compile
      gulp.src(event.path)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel())
        .on('error', function(err) {
          gutil.log(gutil.colors.red('[Error]'));
          gutil.log(gutil.colors.red(err.message));
          gutil.log('\n' + err.codeFrame);
        })
        .pipe(sourcemaps.write('.', {
          sourceRoot: function(file) {
            return path.relative( destDir, file.base ) + '/';
          }
        }))
        .pipe(gulp.dest(destDir));

      gutil.log(gutil.colors.green(
        'Compiled: ' + path.join( relativePath(destDir, rootDir), fi.filename)
      ));

      if(config.runMatchingTestOnCompile) {
        // run test file
        var testDirPath = destinationDirectory(watchfolderAbsPaths, fi.directory, config.relativePathFromSrcToTestFolder);
        gulp.src(path.join(testDirPath, fi.testFilename), {read: false})
          .pipe(plumber())
          .pipe(mocha({
            env: {'NODE_ENV': config.NODE_ENV},
            compilers: { js: babelCompiler }
          }))
          .on('error', function(err) {
            gutil.log(gutil.colors.red('[Test Failed]'));
            gutil.log(gutil.colors.red(err));
          });
      }

    } else if (event.type === 'deleted' && isFile) {
      var deletePath = path.resolve(destDir, './' + fi.filename);

      try {
        fs.unlinkSync(deletePath);
        fs.unlinkSync(deletePath + '.map');
      }
      catch (e) {
        gutil.log(gutil.colors.red('Could not delete ', deletePath));
      }

      gutil.log(gutil.colors.red('Deleted: ' + relativePath(deletePath, rootDir)));
    }
  };
}


// TEST TASKS

function makeTest(config, testGlobs) {
  return function() {

    return gulp.src(testGlobs, {read: false})
      .pipe(mocha({
        env: {'NODE_ENV': config.NODE_ENV},
        compilers: { js: babelCompiler }
      }));

  };
}

function runTestOnTestChange(config) {
  return function (event) {
    var isFile = event.path.match(/\.js$/gi) ? true : false;

    if ( (event.type === 'added' || event.type === 'changed') && isFile) {
      return gulp.src(event.path, {read: false})
        .pipe(plumber())
        .pipe(mocha({
          env: {'NODE_ENV': config.NODE_ENV},
          compilers: { js: babelCompiler }
        }))
        .on('error', function(err) {
          gutil.log(gutil.colors.red('[Test Failed]'));
          gutil.log(gutil.colors.red(err));
        });
    }

  };
}

function runAllTestsOnIndexChange(config) {
  return function(event) {
    var dir = filePathToDirPath(event.path);
    console.log('allrun: ', dir);
    return gulp.src(path.join(dir, config.testGlob), {read: false})
      .pipe(plumber())
      .pipe(mocha({
        env: {'NODE_ENV': config.NODE_ENV},
        compilers: { js: babelCompiler }
      }))
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Test Failed]'));
        gutil.log(gutil.colors.red(err));
      });
  };
}






