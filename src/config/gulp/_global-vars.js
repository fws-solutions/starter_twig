const fs = require('fs');
const notify = require('gulp-notify');

module.exports = {
	productionBuild: false,
	distAssets: [],
	msgERROR: {
		errorHandler: notify.onError({
			title: 'Please, fix the ERROR below:',
			message: '<%= error.message %>',
			time: 2000
		})
	},
	createDistFolder(done) {
		if (!fs.existsSync('dist')) {
			fs.mkdirSync('./dist');
		}
		if (!fs.existsSync('dist/assets')) {
			fs.mkdirSync('./dist/assets');
		}
		if (!fs.existsSync('dist/assets/images')) {
			fs.mkdirSync('./dist/assets/images');
		}

		done();
	}
};
