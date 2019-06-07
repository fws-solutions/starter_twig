const gulp = require('gulp');
const tap = require('gulp-tap');
const path = require('path');
const fs = require('fs');
const runSequence = require('gulp4-run-sequence');
const globalVars = require('./_global-vars');

/*----------------------------------------------------------------------------------------------
	Assets Files
 ----------------------------------------------------------------------------------------------*/
gulp.task('assets', function (done) {
	runSequence('assets-img-prep', 'assets-img-sync', 'assets-fonts');

	done();
});

// copy fonts
gulp.task('assets-fonts', function (done) {
	const distAssetsPath = 'dist/assets/fonts';
	const srcAssetsPath = 'src/assets/fonts';
	const distAssets = fs.existsSync(distAssetsPath) ? fs.readdirSync(distAssetsPath) : [];

	if (!fs.existsSync('dist/assets/fonts')) {
		fs.mkdirSync('./dist/assets/fonts');
	}

	if (fs.existsSync(srcAssetsPath)) {
		fs.readdirSync(srcAssetsPath).forEach(cur => {
			if (!distAssets.includes(cur)) {
				fs.copyFileSync(`${srcAssetsPath}/${cur}`, `${distAssetsPath}/${cur}`);
			}
		});
	}

	done();
});

// prepare images
gulp.task('assets-img-prep', function () {
	return gulp.src('dist/assets/images/**')
		.pipe(tap(function (file) {
			const fileStat = fs.lstatSync(file.path);

			if (!fileStat.isDirectory()) {
				globalVars.distAssets[path.basename(file.path).trim()] = fileStat.mtimeMs;
			}
		}));
});

// copy images
gulp.task('assets-img-sync', function () {
	return gulp.src('src/assets/images/**')
		.pipe(tap(function (file) {
			const assetPath = 'src/' + path.relative('./src/', file.path).split(path.sep).join('/');
			const fileStat = fs.lstatSync(file.path);

			// check if current item is directory or file
			if (fileStat.isDirectory()) {
				if (!fs.existsSync(assetPath.replace('src', 'dist'))) {
					fs.mkdirSync(assetPath.replace('src', 'dist'));
				}
			} else {
				// check if file is missing from dist folder of if it has been changed
				if (!(globalVars.distAssets[path.basename(file.path)] === fileStat.mtimeMs)) {
					fs.copyFileSync(assetPath, assetPath.replace('src', 'dist'));

					console.log('\x1b[32m');
					console.log(`copied file: '${assetPath}'`);
					console.log('\x1b[37m');
				}
			}
		}));
});
