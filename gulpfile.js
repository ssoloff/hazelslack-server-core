const babel = require('gulp-babel')
const coveralls = require('gulp-coveralls')
const del = require('del')
const eslint = require('gulp-eslint')
const excludeGitignore = require('gulp-exclude-gitignore')
const gulp = require('gulp')
const isparta = require('isparta')
const istanbul = require('gulp-istanbul')
const mocha = require('gulp-mocha')
const nsp = require('gulp-nsp')
const path = require('path')
const plumber = require('gulp-plumber')

// Initialize the babel transpiler so files gets compiled when they're loaded
require('babel-register')

function checkSecurity (done) {
  nsp({package: path.resolve('package.json')}, done)
}

function clean () {
  return del('dist')
}

function compile () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
}

function lint () {
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

function publishCoverage () {
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

function watch () {
  gulp.watch(['lib/**/*.js', 'test/**'], gulp.parallel(test))
    .on('error', () => {}) // ignore errors during watch so Gulp does not exit
}

const test = gulp.series(pretest, testInternal)

gulp.task('checkSecurity', checkSecurity)

gulp.task('clean', clean)

gulp.task('compile', compile)

gulp.task('default', gulp.parallel(lint, test))

gulp.task('lint', lint)

gulp.task('prepublish', gulp.series(clean, gulp.parallel(checkSecurity, compile)))

gulp.task('publishCoverage', publishCoverage)

gulp.task('test', test)

gulp.task('watch', watch)
