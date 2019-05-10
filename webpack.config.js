module.exports = {
  module: {
    loaders: [
      {exclude: ['node_modules'], loader: 'babel', test: /\.js$/},
    ],
  },
  resolve: {
    extensions: ['', 'js'],
    modules: [
      'node_modules',
    ],
  },
};