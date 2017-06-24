'use strict';

const test = require('tape');

const self = require('../../lib/validate-options');

const moduleName = 'lib/validate-options.js';

const getDefaultOptsStub = () => ({
  dict: {
    src: Symbol(''),
    dest: Symbol('')
  },
  template: {
    src: Symbol(''),
    dest: Symbol('')
  }
});

test(`${moduleName} > options are correct`, t => {
  const optsStub = getDefaultOptsStub();

  const result = self(optsStub);

  t.equal(result, null, 'should return null');
  t.end();
});

test(`${moduleName} > template option is missing`, t => {
  const optsStub = getDefaultOptsStub();
  delete optsStub.template;

  const result = self(optsStub);

  t.equal(result, null, 'should return null');
  t.end();
});

test(`${moduleName} > dict option is missing`, t => {
  const optsStub = getDefaultOptsStub();
  delete optsStub.dict;

  const result = self(optsStub);

  t.equal(result instanceof Error, true, 'should return error');
  t.end();
});

test(`${moduleName} > template.src option is missing`, t => {
  const optsStub = getDefaultOptsStub();
  delete optsStub.template.src;

  const result = self(optsStub);

  t.equal(result instanceof Error, true, 'should return error');
  t.end();
});

test(`${moduleName} > template.dest option is missing`, t => {
  const optsStub = getDefaultOptsStub();
  delete optsStub.template.dest;

  const result = self(optsStub);

  t.equal(result instanceof Error, true, 'should return error');
  t.end();
});
