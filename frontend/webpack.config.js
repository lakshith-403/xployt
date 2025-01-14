const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ui_lib': path.resolve(__dirname, 'src/ui_lib'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@alerts': path.resolve(__dirname, 'src/views/alerts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /index\.html/,
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        ROLE: JSON.stringify(process.env.ROLE),
      },
    }),
  ],
  mode: 'development',
  // watch: true,
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    compress: false,
    port: 9000,
    historyApiFallback: true,
    open: true,
  },
};
