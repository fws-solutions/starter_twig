const gulp = require('gulp');
const fs = require('fs');
const clean = require('gulp-clean');
const runSequence = require('gulp4-run-sequence');
const globalVars = require('./src/config/gulp-tasks/_global-vars');

// build all files
gulp.task('build', function(done) {
	globalVars.createDistFolder();
	globalVars.productionBuild = true;
	fs.copyFileSync('favicon.png', 'dist/favicon.png');
	runSequence('clean-html', 'twig', 'css', 'js', 'assets');
	done();
});

gulp.task('build-dev', function(done) {
	globalVars.createDistFolder();
	globalVars.productionBuild = false;
	fs.copyFileSync('favicon.png', 'dist/favicon.png');
	runSequence('twig', 'css', 'js', 'assets');
	done();
});

// delete dist folder
gulp.task('reset-dev', function() {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

// start dev tasks
gulp.task('watch', function(done) {
	globalVars.createDistFolder();
	globalVars.productionBuild = false;
	runSequence('twig', 'css', 'js', 'watch-files', 'server');
});

// import gulp tasks
require('require-dir')('./src/config/gulp-tasks');