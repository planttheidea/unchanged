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
export const add = curry(uncurriedAddWith, 3);

export const addWith = curry((fn, path, value, object) => uncurriedAddWith(path, value, object, fn));

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
export const assign = curry(uncurriedAssignWith, 3);

export const assignWith = curry((fn, path, objectToAssign, object, ...extraArgs) =>
  uncurriedAssignWith(path, objectToAssign, object, fn, ...extraArgs)
);

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
export const call = curry(uncurriedCallWith, 3);

export const callWith = curry(
  (fn, path, parameters, object, context = object, ...extraArgs) =>
    uncurriedCallWith(path, parameters, object, context, fn, ...extraArgs),
  4
);

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
export const get = curry(uncurriedGetWith, 2);

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
export const getOr = curry(uncurriedGetWith, 3);

export const getWith = curry(
  (fn, path, object, ...extraArgs) => uncurriedGetWith(path, object, void 0, fn, ...extraArgs),
  3
);

export const getWithOr = curry(
  (fn, noMatchValue, path, object, ...extraArgs) => uncurriedGetWith(path, object, noMatchValue, fn, ...extraArgs),
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
export const has = curry(uncurriedHasWith, 2);
/* eslint-enable */

export const hasWith = curry((fn, path, object, ...extraArgs) => uncurriedHasWith(path, object, fn, ...extraArgs), 3);

export const is = curry(uncurriedIsWith, 3);

export const isWith = curry(
  (fn, path, value, object, ...extraArgs) => uncurriedIsWith(path, value, object, fn, ...extraArgs),
  4
);

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
export const merge = curry(uncurriedMergeWith, 3);

export const mergeWith = curry(
  (fn, path, objectToMerge, object, ...extraArgs) => uncurriedMergeWith(path, objectToMerge, object, fn, ...extraArgs),
  4
);

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
export const remove = curry(uncurriedRemoveWith, 2);

export const removeWith = curry(
  (fn, path, object, ...extraArgs) => uncurriedRemoveWith(path, object, fn, ...extraArgs),
  3
);

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
export const set = curry(uncurriedSetWith, 3);

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
  (fn, path, object, ...extraArgs) => uncurriedSetWith(path, null, object, fn, ...extraArgs),
  3
);
