'use strict';

const path = require('path');
const del = require('del');
const getSrcFilePaths = require('./lib/get-src-files');
const getOverallDict = require('./lib/get-overall-dict');
const getLangsCollection = require('./lib/get-langs');
const createDictionaryForLanguage = require('./lib/create-lang-dict');
const createDestFolder = require('./lib/create-dest-folders');
const createDestFile = require('./lib/create-dest-file');

/**
 * @param {String} srcFolder - Absolute or relative to `process.cwd()` path to the folder
 *        containing source templates
 * @param {String} dictFolder - Absolute or relative to process.cwd() path to the folder
 *        containing dictionaries
 * @param {String} destFolder - Absolute or relative to process.cwd() path to the destination folder
 * @param {String} [delimiter] - Optional. Placeholder delimiter symbol(s). Defaults to `$$`
 * @return {Promise<Void>}
 * @public
 */
module.exports = function (srcFolder, dictFolder, destFolder, delimiter = '$$') {
  return new Promise((resolve, reject) => {
    let absDestFolder;
    let langs;
    let dicts;
    let srcFilePaths;
    let destFilePaths;

    Promise.resolve()
    .then(() => {
      absDestFolder = path.resolve(process.cwd(), destFolder);
      return del(`${absDestFolder}/**`);
    })
    .then(() => getOverallDict(dictFolder))
    .then(overallDict => {
      langs = getLangsCollection(overallDict);
      dicts = Object.create(null);

      for (const lang of langs) {
        dicts[lang] = createDictionaryForLanguage(lang, overallDict);
      }

      return getSrcFilePaths(srcFolder);
    })
    .then(paths => {
      srcFilePaths = paths;

      destFilePaths = srcFilePaths.map(srcFilePath => {
        const relativeToSrc = path.relative(srcFolder, srcFilePath);
        return path.join(absDestFolder, relativeToSrc);
      });

      return Promise.all(destFilePaths.map(p => createDestFolder(p, langs)));
    })
    .then(() => {
      const tasks = [];

      srcFilePaths.forEach((srcFilePath, index) => {
        const destFilePath = destFilePaths[index];

        langs.forEach(lang => {
          const destFilePathWithLangCode = path.join(
            path.dirname(destFilePath),
            lang,
            path.basename(destFilePath)
          );

          tasks.push(createDestFile(srcFilePath, destFilePathWithLangCode, dicts[lang], delimiter));
        });
      });

      return Promise.all(tasks);
    })
    .then(() => {
      resolve();
    })
    .catch(reject);
  });
};
