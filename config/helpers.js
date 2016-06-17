var path = require('path');
var _root = path.resolve(__dirname, '..');

console.log('root directory:', root() + '\n');

/**
 * Get the path of the args string, if array joins them, then returns the path
 *
 * @param {string | [string]} args - folder or array of folder structure to target
 * @return {string} - Absolute path
 */
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

/**
 * Determine if a flag is present in process arguments
 *
 * @param {string} flag - String of flag to search
 * @return {boolean} - true if flag present, false otherwise
 */
function hasProcessFlag(flag) {
  return process.argv.join('').includes(flag);
}

/**
 * Checks if process use 'webpack-dev-server'
 *
 * @return {boolean} - true if serving with 'webpack-dev-server', false otherwise
 */
function isWebpackDevServer() {
  return process.argv[1] && Boolean(/webpack-dev-server$/.exec(process.argv[1]));
}

exports.root = root;
exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
