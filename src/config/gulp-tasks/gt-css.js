const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const flexBugsFix = require('postcss-flexbugs-fixes');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const globalVars = require('./_global-vars');

/*----------------------------------------------------------------------------------------------
	SCSS
 ----------------------------------------------------------------------------------------------*/
const sassSRC = ['src/sass/**/*.scss', 'src/twig/**/**/*.scss'];

// compile scss files
gulp.task('css', function () {
	const processors = [
		autoprefixer({browsers: ['last 2 versions', 'ios >= 8']}),
		flexBugsFix
	];

	return gulp.src(sassSRC)
		.pipe(plumber(globalVars.msgERROR))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: globalVars.productionBuild ? 'compressed' : 'expanded'}))
		.pipe(postcss(processors))
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('sass-lint', function () {
	return gulp.src(['src/sass/**/*.scss', 'src/twig/**/**/*.scss'])
		.pipe(sassLint({
			config: '.sass-lint.yml'
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});