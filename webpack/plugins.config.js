const path = require('path')
const constants = require('./constants')
const {	CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugjn = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const buildType = process.env.BUILD_TYPE ? process.env.BUILD_TYPE : constants.modes.dev

const cssLoader = () => {
	if (buildType === constants.modes.dev) {
		return [
				{loader: "style-loader", options: {insert: 'body'}},
				"css-loader",
				"sass-loader",
		]
	} else {
		return [
			MiniCssExtractPlugin.loader,
			"css-loader",
			"sass-loader",
		]
	}
}

const result = {}

result.plugins = [
	
	new HtmlWebpackPlugin({
			title: 'Online',
			template: './src/index.html',
			minify: buildType === constants.modes.dev ? false : true,
			inject: 'body'
		}),
	new MiniCssExtractPlugin({
		filename: "style/[name]-[hash:3].css"
	}),
	new CopyPlugin(
	{
		patterns: [
			{
				from: path.resolve(__dirname, '../src/favicon/favicon.ico'),
				to: path.resolve(__dirname, '../dist')
			}
		]
	}),
	new CleanWebpackPlugin(),
]

result.module = {
	rules: [{
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		},
		{
			test: /\.m?jsx$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', "@babel/preset-react"]
				}
			}
		},
		{
			test: /\.m?tsx$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', "@babel/preset-react", "@babel/preset-typescript"]
				}
			}
		},
		//Loading images
		{
			test: /\.(png|jpe?g|gif|webp)$/i,
			use: [{
				loader: 'image-webpack-loader',
				options: {
					mozjpeg: {
						progressive: true,
					},
					// optipng.enabled: false will disable optipng
					optipng: {
						enabled: false,
					},
					pngquant: {
						quality: [0.65, 0.90],
						speed: 4
					},
					gifsicle: {
						interlaced: false,
					},
					// the webp option will enable WEBP
					webp: {
						quality: 75
					}
				}
			}, ],
			type: 'asset/resource'
		},
		//Loading fonts
		{
			test: /\.(ttf|otf|eot|woff|woff2)$/,
			type: 'asser/resource',
			generator: {
				filename: 'fonts/[name].[ext]'
			}
		},
		{
			test: /\.(sa|sc|c)ss$/i,
			use: cssLoader()
		},
	],
}

if(buildType === constants.modes.prod) {
	result.optimization = {
		minimize: true,
		minimizer: [new TerserPlugjn(), new CssMinimizerPlugin(),]
	}
}

module.exports = result