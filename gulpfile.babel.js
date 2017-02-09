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
import mocha from 'gulp-mocha'
import nsp from 'gulp-nsp'
import path from 'path'
import plumber from 'gulp-plumber'

export function checkSecurity (done) {
  nsp({package: path.resolve('package.json')}, done)
}

export function clean () {
  return del('dist')
}

export function compile () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
}

export function lint () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function pretest () {
  return gulp.src('lib/**/*.js')
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

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls())
}

function testInternal (done) {
  let mochaErr

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', (err) => {
      mochaErr = err
    })
    .pipe(istanbul.writeReports())
    .on('end', () => {
      done(mochaErr)
    })
}

export function watch () {
  gulp.watch(['lib/**/*.js', 'test/**'], gulp.parallel(test))
    .on('error', () => {}) // ignore errors during watch so Gulp does not exit
}

export const test = gulp.series(pretest, testInternal)

gulp.task('default', gulp.parallel(lint, test))

gulp.task('prepublish', gulp.series(clean, gulp.parallel(checkSecurity, compile)))
