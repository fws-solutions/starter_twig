const gulp = require('gulp');
const plumber = require('gulp-plumber');
const path = require('path');
const fs = require('fs');
const gulpif = require('gulp-if');
const print = require('gulp-print').default;
const twig = require('gulp-twig');
const data = require('gulp-data');
const prettify = require('gulp-html-prettify');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const htmlValidator = require('gulp-w3c-html-validator');
const globalVars = require('./_global-vars');


/*----------------------------------------------------------------------------------------------
	HBS
 ----------------------------------------------------------------------------------------------*/
const ComponentData = function (prop, src) {
	this.prop = prop;
	this.src = src;
};

ComponentData.prototype = {
	addOverrides: function () {
		this.overrides = {};
	}
};

function checkForIncludedJson(object) {
	// loop through all properties down the object's tree
	for (const prop in object) {
		if (object.hasOwnProperty(prop)) {
			const innerObject = JSON.parse(JSON.stringify(object[prop]));
			const propIncl = '>>';

			if (innerObject[propIncl]) {
				const inclData = JSON.parse(fs.readFileSync(`./src/twig/${innerObject[propIncl]}`));
				// check if component has included json
				checkForIncludedJson(inclData);
				object[prop] = inclData;
			}

			// check if object has properties that will override data from JSON
			for (const p in innerObject) {
				if (innerObject.hasOwnProperty(p) && p !== '>>') {
					object[prop][p] = innerObject[p];

					// check if inner prop has included json
					if (typeof innerObject[p] === 'object') {
						checkForIncludedJson(innerObject);
					}

					object[prop][p] = innerObject[p];
				}
			}
		}
	}

	return object;
}

// delete all html files from dist
gulp.task('clean-html', cleanHTML);

function cleanHTML() {
	return gulp.src('dist/**/*.html', {read: false})
		.pipe(clean());
}

// build twig files
gulp.task('twig', compileTWIG);

const twigSRC = ['./src/twig/pages/**/*.twig', './src/styleguide/styleguide.twig'];

function compileTWIG() {
	return gulp.src(twigSRC)
		.pipe(plumber())
		.pipe(data(function (file) {
			const src = './src/';
			const dir = path.relative('./src/', file.path).split(path.sep).slice(0, -1).join('/');
			const name = path.basename(file.path).replace('.twig', '') + '.json';
			const fileSrc = src + dir + '/' + name;
			const fileData = JSON.parse(fs.readFileSync(fileSrc));
			const includedJson = checkForIncludedJson(fileData);

			// check if there's included data in json
			if (includedJson.length > 0) {
				includedJson.forEach(function (cur) {
					const data = JSON.parse(fs.readFileSync(cur.src));

					// check if there are override properties for included data
					if (cur.overrides) {
						for (const prop in cur.overrides) {
							if (cur.overrides.hasOwnProperty(prop)) {
								data[prop] = cur.overrides[prop];
							}
						}
					}

					fileData[cur.prop] = data;
				});
			}

			return fileData;
		}))
		.pipe(twig())
		.on('error', function (err) {
			process.stderr.write(err.message + '\n');
			this.emit('end');
		})
		.pipe(gulpif(globalVars.productionBuild, prettify({indent_char: '	', indent_size: 1})))
		.pipe(print())
		.pipe(gulp.dest('dist'));
}



// Tasks
gulp.task('validate-html', validateHtml);

function validateHtml() {
	return gulp.src('dist/**/*.html')
		.pipe(htmlValidator())
		.pipe(htmlValidator.reporter());
}

// export tasks
module.exports = {
	compileTWIG: compileTWIG,
	cleanHTML: cleanHTML,
	validateHtml: validateHtml
};
