/*
 * Copyright (C) 2017 Steven Soloff
 *
 * This software is licensed under the terms of the GNU Affero General Public
 * License version 3 or later (https://www.gnu.org/licenses/).
 */

import babel from 'gulp-babel'
import coveralls from 'gulp-coveralls'
import del from 'del'
import eslint from 'gulp-eslint'
import excludeGitignore from 'gulp-exclude-gitignore'
import gulp from 'gulp'
import istanbul from 'gulp-babel-istanbul'
import jasmine from 'gulp-jasmine'
import nsp from 'gulp-nsp'
import path from 'path'
import streamToPromise from 'stream-to-promise'

const dirs = (() => {
  const BUILD_DIR = '.build'
  return {
    build: BUILD_DIR,
    coverage: `${BUILD_DIR}/coverage`,
    dist: `${BUILD_DIR}/dist`,
    js: {
      main: 'lib',
      test: 'spec'
    }
  }
})()

const paths = {
  js: {
    all: '**/*.js',
    main: `${dirs.js.main}/**/*.js`,
    test: `${dirs.js.test}/**/*.js`
  }
}

export function checkSecurity (done) {
  nsp({package: path.resolve('package.json')}, done)
}

export function clean () {
  return del(dirs.build)
}

export function compile () {
  return gulp.src(paths.js.main)
    .pipe(babel())
    .pipe(gulp.dest(dirs.dist))
}

export function lint () {
  return gulp.src(paths.js.all)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

export function publishCoverage () {
  if (process.env.CI !== 'true') {
    return Promise.resolve()
  }

  return gulp.src(path.join(__dirname, `${dirs.coverage}/lcov.info`))
    .pipe(coveralls())
}

export function test () {
  return streamToPromise(
    gulp.src(paths.js.main)
      .pipe(excludeGitignore())
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire())
  )
  .then(() => streamToPromise(
    gulp.src(paths.js.test)
      .pipe(excludeGitignore())
      .pipe(jasmine({
        verbose: true
      }))
  ))
  .then(() => streamToPromise(
    gulp.src('.')
      .pipe(istanbul.writeReports({
        dir: dirs.coverage
      }))
      .pipe(istanbul.enforceThresholds({
        thresholds: {
          global: 0
        }
      }))
  ))
}

export function watch () {
  gulp.watch([paths.js.main, paths.js.test], gulp.parallel(test))
    .on('error', () => {}) // ignore errors during watch so Gulp does not exit
}

gulp.task('default', gulp.parallel(lint, test))

gulp.task('prepublish', gulp.series(clean, gulp.parallel(checkSecurity, compile)))
