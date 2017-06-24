'use strict';

/**
 * Validate received options
 *
 * @param {Object} opts
 *        @prop {Object} dict
 *              @prop {String} src
 *              @prop {String} dest
 *              @prop {Boolean} isFlat
 *              @prop {String} summaryDest
 *              @prop {String} summaryFileName
 *        @prop {Object} template
 *              @prop {String} src
 *              @prop {String} dest
 *              @prop {String} delimiter
 *
 * @return {Error|null}
 */
module.exports = function validateOptions (opts) {
  if (!opts.dict) {
    return new Error('dict option is required');
  }

  if (opts.template && !opts.template.src) {
    return new Error('template.src option is required when template option is used');
  }

  if (opts.template && !opts.template.dest) {
    return new Error('template.dest option is required when template option is used');
  }

  return null;
};
