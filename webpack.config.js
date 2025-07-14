const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
	entry: { main: './src/index.js' },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
		publicPath: '',
	},
	mode: 'development',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
			watch: true,
		},
		compress: true,
		port: 8080,
		open: true,
		hot: true,
		liveReload: true,
		watchFiles: ['src/**/*.html', 'src/**/*.scss'],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: '/node_modules/',
			},
			// Правило для SVG-спрайтов (иконки в папке `src/icons/`)
			{
				test: /\.svg$/,
				include: path.resolve(__dirname, 'src/icons'), // обрабатываем только SVG из папки icons
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true, // извлекает спрайт в отдельный файл
							spriteFilename: 'sprite.svg', // имя файла
							symbolId: 'icon-[name]',
						},
					},
					{
						loader: 'svgo-loader',
						options: {
							plugins: [
								{ name: 'removeViewBox', active: false }, // не удалять viewBox
								{ name: 'removeTitle', active: true },    // удалять <title>
								{ name: 'removeDesc', active: true },     // удалять <desc>
								{ name: 'removeUselessStrokeAndFill', active: true }, // удалять лишние атрибуты
							],
						},
					},
				],
			},
			// Обычные SVG (не для спрайтов)
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				exclude: path.resolve(__dirname, 'src/icons'), // исключаем иконки для спрайтов
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1 },
					},
					'postcss-loader',
					'sass-loader',
				],
			},

			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1 },
					},
					'postcss-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new SpriteLoaderPlugin(),
	],
};