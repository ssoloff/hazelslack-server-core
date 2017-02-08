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

// Initialize the babel transpiler so ES2015 files gets compiled when they're loaded
require('babel-register')

gulp.task('babel', ['clean'], () => {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', () => {
  return del('dist')
})

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls())
})

gulp.task('default', ['static', 'test', 'coveralls'])

gulp.task('nsp', (done) => {
  nsp({package: path.resolve('package.json')}, done)
})

gulp.task('pre-test', () => {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire())
})

gulp.task('prepublish', ['nsp', 'babel'])

gulp.task('static', () => {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('test', ['pre-test'], (done) => {
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
})

gulp.task('watch', () => {
  gulp.watch(['lib/**/*.js', 'test/**'], ['test'])
})
