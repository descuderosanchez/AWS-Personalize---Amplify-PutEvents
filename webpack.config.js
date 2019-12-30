const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const copyImages = new CopyWebpackPlugin([
  {
    from: 'src/assets/images/',
    to: 'images'
  }
]);
const extractSass = new MiniCssExtractPlugin({
    filename: "css/index.css"
});

const outputDirectory = 'dist';

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: {
          loader: 'babel-loader'
        }
      },
      { test: /\.css$/, 
        use: [MiniCssExtractPlugin.loader,'css-loader', 'style-loader'],
      },
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]',
          outputPath: 'client/assets/images/',
          publicPath: '../'
        },
        exclude: [path.resolve(__dirname, 'fonts')]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    copyImages,
    extractSass,
    new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      }),
  ]
};
