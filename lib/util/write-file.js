'use strict';

const util = require('util');
const fs = require('fs');

const writeFilePromisified = util.promisify(fs.writeFile);

module.exports = function writeFile (absPath, data) {
  return writeFilePromisified(absPath, data).then(() => {});
};
