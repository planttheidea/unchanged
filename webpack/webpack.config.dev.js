'use strict';

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const defaultConfig = require('./webpack.config');

const ROOT = path.resolve(__dirname, '..');

const babelRcPath = path.resolve(ROOT, '.babelrc');

const babelRc = fs.readFileSync(babelRcPath, {encoding: 'utf8'});
const developmentBabelConfig = JSON.parse(babelRc).env.development;

module.exports = Object.assign({}, defaultConfig, {
  devServer: {
    contentBase: './dist',
    inline: true,
    port: 3000,
    stats: {
      assets: false,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      timings: true,
      version: false
    }
  },

  entry: path.join(ROOT, 'DEV_ONLY/App.js'),

  externals: undefined,

  module: Object.assign({}, defaultConfig.module, {
    rules: defaultConfig.module.rules.map((rule) => {
      if (rule.loader === 'eslint-loader') {
        return Object.assign({}, rule, {
          options: Object.assign({}, rule.options, {
            emitError: undefined,
            failOnWarning: false
          })
        });
      }

      if (rule.loader === 'babel-loader') {
        return Object.assign({}, rule, {
          options: Object.assign({}, rule.options, developmentBabelConfig, {
            babelrc: false,
            presets: [...developmentBabelConfig.presets, 'react']
          })
        });
      }

      return rule;
    })
  }),

  plugins: [...defaultConfig.plugins, new HtmlWebpackPlugin()]
});
