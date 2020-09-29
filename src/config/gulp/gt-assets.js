const gulp = require('gulp');
const tap = require('gulp-tap');
const path = require('path');
const fs = require('fs');
const globalVars = require('./_global-vars');

/*----------------------------------------------------------------------------------------------
	Assets Files
 ----------------------------------------------------------------------------------------------*/
gulp.task('assets', gulp.series(assetsImgPrep, assetsImgSync, assetsFontsAndIcons));

// copy fonts
function assetsFontsAndIcons(done) {
	assetsFontFiles('dist/assets/fonts', 'src/assets/fonts');
	done();
}

function assetsFontFiles(distAssetsPath, srcAssetsPath) {
	const distAssets = fs.existsSync(distAssetsPath) ? fs.readdirSync(distAssetsPath) : [];

	if (!fs.existsSync(distAssetsPath)) {
		fs.mkdirSync('./' + distAssetsPath);
	}

	if (fs.existsSync(srcAssetsPath)) {
		fs.readdirSync(srcAssetsPath).forEach(cur => {
			if (!distAssets.includes(cur)) {
				fs.copyFileSync(`${srcAssetsPath}/${cur}`, `${distAssetsPath}/${cur}`);
			}
		});
	}
}

// prepare images
function assetsImgPrep() {
	return gulp.src('dist/assets/images/**')
		.pipe(tap(function(file) {
			const fileStat = fs.lstatSync(file.path);

			if (!fileStat.isDirectory()) {
				globalVars.distAssets[path.basename(file.path).trim()] = fileStat.mtimeMs;
			}
		}));
}

// copy images
function assetsImgSync() {
	return gulp.src('src/assets/images/**')
		.pipe(tap(function(file) {
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
}

// export tasks
module.exports = {
	assetsImgPrep: assetsImgPrep,
	assetsImgSync: assetsImgSync,
	assetsFontsAndIcons: assetsFontsAndIcons
};
