/* eslint no-unused-vars: 0 */
const _ = require('lodash/fp');
const {path} = require('ramda');
const {get} = require('../lib');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

module.exports = {
  // objects
  objectGetInNative(cycles) {
    const obj = {
      data: {value}
    };

    let val;

    for (let i = 0; i < cycles; i++) {
      val = obj.data.value;
    }
  },
  objectGetInLodashFp(cycles) {
    const obj = {
      data: {value}
    };

    let val;

    for (let i = 0; i < cycles; i++) {
      val = _.get('data.value', obj);
    }
  },
  objectGetInRamda(cycles) {
    const obj = {
      data: {value}
    };

    let val;

    for (let i = 0; i < cycles; i++) {
      val = path(['data', 'value'], obj);
    }
  },
  objectGetInUnchanged(cycles) {
    const obj = {
      data: {value}
    };

    let val;

    for (let i = 0; i < cycles; i++) {
      val = get('data.value', obj);
    }
  },

  // arrays
  arrayGetInNative(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index, val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = arr[0][index];
    }
  },
  arrayGetInLodashFp(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index, val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = _.get(`[0][${index}]`, arr);
    }
  },
  arrayGetInRamda(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index, val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = path([0, index], arr);
    }
  },
  arrayGetInUnchanged(cycles) {
    const arr = [array];
    const maxIndex = arr[0].length - 1;

    let index, val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = get(`[0][${index}]`, arr);
    }
  }
};
