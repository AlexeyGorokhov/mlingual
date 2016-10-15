'use strict';

const multilingualator = require('../index.js');

multilingualator('debug/src', 'debug/dict', 'debug/dest')
.then(() => {
  console.log('Done!');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
