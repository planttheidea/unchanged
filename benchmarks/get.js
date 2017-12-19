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

exports.objectGetNative = (cycles) => {
  const obj = {value};

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.value;
  }
};

exports.objectGetSeamlessImmutableJs = (cycles) => {
  const obj = seamlessImmutableJs.from({value});

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.value;
  }
};

exports.objectGetImmutableJs = (cycles) => {
  const obj = ImmutableJs.fromJS({value});

  let val;

  for (let i = 0; i < cycles; i++) {
    val = obj.get('value');
  }
};

exports.objectGetMoriJs = (cycles) => {
  const obj = moriJs.hashMap('value', value);

  let val;

  for (let i = 0; i < cycles; i++) {
    val = moriJs.get(obj, 'value');
  }
};

exports.objectGetUnchanged = (cycles) => {
  const obj = {value};

  let val;

  for (let i = 0; i < cycles; i++) {
    val = get('value', obj);
  }
};

/**
 * Array
 */

exports.arrayGetNative = (cycles) => {
  const arr = array;
  const maxIndex = arr.length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr[index];
  }
};

exports.arrayGetSeamlessImmutableJs = (cycles) => {
  const arr = seamlessImmutableJs.from(array);
  const maxIndex = arr.length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr[index];
  }
};

exports.arrayGetImmutableJs = (cycles) => {
  const arr = ImmutableJs.fromJS(array);
  const maxIndex = arr.size - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = arr.get(index);
  }
};

exports.arrayGetMoriJs = (cycles) => {
  const arr = moriJs.vector(...array);
  const maxIndex = moriJs.count(arr) - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = moriJs.get(arr, index);
  }
};

exports.arrayGetUnchanged = (cycles) => {
  const maxIndex = array.length - 1;

  let index, val;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    val = get([index], array);
  }
};
