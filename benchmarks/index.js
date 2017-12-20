/* eslint no-console: 0 */
const fs = require('fs');
const {repeats, test} = require('./test');
const {
  objectGetNative,
  objectGetLodashFp,
  objectGetRamda,
  objectGetUnchanged,
  objectGetUnchangedDotty,
  arrayGetNative,
  arrayGetLodashFp,
  arrayGetRamda,
  arrayGetUnchanged,
  arrayGetUnchangedDotty
} = require('./get');

const {
  objectGetInNative,
  objectGetInLodashFp,
  objectGetInRamda,
  objectGetInUnchanged,
  objectGetInUnchangedDotty,
  arrayGetInNative,
  arrayGetInRamda,
  arrayGetInLodashFp,
  arrayGetInUnchanged,
  arrayGetInUnchangedDotty
} = require('./getin');

const {
  objectSetNative,
  objectSetLodashFp,
  objectSetRamda,
  objectSetUnchanged,
  objectSetUnchangedDotty,
  arraySetNative,
  arraySetLodashFp,
  arraySetRamda,
  arraySetUnchanged,
  arraySetUnchangedDotty
} = require('./set');

const {
  objectSetInNative,
  objectSetInLodashFp,
  objectSetInRamda,
  objectSetInUnchanged,
  objectSetInUnchangedDotty,
  arraySetInNative,
  arraySetInLodashFp,
  arraySetInRamda,
  arraySetInUnchanged,
  arraySetInUnchangedDotty
} = require('./setin');

const header = () => {
  return `Benchmark (all times in milliseconds): ${repeats.join(', ')}`;
};

console.log('starting benchmarks...');

const results = [];
const logAndSave = (it) => {
  results.push(it);
  console.log(it);
};

// header
logAndSave(header());

// object get tests
logAndSave(test('[get] Object Native', objectGetNative));
logAndSave(test('[get] Object lodash fp', objectGetLodashFp));
logAndSave(test('[get] Object ramda', objectGetRamda));
logAndSave(test('[get] Object Unchanged', objectGetUnchanged));
logAndSave(test('[get] Object Unchanged dotty', objectGetUnchangedDotty));

// array get tests
logAndSave(test('[get] Array Native', arrayGetNative));
logAndSave(test('[get] Array lodash fp', arrayGetLodashFp));
logAndSave(test('[get] Array ramda', arrayGetRamda));
logAndSave(test('[get] Array Unchanged', arrayGetUnchanged));
logAndSave(test('[get] Array Unchanged dotty', arrayGetUnchangedDotty));

// object get in tests
logAndSave(test('[get-in] Object Native', objectGetInNative));
logAndSave(test('[get-in] Object lodash fp', objectGetInLodashFp));
logAndSave(test('[get-in] Object ramda', objectGetInRamda));
logAndSave(test('[get-in] Object Unchanged', objectGetInUnchanged));
logAndSave(test('[get-in] Object Unchanged dotty', objectGetInUnchangedDotty));

// array get in tests
logAndSave(test('[get-in] Array Native', arrayGetInNative));
logAndSave(test('[get-in] Array lodash fp', arrayGetInLodashFp));
logAndSave(test('[get-in] Array ramda', arrayGetInRamda));
logAndSave(test('[get-in] Array Unchanged', arrayGetInUnchanged));
logAndSave(test('[get-in] Array Unchanged dotty', arrayGetInUnchangedDotty));

// object set tests
logAndSave(test('[set] Object Native', objectSetNative));
logAndSave(test('[set] Object lodash fp', objectSetLodashFp));
logAndSave(test('[set] Object ramda', objectSetRamda));
logAndSave(test('[set] Object Unchanged', objectSetUnchanged));
logAndSave(test('[set] Object Unchanged dotty', objectSetUnchangedDotty));

// array set tests
logAndSave(test('[set] Array Native', arraySetNative));
logAndSave(test('[set] Array lodash fp', arraySetLodashFp));
logAndSave(test('[set] Array ramda', arraySetRamda));
logAndSave(test('[set] Array Unchanged', arraySetUnchanged));
logAndSave(test('[set] Array Unchanged dotty', arraySetUnchangedDotty));

// object set in tests
logAndSave(test('[set-in] Object Native', objectSetInNative));
logAndSave(test('[set-in] Object lodash fp', objectSetInLodashFp));
logAndSave(test('[set-in] Object ramda', objectSetInRamda));
logAndSave(test('[set-in] Object Unchanged', objectSetInUnchanged));
logAndSave(test('[set-in] Object Unchanged dotty', objectSetInUnchangedDotty));

// array set in tests
logAndSave(test('[set-in] Array Native', arraySetInNative));
logAndSave(test('[set-in] Array lodash fp', arraySetInLodashFp));
logAndSave(test('[set-in] Array ramda', arraySetInRamda));
logAndSave(test('[set-in] Array Unchanged', arraySetInUnchanged));
logAndSave(test('[set-in] Array Unchanged dotty', arraySetInUnchangedDotty));

// write to file
if (fs && fs.writeFileSync) {
  fs.writeFileSync('results.csv', results.join('\n'), 'utf8');
  console.log('benchmarks done! Results saved to results.csv');
} else {
  console.log('benchmarks done!');
}
