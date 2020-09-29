const gulp = require('gulp');

/*----------------------------------------------------------------------------------------------
	Watch
 ----------------------------------------------------------------------------------------------*/
gulp.task('watch-files', watchFiles);

function watchFiles(done) {
	// watch .scss files
	gulp.watch(['src/assets/scss/**/*.scss', 'src/twig/**/**/*.scss'], gulp.parallel(['css', 'sass-lint']));

	// watch .js files
	gulp.watch('src/assets/js/**/*.js', gulp.series('js'));

	// watch .twig and .json files
	gulp.watch(['src/components/**/**/*.twig', 'src/components/**/**/*.json'], gulp.series('twig'));

	done();
}

// export tasks
module.exports = {
	watchFiles: watchFiles
};
