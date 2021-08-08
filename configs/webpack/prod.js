// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    example: './exmple.tsx', // the entry point of example app
  },
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [],
});
