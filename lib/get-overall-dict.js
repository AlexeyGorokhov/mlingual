'use strict';

const path = require('path');
const fs = require('fs');
const globby = require('globby');

/**
 * Get the combined dictionary
 *
 * @param {String} dictFolder - Absolute or relative to process.cwd() path to the folder
 *        containing dictionaries
 * @return {Promise<Object>}
 * @public
 */
module.exports = function (dictFolder) {
  return new Promise((resolve, reject) => {
    const absPath = path.resolve(process.cwd(), dictFolder);
    const absGlob = `${absPath}/**/*.json`;

    Promise.resolve(globby(absGlob))
    .then(filePaths => Promise.all(filePaths.map(filePath => getDictContent(
      filePath, absPath
    ))))
    .then(dicts => {
      const overallDict = Object.create(null);

      dicts.forEach(dict => {
        dict.props.reduce((prev, cur, index, arr) => {
          if (!(cur in prev)) {
            if (index === arr.length - 1) {
              prev[cur] = dict.dictData;
            } else {
              prev[cur] = Object.create(null);
            }
          }
          return prev[cur];
        }, overallDict);
      });

      resolve(overallDict);
    })
    .catch(reject);
  });
};

/**
 * Get dictionary data and dictionary property path
 *
 * @param {String} absFilePath - Absolute path to the file
 * @param {String} absDictFolder - Absolute path to the root dictionary folder
 * @return {Promise<Object>}
 *         @prop {Array<String>} props
 *         @prop {Object} dictData
 * @private
 */
function getDictContent (absFilePath, absDictFolder) {
  return new Promise((resolve, reject) => {
    const relativeDictPath = path.relative(absDictFolder, absFilePath);
    const pathElements = path.parse(relativeDictPath);
    const props = pathElements.dir.split(path.sep).filter(prop => prop.length > 0);

    props.push(pathElements.name);

    fs.readFile(absFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const dictData = JSON.parse(data);
      resolve({
        props,
        dictData
      });
    });
  });
}
