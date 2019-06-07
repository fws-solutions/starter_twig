const path = require('path');

module.exports = {
	mode: "none",
	entry: './src/js/site.js',
	output: {
		path: path.join(__dirname, './dist/js/'),
		filename: "site.js"
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				options: {
					presets: ['babel-preset-env']
				},
			}
		]
	}
};
