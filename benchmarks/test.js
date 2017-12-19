// const repeats = [1000];
// const repeats = [1000, 5000, 10000, 50000, 100000];
const repeats = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];

exports.test = (name, benchmark) => {
  let startTime, testTime;

  return `${name}: ${repeats
    .map((cycles) => {
      startTime = Date.now();

      benchmark(cycles);

      testTime = Date.now() - startTime;

      if (global && global.gc) {
        global.gc();
      }

      return testTime;
    })
    .join(', ')}`;
};

exports.repeats = repeats;
