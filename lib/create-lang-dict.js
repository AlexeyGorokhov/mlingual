'use strict';

/**
 * Create dictionary for a specified language code
 *
 * @param {String} langCode
 * @param {Object} overallDict
 * @return {Object}
 * @public
 */
module.exports = function (langCode, overallDict) {
  const dict = Object.create(null);
  step(overallDict, dict);
  return dict;

  function step (original, cur) {
    Object.keys(original).forEach(key => {
      const nextKeys = Object.keys(original[key]);

      if (nextKeys.some(nextKey => typeof original[key][nextKey] === 'string')) {
        if (langCode in original[key]) {
          cur[key] = original[key][langCode];
        } else {
          cur[key] = original[key][nextKeys[0]];
        }
      } else {
        cur[key] = Object.create(null);
        step(original[key], cur[key]);
      }
    });
  }
};
