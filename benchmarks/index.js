const fs = require("fs");
const Table = require("cli-table");

const { repeats, test } = require("./test");

const {
  objectGetNative,
  objectGetLodashFp,
  objectGetLodashFpDotty,
  objectGetRamda,
  objectGetUnchanged,
  objectGetUnchangedDotty,
  arrayGetNative,
  arrayGetLodashFp,
  arrayGetLodashFpDotty,
  arrayGetRamda,
  arrayGetUnchanged,
  arrayGetUnchangedDotty
} = require("./get");

const {
  objectGetInNative,
  objectGetInLodashFp,
  objectGetInLodashFpDotty,
  objectGetInRamda,
  objectGetInUnchanged,
  objectGetInUnchangedDotty,
  arrayGetInNative,
  arrayGetInRamda,
  arrayGetInLodashFp,
  arrayGetInLodashFpDotty,
  arrayGetInUnchanged,
  arrayGetInUnchangedDotty
} = require("./getin");

const {
  objectSetNative,
  objectSetLodashFp,
  objectSetLodashFpDotty,
  objectSetRamda,
  objectSetUnchanged,
  objectSetUnchangedDotty,
  arraySetNative,
  arraySetLodashFp,
  arraySetLodashFpDotty,
  arraySetRamda,
  arraySetUnchanged,
  arraySetUnchangedDotty
} = require("./set");

const {
  objectSetInNative,
  objectSetInLodashFp,
  objectSetInLodashFpDotty,
  objectSetInRamda,
  objectSetInUnchanged,
  objectSetInUnchangedDotty,
  arraySetInNative,
  arraySetInLodashFp,
  arraySetInLodashFpDotty,
  arraySetInRamda,
  arraySetInUnchanged,
  arraySetInUnchangedDotty
} = require("./setin");

const TABLE_HEAD = repeats.map(number => {
  return `${number} ops`;
});

const TEST_TITLES = {
  getArray: "get array index",
  getInArray: "get nested array index",
  getInObject: "get nested object property",
  getObject: "get object property",
  setArray: "set array index",
  setInArray: "set nested array index",
  setInObject: "set nested object property",
  setObject: "set object property"
};

const TESTS = {
  getObject: {
    native: objectGetNative,
    "lodash fp (array)": objectGetLodashFp,
    "lodash fp (dotty)": objectGetLodashFpDotty,
    ramda: objectGetRamda,
    "unchanged (array)": objectGetUnchanged,
    "unchanged (dotty)": objectGetUnchangedDotty
  },
  getArray: {
    native: arrayGetNative,
    "lodash fp (array)": arrayGetLodashFp,
    "lodash fp (dotty)": arrayGetLodashFpDotty,
    ramda: arrayGetRamda,
    "unchanged (array)": arrayGetUnchanged,
    "unchanged (dotty)": arrayGetUnchangedDotty
  },
  getInObject: {
    native: objectGetInNative,
    "lodash fp (array)": objectGetInLodashFp,
    "lodash fp (dotty)": objectGetInLodashFpDotty,
    ramda: objectGetInRamda,
    "unchanged (array)": objectGetInUnchanged,
    "unchanged (dotty)": objectGetInUnchangedDotty
  },
  getInArray: {
    native: arrayGetInNative,
    "lodash fp (array)": arrayGetInLodashFp,
    "lodash fp (dotty)": arrayGetInLodashFpDotty,
    ramda: arrayGetInRamda,
    "unchanged (array)": arrayGetInUnchanged,
    "unchanged (dotty)": arrayGetInUnchangedDotty
  },
  setObject: {
    native: objectSetNative,
    "lodash fp (array)": objectSetLodashFp,
    "lodash fp (dotty)": objectSetLodashFpDotty,
    ramda: objectSetRamda,
    "unchanged (array)": objectSetUnchanged,
    "unchanged (dotty)": objectSetUnchangedDotty
  },
  setArray: {
    native: arraySetNative,
    "lodash fp (array)": arraySetLodashFp,
    "lodash fp (dotty)": arraySetLodashFpDotty,
    ramda: arraySetRamda,
    "unchanged (array)": arraySetUnchanged,
    "unchanged (dotty)": arraySetUnchangedDotty
  },
  setInObject: {
    native: objectSetInNative,
    "lodash fp (array)": objectSetInLodashFp,
    "lodash fp (dotty)": objectSetInLodashFpDotty,
    ramda: objectSetInRamda,
    "unchanged (array)": objectSetInUnchanged,
    "unchanged (dotty)": objectSetInUnchangedDotty
  },
  setInArray: {
    native: arraySetInNative,
    "lodash fp (array)": arraySetInLodashFp,
    "lodash fp (dotty)": arraySetInLodashFpDotty,
    ramda: arraySetInRamda,
    "unchanged (array)": arraySetInUnchanged,
    "unchanged (dotty)": arraySetInUnchangedDotty
  }
};

const results = [["Test", ...TABLE_HEAD].join(",")];

Object.keys(TESTS).forEach(testType => {
  const testTitle = TEST_TITLES[testType];

  console.log("");
  console.log(`Running benchmarks for ${testTitle}...`);

  results.push(new Array(TABLE_HEAD.length + 1).fill("---"));

  const typeTable = new Table({
    head: ["", ...TABLE_HEAD]
  });

  Object.keys(TESTS[testType]).forEach(testName => {
    const result = test(testName, TESTS[testType][testName]);
    const resultRow = [testName, ...result];

    typeTable.push(resultRow);
    results.push(
      resultRow
        .map((result, index) => {
          return index === 0 ? `[${testTitle}] ${result}` : result;
        })
        .join(",")
    );
  });

  console.log(typeTable.toString());
});

console.log("");

// write to file
if (fs && fs.writeFileSync) {
  fs.writeFileSync("benchmark_results.csv", results.join("\n"), "utf8");
  console.log("benchmarks done! Results saved to benchmark_results.csv");
} else {
  console.log("benchmarks done!");
}
