/* eslint no-unused-vars: 0 */
const seamlessImmutableJs = require('seamless-immutable');
const ImmutableJs = require('immutable');
const moriJs = require('mori');
const {get} = require('../lib');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

/**
 * Object
 */

exports.objectGetInNative = (cycles) => {
  const obj = {
    data: {value}
  };

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.data.value;
  }
};

exports.objectGetInSeamlessImmutableJs = (cycles) => {
  const obj = seamlessImmutableJs.from({
    data: {value}
  });

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.data.value;
  }
};

exports.objectGetInImmutableJs = (cycles) => {
  const obj = ImmutableJs.fromJS({
    data: {value}
  });

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.getIn(['data', 'value']);
  }
};

exports.objectGetInMoriJs = (cycles) => {
  const obj = moriJs.hashMap('data', moriJs.hashMap('value', value));

  let val;

  for (let i = 0; i < cycles; i++) {
    val = moriJs.getIn(obj, ['data', 'value']);
  }
};

exports.objectGetInUnchanged = (cycles) => {
  const obj = {
    data: {value}
  };

  let val;

  for (let i = 0; i < cycles; i++) {
    val = get('data.value', obj);
  }
};

/**
 * Array
 */

exports.arrayGetInNative = (cycles) => {
  const arr = [array];
  const maxIndex = arr[0].length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr[0][index];
  }
};

exports.arrayGetInSeamlessImmutableJs = (cycles) => {
  const arr = seamlessImmutableJs.from([array]);
  const maxIndex = arr[0].length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr[0][index];
  }
};

exports.arrayGetInImmutableJs = (cycles) => {
  const arr = ImmutableJs.fromJS([array]);
  const maxIndex = arr.get(0).size - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr.getIn([0, index]);
  }
};

exports.arrayGetInMoriJs = (cycles) => {
  const arr = moriJs.vector(moriJs.vector(...array));
  const maxIndex = moriJs.count(moriJs.get(arr, 0)) - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = moriJs.getIn(arr, [0, index]);
  }
};

exports.arrayGetInUnchanged = (cycles) => {
  const arr = [array];
  const maxIndex = arr[0].length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = get(`[0][${index}]`, array);
  }
};
