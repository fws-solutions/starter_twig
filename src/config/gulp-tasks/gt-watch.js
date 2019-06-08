const gulp = require('gulp');

/*----------------------------------------------------------------------------------------------
	Watch
 ----------------------------------------------------------------------------------------------*/
gulp.task('watch-files', watchFiles);

function watchFiles(done) {
	// watch .scss files
	gulp.watch(['src/sass/**/*.scss', 'src/twig/**/**/*.scss'], gulp.parallel(['css', 'sass-lint']));

	// watch .js files
	gulp.watch('src/js/**/*.js', gulp.series('js'));

	// watch .twig and .json files
	gulp.watch(['src/twig/**/**/*.twig', 'src/twig/**/**/*.json'], gulp.series('twig'));

	done();
}

// export tasks
module.exports = {
	watchFiles: watchFiles
};
