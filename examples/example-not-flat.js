'use strict';

const multilingualator = require('../index.js');

multilingualator({
  dict: {
    src: 'examples/dict',
    dest: 'examples/dest/dicts',
    isFlat: false,
    summaryDest: 'examples/dest/dicts-summary'
  },
  template: {
    src: 'examples/src',
    dest: 'examples/dest/templates',
    isFlat: false
  }
})
.then(() => {
  console.log('Done!');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
