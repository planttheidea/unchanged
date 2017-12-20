/* eslint no-unused-vars: 0 */
const _ = require('lodash/fp');
const {assoc} = require('ramda');
const {set} = require('../lib');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

module.exports = {
  // objects
  objectSetNative(cycles) {
    const obj = {value};

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      Object.assign({}, obj, {value: newValue});
    }
  },
  objectSetLodashFp(cycles) {
    const obj = {value};

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      _.set('value', newValue, obj);
    }
  },
  objectSetRamda(cycles) {
    const obj = {value};

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      assoc('value', newValue, obj);
    }
  },
  objectSetUnchanged(cycles) {
    const obj = {value};

    let newValue;

    for (let i = 0; i < cycles; i++) {
      newValue = Math.random();

      set('value', newValue, obj);
    }
  },

  // arrays
  arraySetNative(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let newArr, index, newVal;

    for (let i = 0; i < cycles; i++) {
      newArr = [].concat(arr);
      index = ~~(Math.random() * maxIndex);
      newVal = Math.random();

      newArr[index] = newVal;
    }
  },
  arraySetLodashFp(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let newArr, index, newVal;

    for (let i = 0; i < cycles; i++) {
      newArr = [].concat(arr);
      index = ~~(Math.random() * maxIndex);
      newVal = Math.random();

      _.set(index, newVal, newArr);
    }
  },
  arraySetRamda(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let newArr, index, newVal;

    for (let i = 0; i < cycles; i++) {
      newArr = [].concat(arr);
      index = ~~(Math.random() * maxIndex);
      newVal = Math.random();

      assoc(index, newVal, newArr);
    }
  },
  arraySetUnchanged(cycles) {
    const arr = array;
    const maxIndex = arr.length - 1;

    let newArr, index, newVal;

    for (let i = 0; i < cycles; i++) {
      newArr = [].concat(arr);
      index = ~~(Math.random() * maxIndex);
      newVal = Math.random();

      set(index, newVal, newArr);
    }
  }
};
