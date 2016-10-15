'use strict';

const fs = require('fs');
const through2 = require('through2');

/**
 * Parse a source file and create the destination file
 *
 * @param {String} srcFileAbsPath - Absolute path to the source template file
 * @param {String} destFileAbsPath - Absolute path to the destination file
 * @param {Object} dict - Dictionary object for a particular language
 * @param {String} delimiter - Delimiter symbols
 * @return {Promise<Void>}
 * @public
 */
module.exports = function (srcFileAbsPath, destFileAbsPath, dict, delimiter) {
  return new Promise((resolve, reject) => {
    const src = fs.createReadStream(srcFileAbsPath, { encoding: 'utf8' });

    const parser = replacePlaceholders(dict, delimiter);
    parser.on('error', reject);

    const dest = fs.createWriteStream(destFileAbsPath);
    dest.on('finish', () => resolve());

    src.pipe(parser).pipe(dest);
  });
};

/**
 * Transform source stream by replacing placeholders with dictionary data
 *
 * @param {Object} dict - Dictionary object for a particular language
 * @param {String} delimiter - Delimiter symbols
 * @return {Stream}
 * @private
 */
function replacePlaceholders (dict, delimiter) {
  const spaceCharCodes = [' '.charCodeAt(0), '\n'.charCodeAt(0)];
  let buf = [];

  return through2(transform, flush);

  function transform (chunck, enc, cb) {
    for (const byte of chunck) {
      if (spaceCharCodes.includes(byte)) {
        this.push(processToken(buf, dict, delimiter));
        this.push(new Buffer([byte]));
        buf = [];
      } else {
        buf.push(byte);
      }
    }
    cb();
  }

  function flush (cb) {
    if (buf.length) this.push(new Buffer(buf));
    this.end();
    cb();
  }
}

/**
 * Process a particular token
 *
 * @param {Array<Byte>} buf - Byte representation of the token
 * @param {Object} dict - Dictionary object for a particular language
 * @param {String} delimiter - Delimiter symbols
 * @return {Buffer}
 * @private
 */
function processToken (buf, dict, delimiter) {
  const token = new Buffer(buf).toString();
  const subtokens = token.split(delimiter);

  if (subtokens[1]) {
    subtokens[1] = replacePlaceholder(subtokens[1], dict);
  }

  return new Buffer(subtokens.join(''));
}

/**
 * Replace placeholder with a piece of dictionary data
 *
 * @prop {String} placeholder - Placeholder token
 * @param {Object} dict - Dictionary object for a particular language
 * @return {String}
 * @private
 */
function replacePlaceholder (placeholder, dict) {
  const props = placeholder.split('.');
  let val = dict;

  props.forEach(p => {
    if (!(p in val)) {
      throw new Error(`No data for ${placeholder}`);
    }
    val = val[p];
  });

  return val;
}
