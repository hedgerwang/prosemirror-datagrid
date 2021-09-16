// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    // entry point for module prosemirror-datagrid.
    index: resolve(__dirname, '../../src/index.ts'),
  },
  // https://stackoverflow.com/questions/60507612/how-to-export-multiple-es6-modules-from-one-npm-package
  output: {
    library: 'prosemirror-datagrid',
    libraryTarget: 'umd',    
    // filename: 'js/bundle.[contenthash].min.js',
    // filename: '[name].common.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  plugins: [],
});
