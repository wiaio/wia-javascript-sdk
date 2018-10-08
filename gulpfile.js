/**
 * this is the main task runner for managing the SampleSDK
 */

/*
 * define requirements
 * ***********************************************************************************************
 */

const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const size = require('gulp-size');
const clean = require('gulp-clean');
const bump = require('gulp-bump');
const jshint = require('gulp-jshint');
const exec = require('child_process').exec;
const sys = require('sys');
const tasklist = require('gulp-task-listing');
const runSequence = require('run-sequence');
const inject = require('gulp-inject-string');
const babel = require('gulp-babel');

const PROJECT_BASE_PATH = __dirname + '';

/*
 * helper functions
 * ***********************************************************************************************
 */

// well display console expressions
function puts(error, stdout, stderr) {
  sys.puts(stdout);
}

// execute the command line command in the shell
function executeCommand(commandLine, cb) {
  exec(commandLine, function (error, stdout, stderr) {
    puts(error, stdout, stderr);
    cb(null); // will allow gulp to exit the task successfully
  });
}

// will execute the needed stuff to bump successfully
function bumpHelper(bumpType, cb) {
  runSequence('npm-bump-'+bumpType, 'build', 'example-upgrade-tag', 'git-tag-commit', 'git-tag', cb);
}


/*
 * gulp default task
 * ***********************************************************************************************
 */

gulp.task('default', tasklist.withFilters(function (task) {
  return (['build', 'clean', 'test', 'bump-major', 'bump-minor', 'bump-patch'].indexOf(task) < 0);
}));

/*
 * gulp main tasks
 * ***********************************************************************************************
 */

gulp.task('build', ['clean'], function (cb) {
  const pkg = require('./package.json');

  return gulp.src(['./src/*.js', './src/resources/*.js'])
    .pipe(concat('wia.js'))
    .pipe(babel({
      "presets": [ [ '@babel/env', { modules: false } ] ]
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('wia.min.js'))
    .pipe(inject.append('/*! Wia SDK for Javascript v' + pkg.version + ' | Wia Technologies Limited | wia.io */'))
    .pipe(uglify())
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function (cb) {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('bump-patch', function (cb) {
  bumpHelper('patch', cb);
});

gulp.task('bump-minor', function (cb) {
  bumpHelper('minor', cb);
});

gulp.task('bump-major', function (cb) {
  bumpHelper('major', cb);
});

gulp.task('test', ['lint', 'karma-tests']);

/*
 * gulp helper tasks
 * ***********************************************************************************************
 */

// versioning tasks

gulp.task('npm-bump-patch', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('npm-bump-minor', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('npm-bump-major', function () {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('git-describe', function (cb) {
  console.log('Current release is now:');
  executeCommand('git describe --abbrev=0 --tags', cb);
});

gulp.task('git-tag', function (cb) {
  runSequence('git-tag-create', 'git-tag-push', 'git-describe', cb);
});

gulp.task('git-tag-create', function (cb) {
  const pkg = require('./package.json');
  const v = 'v' + pkg.version;
  const message = 'Release ' + v;
  const commandLine = 'git tag -a ' + v + ' -m \'' + message + '\'';
  executeCommand(commandLine, cb);
});

gulp.task('git-tag-push', function (cb) {
  const commandLine = 'git push origin master --tags';
  executeCommand(commandLine, cb);
});

gulp.task('git-tag-commit', function (cb) {
  const pkg = require('./package.json');
  const v = 'v' + pkg.version;
  const message = 'Release ' + v;
  const commandLine = 'git add -A && git commit -a -m\'' + message + '\'';
  executeCommand(commandLine, cb);
});

gulp.task('example-upgrade-tag', function () {
  const pkg = require('./package.json');
  const v = pkg.version;
  const file = 'example/*.html';

  return gulp.src([file])
    .pipe(replace(/wia-javascript-sdk-([\d.]+)\.js/g, 'wia-javascript-sdk-' + v + '.js'))
    .pipe(gulp.dest('example'));
});

// continous integration tasks

gulp.task('lint', function (cb) {
  return gulp.src('./src/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('karma-tests', function (cb) {
  const karmaConfigFile = PROJECT_BASE_PATH+'/test/karma.conf.js';
  const commandLine = 'karma start '+karmaConfigFile;
  executeCommand(commandLine, cb);
  console.log();
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build']);
});