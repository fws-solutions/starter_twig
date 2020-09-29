const gulp = require('gulp');
const fs = require('fs');
const argv = require('yargs').argv;
const globalVars = require('./_global-vars');

/*----------------------------------------------------------------------------------------------
	Create/Read/Update Files
 ----------------------------------------------------------------------------------------------*/
function createFiles(arg, type) {
	const part = type === 'main' ? 'main' : `${type}s`;
	let directory = `src/twig/${part}/${arg}`;

	function create(file) {
		let temp = `${type}-twig-temp.txt`;
		let filename;

		// detect which file to create or update
		if (file === 'scss') {
			temp = `${type}-scss-temp.txt`;
			filename = `_${arg}.scss`;
		} else if (file === 'json') {
			temp = `${type}-json-temp.txt`;
			filename = `${arg}.json`;
		} else if (file === 'twig') {
			filename = `${arg}.twig`;
		}

		const styleSRC = `src/sass/layout/_${part}.scss`;
		const readDir = file === 'style' ? styleSRC : `src/config/cf-templates/${temp}`;
		const writeDir = file === 'style' ? styleSRC : `${directory}/${filename}`;

		globalVars.rf(readDir, function(data) {
			const output = file === 'style' ? (data + `\n@import '../../twig/${part}/${arg}/${arg}';`) : data.replace(new RegExp(`@{${type}}`, 'g'), arg);
			fs.writeFileSync(writeDir, output);
		});
	}

	// create if template or module doesn't exists
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);

		create('twig');

		if (type !== 'partial') {
			create('json');
		}

		if (type === 'component' || type === 'partial' || type === 'main') {
			create('scss');
			create('style');
		}

		globalVars.logMSG(`src/config/cf-templates/${type}-log-temp.txt`, arg, 'green');
	} else {
		globalVars.logMSG(globalVars.warningTemp, `ERROR: ${type} '${arg}' already exists`);
	}
}

function cf(done) {
	if (argv.page && typeof argv.page === 'string') {
		// create page TWIG and JSON files
		createFiles(argv.page.toLowerCase(), 'page');
	} else if (argv.component && typeof argv.component === 'string') {
		// create component TWIG, JSON and SCSS files
		createFiles(argv.component.toLowerCase(), 'component');
	} else if (argv.partial && typeof argv.partial === 'string') {
		// create partial TWIG and SCSS files
		createFiles(argv.partial.toLowerCase(), 'partial');
	} else if (argv.main && typeof argv.main === 'string') {
		// create main TWIG and SCSS files
		createFiles(argv.main.toLowerCase(), 'main');
	} else {
		globalVars.logMSG(globalVars.warningTemp, 'ERROR: no parameters were passed');
	}

	done();
}

gulp.task('cf', cf);
