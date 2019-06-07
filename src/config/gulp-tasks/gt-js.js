const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const runSequence = require('gulp4-run-sequence');
const eslint = require('gulp-eslint');
const webpack = require('webpack-stream');
const webpackConfig = require('../../../webpack.config.js');
const gulpif = require('gulp-if');
const globalVars = require('./_global-vars');

const destDir = 'dist/js';

/*----------------------------------------------------------------------------------------------
	JS
 ----------------------------------------------------------------------------------------------*/

// task: build javascript
gulp.task('site-js', function () {
	return gulp.src('src/js/**.js')
		.pipe(plumber())
		.pipe(webpack(webpackConfig))
		.pipe(gulpif(globalVars.productionBuild, uglify()))
		.pipe(gulp.dest(destDir));
});

// task: validate javascript source files
gulp.task('js-lint', function () {
	return gulp.src('src/js/_project/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// task: concats all the libraries (jQuery, etc)
gulp.task('libs-js', function () {
	return gulp.src(['src/js/_libs/**/*.js'])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(destDir));
});

// task: concats all the plugins (Slick, etc)
gulp.task('plugins-js', function () {
	return gulp.src(['src/js/_plugins/**/*.js'])
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest(destDir));
});

// task: combines all the JS files from destination folder
gulp.task('merge-js', function() {
	return gulp.src([
		destDir + '/libs.js',
		destDir + '/plugins.js',
		destDir + '/site.js'
	])
		.pipe(plumber(globalVars.msgERROR))
		.pipe(sourcemaps.init())
		.pipe(concat('site.min.js'))
		.pipe(gulpif(globalVars.productionBuild, uglify()))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(destDir));
});

gulp.task('clean-js', function () {
	return gulp.src([
		destDir + '/libs.js',
		destDir + '/plugins.js',
		destDir + '/site.js'], {read: false})
		.pipe(clean());
});

gulp.task('js', function (done) {
	runSequence('site-js', 'libs-js', 'plugins-js', 'merge-js', 'clean-js', () => false);
	done();
});
