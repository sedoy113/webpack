const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const sass = require('sass');

module.exports = {
	entry: {
		main: './src/index.js',
		styles: './src/styles/main.scss' // Отдельная точка входа для стилей
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[contenthash].js',
		publicPath: '/',
		assetModuleFilename: 'assets/[hash][ext][query]'
	},
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
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
					filename: 'images/[name].[hash][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[hash][ext]',
				},
			},
			{
				test: /\.(sa|sc|c)ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
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
			chunks: ['main', 'styles'], // Явное указание chunks
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
			chunkFilename: 'css/[id].[contenthash].css',
		}),
		new SpriteLoaderPlugin({
			plainSprite: true,
		}),
	],
	resolve: {
		alias: {
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