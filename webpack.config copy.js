const path = require('path')
const {	CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


let mode = 'development'
if (process.env.NODE_ENV === 'production') {
	mode = 'production'
}

module.exports = (env) => {
	console.log(env)
	return {
		mode: mode,
		entry: ['./src/index.jsx'],
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'js/[name]-[hash:3].js',
			clean: true,
			assetModuleFilename: 'assets/[name]-[hash:3][ext]'
		},
		
		devServer: {
			port: 3000
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', ".tsx"],
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: 'Online',
				template: './src/index.html',
				scriptLoading: 'blocking',
				
			}),
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: "style/[name]-[hash:3].css"
			})
		],
		module: {
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
					use: [
						{
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
						},
					],
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
					use: [
						(mode=== 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
				},
			],
		},
	}
}