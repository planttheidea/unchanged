const now = require('performance-now');

// const repeats = [1000];
// const repeats = [1000, 5000, 10000, 50000, 100000];
const repeats = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000];

module.exports = {
  repeats,
  test(name, benchmark) {
    let startTime, testTime;

    return repeats.map((cycles) => {
      startTime = now();

      benchmark(cycles);

      testTime = now() - startTime;

      if (global && global.gc) {
        global.gc();
      }

      return `${testTime.toFixed(3)}ms`;
    });
  }
};
