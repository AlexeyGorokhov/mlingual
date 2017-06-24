'use strict';

const getOverallDict = require('./get-overall-dict');
const getLangs = require('./get-langs');
const createLangDict = require('./create-lang-dict');

/**
 * Process dictionaries
 *
 * @param {Object} dictOpts dict part of global options
 *        @prop {String} src
 *
 * @return {Promise<Object>} Dictionaries grouped by lang codes
 */
module.exports = async function processDicts (dictOpts) {
  const overallDict = await getOverallDict(dictOpts.src);
  const langs = getLangs(overallDict);
  const dictsByLang = Object.create(null);

  for (const lang of langs) {
    dictsByLang[lang] = createLangDict(lang, overallDict);
  }

  return dictsByLang;
};
