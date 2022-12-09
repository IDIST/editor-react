/*!
 * Jodit Editor PRO (https://xdsoft.net/jodit/)
 * See LICENSE.md in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net/jodit/pro/
 */
const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv, dir = process.cwd()) => {
	const debug = !argv || !argv.mode || !argv.mode.match(/production/);

	return {
		context: dir,

		entry: './src/index.js',
		devtool: debug ? 'inline-source-map' : false,

		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: require(path.join(dir, './babel.config.json'))
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},

		resolve: {
			alias: {
				'jodit-react': path.join(__dirname, './src'),
				'jodit-pro': path.join(__dirname, '..', './')
			}
		},

		output: {
			path: path.join(dir, './build/'),
			filename: 'jodit-react.js',
			library: ['JoditEditor', 'Jodit'],
			libraryTarget: 'umd'
		},

		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(
						debug ? 'development' : 'production'
					)
				}
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new webpack.NormalModuleReplacementPlugin(
				/include\.jodit\.js/,
				path.join(__dirname, './include.jodit.js')
			)
		],

		externals: {
			jodit: 'jodit',
			Jodit: 'Jodit',
			react: {
				root: 'React',
				commonjs2: 'react',
				commonjs: 'react',
				amd: 'react'
			},
			'react-dom': {
				root: 'ReactDOM',
				commonjs2: 'react-dom',
				commonjs: 'react-dom',
				amd: 'react-dom'
			},
			'jodit-pro/build/jodit.fat.js': 'jodit-pro/build/jodit.fat.js'
		}
	};
};