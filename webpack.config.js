const path = require('path');

module.exports = {
	mode: 'none',
	entry: './src/js/site.js',
	output: {
		path: path.join(__dirname, './dist/js/'),
		filename: 'site.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};
