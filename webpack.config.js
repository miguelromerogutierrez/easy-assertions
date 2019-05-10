const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'src/Assertions/index.js'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ],
  },
  output: {
    filename: 'easy-assertions.js',
    path: path.join(__dirname, '/dist'),
    library: 'easy-assertions',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
};