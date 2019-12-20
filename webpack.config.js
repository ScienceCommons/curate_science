const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/router_index.html',
  filename: 'router_index.html',
  inject: 'body'
})

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.jsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }, 
  output: {
    path: path.resolve('dist'),
    filename: 'js/bundle.js',
    chunkFilename: "js/bundle.js",
    publicPath: '/dist'
  },
  watch: true,
  module: {
    rules: [
      { test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              // jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig
    // new HtmlWebpackPlugin({  // Also generate a test.html
    //   filename: 'test.html',
    //   template: 'src/assets/test.html'
    // })
  ]
}
