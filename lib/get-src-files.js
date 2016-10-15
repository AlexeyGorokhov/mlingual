'use strict';

const path = require('path');
const globby = require('globby');

/**
 * Get a collection of source filenames
 *
 * @prop {String} srcFolder - Absolute or relative to `process.cwd()` path to the folder
 *       containing source templates
 * @return {Promise<Array<String>>}
 * @public
 */
module.exports = function (srcFolder) {
  return new Promise((resolve, reject) => {
    const absPath = path.resolve(process.cwd(), srcFolder);
    const absGlob = `${absPath}/**/*.*`;

    Promise.resolve(globby(absGlob))
    .then(filePaths => resolve(filePaths.filter(filePath => path.extname(filePath))))
    .catch(reject);
  });
};
