module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  testRegex: '.*\\.test\\.js$',
  "transform": {
    "^.+\\.js$": "babel-jest",
  },
};
