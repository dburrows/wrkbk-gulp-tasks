# Wrkbk Gulp Tasks

Various Gulp task functions for the Wrkbk monrepo - this repo is an example monorepo, the package itself is at `/packages/wrkrbk-gulp-tasks`

## Watch Tasks

- compile ES5 to ES6 with Babel
- generate external source maps for compiled code
- run relevant single test when source or test file changes (if enabled innfig)
- run all tests when root index.js changes
- delete files from compilation folder when deleted in src

## Single Run Tasks

- clean all destination folders then compile ES6
- compile all ES6
- run all tests

