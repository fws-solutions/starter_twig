const gulp = require('gulp');
const	path = require('path');
const	fs = require('fs');
const	globalVars = require('./_global-vars');

/*----------------------------------------------------------------------------------------------
	Watch
 ----------------------------------------------------------------------------------------------*/
gulp.task('watch-files', function() {
	// watch .scss files
	gulp.watch(['src/sass/**/*.scss', 'src/twig/**/**/*.scss'], gulp.series(['css', 'sass-lint']));

	// watch .js files
	gulp.watch('src/js/**/*.js', gulp.series('js'));

	// watch .twig and .json files
	gulp.watch(['src/twig/**/**/*.twig', 'src/twig/**/**/*.json'], gulp.series('twig'));
});
