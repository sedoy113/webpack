const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const sass = require('sass');

module.exports = {
	entry: {
		main: './src/index.js',
		styles: './src/styles/main.scss'
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'js/[name].[contenthash].js', // Хеш только для JS
		publicPath: '/',
		assetModuleFilename: 'assets/[name][ext]' // Без хеша для общих ассетов
	},
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'build'),
		},
		compress: true,
		port: 8080,
		open: true,
		hot: true,
		historyApiFallback: true,
		watchFiles: ['src/**/*'],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						sources: {
							list: [
								{
									tag: 'img',
									attribute: 'src',
									type: 'src',
								},
								{
									tag: 'img',
									attribute: 'srcset',
									type: 'srcset',
								},
								{
									tag: 'source',
									attribute: 'srcset',
									type: 'srcset',
								},
								{
									tag: 'link',
									attribute: 'href',
									type: 'src',
								}
							]
						}
					}
				}
			},
			{
				test: /\.svg$/,
				include: path.resolve(__dirname, 'src/icons'),
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true,
							spriteFilename: 'sprite.svg',
							symbolId: 'icon-[name]',
						},
					},
					{
						loader: 'svgo-loader',
						options: {
							plugins: [
								{ name: 'removeViewBox', active: false },
								{ name: 'removeTitle', active: true },
								{ name: 'removeDesc', active: true },
								{ name: 'removeUselessStrokeAndFill', active: true },
							],
						},
					},
				],
			},
			{
				test: /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i,
				exclude: path.resolve(__dirname, 'src/icons'),
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.(sa|sc|c)ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: true,
							url: {
								filter: (url) => !url.includes('sprite.svg'),
							},
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								plugins: [
									require('autoprefixer')({
										overrideBrowserslist: ['last 2 versions', '> 1%'],
									}),
									require('cssnano')({
										preset: ['default', {
											discardComments: {
												removeAll: true,
											},
										}]
									}),
								],
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							implementation: sass,
							sassOptions: {
								outputStyle: 'expanded',
							},
							additionalData: (content, loaderContext) => {
								if (loaderContext.resourcePath.endsWith('.scss')) {
									return `
                    @use "sass:math";
                    @use "sass:color";
                    @use "sass:map";
                    @use "sass:list";
                    @use "sass:meta";
                    @use "sass:string";
                    @use "variables" as *;
                    @use "mixins" as *;
                    @use "functions" as *;
                    ${content}
                  `;
								}
								return content;
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
			},
			chunks: ['main', 'styles'],
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css', // Хеш для CSS
			chunkFilename: 'css/[id].[contenthash].css',
		}),
		new SpriteLoaderPlugin({
			plainSprite: true,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src/'),
			'@scss': path.resolve(__dirname, 'src/scss'),
			'@images': path.resolve(__dirname, 'src/images'),
		},
		extensions: ['.js', '.scss', '.css'],
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
};