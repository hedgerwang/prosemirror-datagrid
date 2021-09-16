// development config

const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./common');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { resolve } = require('path');

const devConfig = merge(commonConfig, {
  mode: 'development',
  watch: true,
  devServer: {
    compress: true,
    port: 9000,
  },
  entry: {
    // the entry point of example app
    example: resolve(__dirname, '../../src/examples/example.tsx'),
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    // This will generate a file that containing example.js
    new HtmlWebpackPlugin({ template: resolve(__dirname, '../../src/examples/example.html.ejs') }),
  ],
});

module.exports = devConfig;