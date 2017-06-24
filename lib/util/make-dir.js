'use strict';

const util = require('util');
const mkdirp = require('mkdirp');

const mkdirpPromisified = util.promisify(mkdirp);

module.exports = function makeDir (absPath) {
  return mkdirpPromisified(absPath).then(() => {});
};
