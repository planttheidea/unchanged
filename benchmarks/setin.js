/* eslint no-unused-vars: 0 */
const seamlessImmutableJs = require('seamless-immutable');
const ImmutableJs = require('immutable');
const moriJs = require('mori');
const {set} = require('../lib');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

/**
 * Object
 */

exports.objectSetInNative = (cycles) => {
  const obj = {
    data: {value}
  };

  for (let i = 0; i < cycles; i++) {
    Object.assign({}, obj, {
      data: Object.assign({}, obj.data, {
        value: Math.random()
      })
    });
  }
};

exports.objectSetInSeamlessImmutableJs = (cycles) => {
  const obj = seamlessImmutableJs.from({
    data: {value}
  });

  for (let i = 0; i < cycles; i++) {
    obj.setIn(['data', 'value'], Math.random());
  }
};

exports.objectSetInImmutableJs = (cycles) => {
  const obj = ImmutableJs.fromJS({
    data: {value}
  });

  for (let i = 0; i < cycles; i++) {
    obj.setIn(['data', 'value'], Math.random());
  }
};

exports.objectSetInMoriJs = (cycles) => {
  const obj = moriJs.hashMap('data', moriJs.hashMap('value', value));

  for (let i = 0; i < cycles; i++) {
    moriJs.assocIn(obj, ['data', 'value'], Math.random());
  }
};

exports.objectSetInUnchanged = (cycles) => {
  const obj = {
    data: {value}
  };

  for (let i = 0; i < cycles; i++) {
    set('data.value', Math.random(), obj);
  }
};

/**
 * Array
 */

exports.arraySetInNative = (cycles) => {
  const arr = [array];
  const maxIndex = arr[0].length - 1;

  let newArr, index;

  for (let i = 0; i < cycles; i++) {
    newArr = [].concat(arr);
    newArr[0] = [].concat(arr[0]);

    index = ~~(Math.random() * maxIndex);
    newArr[0][index] = Math.random();
  }
};

exports.arraySetInSeamlessImmutableJs = (cycles) => {
  const arr = seamlessImmutableJs.from([array]);
  const maxIndex = arr[0].length - 1;

  for (let i = 0; i < cycles; i++) {
    arr.setIn([0, ~~(Math.random() * maxIndex)], Math.random());
  }
};

exports.arraySetInImmutableJs = (cycles) => {
  const arr = ImmutableJs.fromJS([array]);
  const maxIndex = arr.get(0).size - 1;

  for (let i = 0; i < cycles; i++) {
    arr.setIn([0, ~~(Math.random() * maxIndex)], Math.random());
  }
};

exports.arraySetInMoriJs = (cycles) => {
  const arr = moriJs.vector(moriJs.vector(...array));
  const maxIndex = moriJs.count(moriJs.get(arr, 0)) - 1;

  for (let i = 0; i < cycles; i++) {
    moriJs.assocIn(arr, [0, ~~(Math.random() * maxIndex)], Math.random());
  }
};

exports.arraySetInUnchanged = (cycles) => {
  const arr = [array];
  const maxIndex = arr[0].length - 1;

  let index;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);

    set(`[0][${index}]`, Math.random(), arr);
  }
};
