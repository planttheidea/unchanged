/* eslint no-unused-vars: 0 */
const _ = require('lodash/fp');
const {path} = require('ramda');
const {get} = require('../dist/unchanged.cjs');

/**
 * Data
 */

const value = Math.random();
const array = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];

module.exports = {
  // objects
  objectGetNative(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = obj.value;
    }
  },
  objectGetLodashFp(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = _.get(['value'], obj);
    }
  },
  objectGetLodashFpDotty(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = _.get('value', obj);
    }
  },
  objectGetRamda(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = path(['value'], obj);
    }
  },
  objectGetUnchanged(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = get(['value'], obj);
    }
  },
  objectGetUnchangedDotty(cycles) {
    const obj = {value};

    let val;

    for (let i = 0; i < cycles; i++) {
      val = get('value', obj);
    }
  },

  // arrays
  arrayGetNative(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = array[index];
    }
  },
  arrayGetLodashFp(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = _.get([index], array);
    }
  },
  arrayGetLodashFpDotty(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = _.get(index, array);
    }
  },
  arrayGetRamda(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = path([index], array);
    }
  },
  arrayGetUnchanged(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = get([index], array);
    }
  },
  arrayGetUnchangedDotty(cycles) {
    const maxIndex = array.length - 1;

    let index; let val;

    for (let i = 0; i < cycles; i++) {
      index = ~~(Math.random() * maxIndex);
      val = get(0, array);
    }
  },
};
