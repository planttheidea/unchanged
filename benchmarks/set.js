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

exports.objectSetNative = (cycles) => {
  const obj = {value};

  let newValue;

  for (let i = 0; i < cycles; i++) {
    newValue = Math.random();

    Object.assign({}, obj, {value: newValue});
  }
};

exports.objectSetSeamlessImmutableJs = (cycles) => {
  const obj = seamlessImmutableJs.from({value});

  let newValue;

  for (let i = 0; i < cycles; i++) {
    newValue = Math.random();

    obj.set('value', newValue);
  }
};

exports.objectSetImmutableJs = (cycles) => {
  const obj = ImmutableJs.fromJS({value});

  let newValue;

  for (let i = 0; i < cycles; i++) {
    newValue = Math.random();

    obj.set('value', newValue);
  }
};

exports.objectSetMoriJs = (cycles) => {
  const obj = moriJs.hashMap('value', value);

  let newValue;

  for (let i = 0; i < cycles; i++) {
    newValue = Math.random();

    moriJs.assoc(obj, 'value', newValue);
  }
};

exports.objectSetUnchanged = (cycles) => {
  const obj = {value};

  let newValue;

  for (let i = 0; i < cycles; i++) {
    newValue = Math.random();

    set('value', newValue, obj);
  }
};

exports.arraySetNative = (cycles) => {
  const arr = array;
  const maxIndex = arr.length - 1;

  let newArr, index, newVal;

  for (let i = 0; i < cycles; i++) {
    newArr = [].concat(arr);
    index = ~~(Math.random() * maxIndex);
    newVal = Math.random();

    newArr[index] = newVal;
  }
};

exports.arraySetSeamlessImmutableJs = (cycles) => {
  const arr = seamlessImmutableJs.from(array);
  const maxIndex = arr.length - 1;

  let index, newVal;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    newVal = Math.random();

    arr.set(index, newVal);
  }
};

exports.arraySetImmutableJs = (cycles) => {
  const arr = ImmutableJs.fromJS(array);
  const maxIndex = arr.size - 1;

  let index, newVal;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    newVal = Math.random();

    arr.set(index, newVal);
  }
};

exports.arraySetMoriJs = (cycles) => {
  const arr = moriJs.vector(...array);
  const maxIndex = moriJs.count(arr) - 1;

  let index, newVal;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    newVal = Math.random();

    moriJs.assoc(arr, index, newVal);
  }
};

exports.arraySetUnchanged = (cycles) => {
  const arr = [...array];
  const maxIndex = arr.length - 1;

  let index, newVal;

  for (let i = 0; i < cycles; i++) {
    index = ~~(Math.random() * maxIndex);
    newVal = Math.random();

    set(index, newVal, arr);
  }
};
