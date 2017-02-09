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
import * as isparta from 'isparta'
import istanbul from 'gulp-istanbul'
import jasmine from 'gulp-jasmine'
import nsp from 'gulp-nsp'
import path from 'path'

const dirs = {
  coverage: 'coverage',
  dist: 'dist',
  js: {
    main: 'lib',
    test: 'spec'
  }
}
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
  return del([dirs.coverage, dirs.dist])
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

function pretest () {
  return gulp.src(paths.js.main)
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire())
}

export function publishCoverage () {
  if (!process.env.CI) {
    return Promise.resolve()
  }

  return gulp.src(path.join(__dirname, `${dirs.coverage}/lcov.info`))
    .pipe(coveralls())
}

function testInternal () {
  return gulp.src(paths.js.test)
    .pipe(jasmine({
      verbose: true
    }))
    .pipe(istanbul.writeReports())
}

export function watch () {
  gulp.watch([paths.js.main, paths.js.test], gulp.parallel(test))
    .on('error', () => {}) // ignore errors during watch so Gulp does not exit
}

export const test = gulp.series(pretest, testInternal)

gulp.task('default', gulp.parallel(lint, test))

gulp.task('prepublish', gulp.series(clean, gulp.parallel(checkSecurity, compile)))
