// external dependencies
import {
  __,
  curry,
} from 'curriable';

// handlers
import {
  addWith as uncurriedAddWith,
  assignWith as uncurriedAssignWith,
  callWith as uncurriedCallWith,
  getWith as uncurriedGetWith,
  hasWith as uncurriedHasWith,
  isWith as uncurriedIsWith,
  mergeWith as uncurriedMergeWith,
  removeWith as uncurriedRemoveWith,
  setWith as uncurriedSetWith,
} from './handlers';

export {__};

/**
 * @function add
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value added
 */
export const add = curry((path, value, object) => uncurriedAddWith(null, path, value, object));

export const addWith = curry(uncurriedAddWith, 4);

/**
 * @function assign
 *
 * @description
 * get the shallowly-merged object at path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} objectToAssign the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @returns {Array<*>|Object} the new merged object
 */
export const assign = curry((path, objectToAssign, object) => uncurriedAssignWith(null, path, objectToAssign, object));

export const assignWith = curry(uncurriedAssignWith);

/**
 * @function call
 *
 * @description
 * call a nested method at the path requested with the parameters provided
 *
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>} parameters the parameters to call the method with
 * @param {Array<*>|Object} object the object to call the method from
 * @param {*} context the context to set as "this" in the function call
 */
export const call = curry(
  (path, parameters, object, context = object) => uncurriedCallWith(null, path, parameters, object, context),
  3
);

export const callWith = curry(uncurriedCallWith, 4);

/**
 * @function get
 *
 * @description
 * get the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {*} the value requested
 */
export const get = curry((path, object) => uncurriedGetWith(null, path, object));

/**
 * @function getOr
 *
 * @description
 * get the value to the object at the path requested, or noMatchValue if nothing
 * is there.
 *
 * @param {*} noMatchValue the fallback value if nothing is found at the given path
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {*} the value requested
 */
export const getOr = curry((noMatchValue, path, object) => uncurriedGetWith(null, path, object, noMatchValue));

export const getWith = curry(
  (fn, path, object, ...extraArgs) => uncurriedGetWith(fn, path, object, void 0, ...extraArgs),
  3
);

export const getWithOr = curry(
  (fn, noMatchValue, path, object, ...extraArgs) => uncurriedGetWith(fn, path, object, noMatchValue, ...extraArgs),
  4
);

/**
 * @function has
 *
 * @description
 * does the nested path exist on the object
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {boolean} does the path exist
 */
/* eslint-disable eqeqeq */
export const has = curry((path, object) => uncurriedHasWith(null, path, object));
/* eslint-enable */

export const hasWith = curry(uncurriedHasWith, 3);

export const is = curry((path, value, object) => uncurriedIsWith(null, path, value, object));

export const isWith = curry(uncurriedIsWith);

/**
 * @function merge
 *
 * @description
 * get the deeply-merged object at path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} objectToMerge the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @returns {Array<*>|Object} the new merged object
 */
export const merge = curry((path, objectToMerge, object) => uncurriedMergeWith(null, path, objectToMerge, object));

export const mergeWith = curry(uncurriedMergeWith, 4);

/**
 * @function removeobject with quoted keys
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @returns {Array<*>|Object} a new object with the same structure and the value removed
 */
export const remove = curry((path, object) => uncurriedRemoveWith(null, path, object));

export const removeWith = curry(uncurriedRemoveWith, 2);

/**
 * @function set
 *
 * @description
 * set the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {*} value the value to set
 * @param {Array<*>|Object} object the object to set the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value assigned
 */
export const set = curry((path, value, object) => uncurriedSetWith(null, path, value, object));

/**
 * @function setWith
 *
 * @description
 * perform same operation as set, but using a callback function that receives
 * the value (and additional parameters, if provided) to get the value to set
 *
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {function} fn the function to transform the retrieved value with
 * @param {Array<*>|Object} object the object to set the value in
 * @param {...Array<any>} extraArgs additional arguments to pass to the transform function
 * @returns {Array<*>|Object} a new object with the same structure and the value assigned
 */
export const setWith = curry(
  (fn, path, object, ...extraArgs) => uncurriedSetWith(fn, path, null, object, ...extraArgs),
  3
);
