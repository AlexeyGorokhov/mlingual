'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Create destination folder and/or its sub-folders including language sub-folders
 *
 * @param {String} destFileAbsPath - Absolute path to the destination file
 * @param {Array<String>} langs - Collection of language codes
 * @return {Promise<Void>}
 *         Promise rejects with Error in case an error occurs while creating the folder.
 * @public
 */
module.exports = function (destFileAbsPath, langs) {
  const dirName = path.dirname(destFileAbsPath);

  return Promise.all(Array.from(langs).map(lang => createFolder(path.join(dirName, lang))));
};

/**
 * Create folder
 *
 * @param {String} folderName
 * @return {Promise<Void>}
 * @private
 */
function createFolder (folderName) {
  return new Promise((resolve, reject) => {
    mkdirp(folderName, (err) => {
      if (err) {
        reject(new Error(`Cannot create folder ${folderName}: ${err.message}`));
        return;
      }

      resolve();
    });
  });
}
