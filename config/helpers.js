/**
 * @author: @AngularClass
 */
var path = require('path');

// Helper functions
var ROOT = path.resolve(__dirname, '..');

console.log('root directory:', root() + '\n');

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

/**
 * Get the path of the args string, if array joins them, then returns the path
 *
 * @param {string | [string]} args - folder or array of folder structure to target
 * @return {string} - Absolute path
 */
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

/**
 * Check if a path import match the node type of import
 *
 * @param {any} context The context of the import
 * @param {string} request The import string
 * @param {function} cb callback
*/
function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request);
    return;
  }
  cb();
}

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.checkNodeImport = checkNodeImport;
