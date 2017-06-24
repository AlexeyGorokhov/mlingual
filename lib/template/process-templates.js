'use strict';

const path = require('path');
const del = require('del');

const makeDir = require('../util/make-dir');
const getSrcFilePaths = require('./get-src-files');
const createDestFile = require('./create-dest-file');

module.exports = async function processTemplates (templateOpts, dictsByLang) {
  if (!templateOpts) return;

  const {
    src,
    dest,
    delimiter = '$$',
    isFlat = false
  } = templateOpts;

  const destAbs = path.resolve(process.cwd(), dest);

  await del(`${destAbs}/**`);

  const srcFilePaths = await getSrcFilePaths(src);

  const langs = Object.keys(dictsByLang);

  const taskData = new Set();

  for (const lang of langs) {
    for (const srcFilePath of srcFilePaths) {
      const relativeToSrc = path.relative(src, srcFilePath);
      const destTmp = path.join(destAbs, relativeToSrc);
      const { dir, ext, name } = path.parse(destTmp);
      let dest;

      if (isFlat) {
        dest = path.join(dir, `${name}.${lang}${ext}`);
      } else {
        dest = path.join(dir, lang, `${name}${ext}`);
      }

      taskData.add({
        src: srcFilePath,
        dest,
        dict: dictsByLang[lang]
      });
    }
  }

  const taskDataArr = Array.from(taskData);

  await Promise.all(
    taskDataArr.map(task => makeDir(path.dirname(task.dest)))
  );

  await Promise.all(
    taskDataArr.map(task => createDestFile(task.src, task.dest, task.dict, delimiter))
  );
};
