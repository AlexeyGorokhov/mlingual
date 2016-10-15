'use strict';

/**
 * Create a collection of codes for all languages found in the overall dictionary
 *
 * @param {Object} overallDict
 * @return {Set<String>}
 * @public
 */
module.exports = function (overallDict) {
  const langs = new Set();
  step(overallDict, langs);
  return langs;
};

function step (o, langs) {
  Object.keys(o).forEach(key => {
    if (typeof o[key] === 'string') {
      langs.add(key);
    } else {
      step(o[key], langs);
    }
  });
}
