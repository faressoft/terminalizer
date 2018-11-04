const webpack = require('webpack');
const path = require('path');

// Extract CSS into separate files
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Global variables
const globals = {
  $: 'jquery',
  jQuery: 'jquery',
  Terminal: ['xterm', 'Terminal'],
  'window.jQuery': 'jquery',
  'window.$': 'jquery'
};

module.exports = {
  mode: 'production',
  target: 'electron-renderer',
  entry: {
    app: './render/src/js/app.js'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'render/dist'),
    publicPath: '/dist/'
  },
  plugins: [
    new CleanWebpackPlugin(['./render/dist'], {verbose: false}),
    new webpack.ProvidePlugin(globals),
    new MiniCssExtractPlugin({filename: 'css/[name].css'}),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: 'css-loader'}
        ],
      }
    ]
  }
};
