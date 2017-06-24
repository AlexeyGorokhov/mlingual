'use strict';

const path = require('path');
const globby = require('globby');

/**
 * Get a collection of source filenames
 *
 * @prop {String} srcFolder Absolute or relative to `process.cwd()` path to the folder
 *                          containing source templates
 *
 * @return {Promise<Array<String>>}
 */
module.exports = async function getSrcFilePaths (srcFolder) {
  const srcFolderAbs = path.resolve(process.cwd(), srcFolder);

  const filePaths = await Promise.resolve(globby(`${srcFolderAbs}/**/*.*`));

  return filePaths.filter(filePath => path.extname(filePath));
};
