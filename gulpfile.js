const gulp = require('gulp');
const fs = require('fs');
const clean = require('gulp-clean');
const globalVars = require('./src/config/gulp-tasks/_global-vars');

// import gulp parts
require('./src/config/gulp-tasks/gt-iconfonts');
require('./src/config/gulp-tasks/gt-cf');
const gtTwig = require('./src/config/gulp-tasks/gt-twig');
const gtCss = require('./src/config/gulp-tasks/gt-css');
const gtJs = require('./src/config/gulp-tasks/gt-js');
const gtAssets = require('./src/config/gulp-tasks/gt-assets');
const gtWatch = require('./src/config/gulp-tasks/gt-watch');
const gtServer = require('./src/config/gulp-tasks/gt-server');

// prepare for build
function prodBuild(done) {
	globalVars.productionBuild = true;
	done();
}

function devBuild(done) {
	globalVars.productionBuild = false;
	done();
}

function copyFavicon(done) {
	fs.copyFileSync('favicon.png', 'dist/favicon.png');
	done();
}

// build all files for production
gulp.task('build', gulp.series(
	globalVars.createDistFolder,
	prodBuild,
	copyFavicon,
	gulp.parallel(
		gulp.series(gtTwig.cleanHTML, gtTwig.compileTWIG),
		gtCss.css,
		gulp.series(gtJs.siteJS, gtJs.libsJS, gtJs.pluginsJS, gtJs.mergeJS, gtJs.cleanJS),
		gulp.series(gtAssets.assetsImgPrep, gtAssets.assetsImgSync, gtAssets.assetsFonts)
	)
));

// build all files for development
gulp.task('build-dev', gulp.series(
	globalVars.createDistFolder,
	devBuild,
	copyFavicon,
	gulp.parallel(
		gtTwig.compileTWIG,
		gtCss.css,
		gulp.series(gtJs.siteJS, gtJs.libsJS, gtJs.pluginsJS, gtJs.mergeJS, gtJs.cleanJS),
		gulp.series(gtAssets.assetsImgPrep, gtAssets.assetsImgSync, gtAssets.assetsFonts)
	)
));

// delete dist folder
gulp.task('reset-dev', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

// start dev tasks
gulp.task('watch', gulp.series(
	globalVars.createDistFolder,
	devBuild,
	gulp.parallel(
		gtTwig.compileTWIG,
		gtCss.css,
		gulp.series(gtJs.siteJS, gtJs.libsJS, gtJs.pluginsJS, gtJs.mergeJS, gtJs.cleanJS),
		gulp.series(gtAssets.assetsImgPrep, gtAssets.assetsImgSync, gtAssets.assetsFonts)
	),
	gtWatch.watchFiles,
	gtServer.runServer
));