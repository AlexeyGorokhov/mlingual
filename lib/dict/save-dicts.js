'use strict';

const path = require('path');
const del = require('del');

const makeDir = require('../util/make-dir');
const writeFile = require('../util/write-file');

/**
 * Process dictionaries
 *
 * @param {Object} dictOpts dict part of global options
 *        @prop {String} dest
 *        @prop {Boolean} isFlat
 *        @prop {String} summaryDest
 *        @prop {String} summaryFileName
 * @param {Object} dictsByLang
 *
 * @return {Promise<Void>}
 */
module.exports = async function saveDicts (dictOpts, dictsByLang) {
  const { dest, isFlat = false, summaryDest, summaryFileName = 'dict-summary' } = dictOpts;

  if (!dest) return;

  const destFolderAbs = path.resolve(process.cwd(), dest);

  await Promise.all([
    del(`${destFolderAbs}/**`),
    clearSummaryDest(summaryDest)
  ]);

  const destFiles = new Map();
  const filesCreated = new Set();

  Object.keys(dictsByLang).forEach(lang => {
    getPathPart([lang], dictsByLang[lang]);
  });

  await Promise.all([
    saveSummary(filesCreated, summaryDest, summaryFileName),
    saveDictFiles(destFiles)
  ]);

  function getPathPart (prevParts, obj) {
    const keys = Object.keys(obj);

    if (keys.some(key => typeof obj[key] === 'string')) {
      const [ lang, ...pathParts ] = prevParts;
      let p;

      if (isFlat) {
        p = `${pathParts.join('.')}.${lang}.json`;
      } else {
        p = path.join(
          ...pathParts.slice(0, pathParts.length - 1),
          lang,
          `${pathParts[pathParts.length - 1]}.json`
        );
      }

      filesCreated.add(p);
      p = path.join(destFolderAbs, p);
      destFiles.set(p, obj);
    } else {
      keys.forEach(key => getPathPart([...prevParts, key], obj[key]));
    }
  }
};

async function clearSummaryDest (summaryDest) {
  if (!summaryDest) return;

  const summaryDestAbs = path.resolve(process.cwd(), summaryDest);

  await del(`${summaryDestAbs}/**`);
}

async function saveSummary (filesCreated, summaryDest, summaryFileName) {
  if (!summaryDest) return;

  const summaryDestAbs = path.resolve(process.cwd(), summaryDest);

  await makeDir(summaryDestAbs);
  await writeFile(
    path.join(summaryDestAbs, `${summaryFileName}.json`),
    JSON.stringify(Array.from(filesCreated))
  );
}

async function saveDictFiles (destFiles) {
  const destFilesArr = Array.from(destFiles);

  await Promise.all(destFilesArr.map(([ filePath ]) => makeDir(path.dirname(filePath))));

  await Promise.all(destFilesArr.map(([ filePath, data ]) => writeFile(
    filePath,
    JSON.stringify(data)
  )));
}
