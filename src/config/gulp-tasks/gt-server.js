const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('server', function(done) {
	connect.server({
		root: 'dist',
		livereload: true
	});
	done();
});