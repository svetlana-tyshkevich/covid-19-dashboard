const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [paths.src + '/index.js'],

  output: {
    path: paths.build,
    publicPath: './',
    filename: '[name].bundle.js',
    assetModuleFilename: 'images/[name][ext][query]',
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/audio", to: "audio" },
      ],
    }),

    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      title: 'COVID-19 Dashboard',
      favicon: paths.src + '/images/favicon.ico',
      template: paths.src + '/template.html',
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },

      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      },
    ],
  },
}