// external dependencies
import {
  __,
  curry,
} from 'curriable';

// utils
import {
  callIfFunction,
  callNestedProperty,
  getDeepClone,
  getMergedObject,
  getNestedProperty,
  getNewEmptyObject,
  hasNestedProperty,
  isArray,
  isCloneable,
  isEmptyPath,
  splice,
} from './utils';

export {__};

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
export const assign = curry((path, objectToAssign, object) => {
  if (!isCloneable(object)) {
    return objectToAssign;
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToAssign, false)
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = getMergedObject(ref[key], objectToAssign, false);
    });
});

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
  (path, parameters, object, context = object) =>
    isEmptyPath(path)
      ? callIfFunction(object, context, parameters)
      : callNestedProperty(path, context, parameters, object),
  // eslint-disable-next-line no-magic-numbers
  3
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
export const get = curry((path, object) => (isEmptyPath(path) ? object : getNestedProperty(path, object)));

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
export const getOr = curry((noMatchValue, path, object) =>
  isEmptyPath(path) ? object : getNestedProperty(path, object, noMatchValue)
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
export const has = curry((path, object) => (isEmptyPath(path) ? object != null : hasNestedProperty(path, object)));
/* eslint-enable */

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
export const merge = curry((path, objectToMerge, object) => {
  if (!isCloneable(object)) {
    return objectToMerge;
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToMerge, true)
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = getMergedObject(ref[key], objectToMerge, true);
    });
});

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
export const remove = curry((path, object) => {
  if (isEmptyPath(path)) {
    return getNewEmptyObject(object);
  }

  return hasNestedProperty(path, object)
    ? getDeepClone(path, object, (ref, key) => {
      if (isArray(ref)) {
        splice(ref, key);
      } else {
        delete ref[key];
      }
    })
    : object;
});

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
export const set = curry((path, value, object) =>
  isEmptyPath(path)
    ? value
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = value;
    })
);

/**
 * @function transform
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
export const transform = curry(
  (path, fn, object, ...extraArgs) =>
    isEmptyPath(path)
      ? fn(object, ...extraArgs)
      : getDeepClone(path, object, (ref, key) => (ref[key] = fn(ref[key], ...extraArgs))),
  // eslint-disable-next-line no-magic-numbers
  3
);

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
export const add = curry((path, value, object) => {
  const isPathEmpty = isEmptyPath(path);
  const valueAtPath = isPathEmpty ? object : getNestedProperty(path, object);
  const fullPath = isArray(valueAtPath)
    ? isArray(path)
      ? path.concat([valueAtPath.length])
      : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
    : path;

  return set(fullPath, value, object);
});
