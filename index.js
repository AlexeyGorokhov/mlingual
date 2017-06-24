'use strict';

const validateOptions = require('./lib/validate-options');
const processDicts = require('./lib/dict/process-dicts');
const saveDicts = require('./lib/dict/save-dicts');
const processTemplates = require('./lib/template/process-templates');

/**
 * @param {Object} opts
 *        @prop {Object} dict Dictionary related options. Required.
 *              @prop {String} src Absolute or relative to `process.cwd()` path to the folder
 *                    containing dictionaries. Required.
 *              @prop {String} dest Absolute or relative to process.cwd() path to the destination
 *                    folder for converted dictionaries. Optional. If not provided,
 *                    converted dictionaries are not saved.
 *              @prop {Boolean} isFlat If true, converted dictionaries are flatly output
 *                    to the `dest` folder in the format
 *                    [subfolder1].[subfolderN].[filename].[langCode].json instead of
 *                    preserving subfolder structure.
 *                    Optional. Defaults to `false`.
 *                    This prop has no effect if `dest` prop is not provided.
 *              @prop {String} summaryDest Absolute or relative to process.cwd() path to
 *                    the folder to save a json-file containing an array of generated
 *                    dictionaries filenames.
 *                    Optional. If not provided, the summary file is not created.
 *                    This prop has no effect if `dest` prop is not provided.
 *              @prop {String} summaryFileName Name of the summary file without extension.
 *                    File extension is always `.json`.
 *                    Optional. Defaults to `dict-summary`.
 *        @prop {Object} template Template related options.
 *                       Optional. If not provided, templates are not processed.
 *              @prop {String} src Absolute or relative to `process.cwd()` path to the folder
 *                    containing source templates to be processed
 *              @prop {String} dest Absolute or relative to process.cwd() path to
 *                    the destination folder for processed templates
 *              @prop {String} delimiter Placeholder delimiter symbol(s) for templates processing.
 *                    Optional. Defaults to `$$`.
 *              @prop {Boolean} isFlat If true, output files are saved in the dest folder in
 *                    relative subfolder in the format [filename].[langCode].[ext] instead of
 *                    creating additional subfolders for each language code.
 *                    Optional. Defaults to `false`.
 *
 * @return {Promise<Void>}
 */
module.exports = async function mlingual (opts) {
  const validationError = validateOptions(opts);

  if (validationError) {
    return Promise.reject(validationError);
  }

  const dictsByLang = await processDicts(opts.dict);

  await Promise.all([
    saveDicts(opts.dict, dictsByLang),
    processTemplates(opts.template, dictsByLang)
  ]);
};
