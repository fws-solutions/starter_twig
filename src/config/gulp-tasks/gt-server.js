const gulp = require('gulp');
const connect = require('gulp-connect');

function runServer(done) {
	connect.server({
		root: 'dist',
		livereload: true
	});
	done();
}

gulp.task('server', runServer);

// export tasks
module.exports = {
	runServer: runServer
};