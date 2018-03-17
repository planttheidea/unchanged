// external dependencies
import {__, curry} from 'curriable';

// utils
import {
  getDeepClone,
  getDeeplyMergedObject,
  getNestedProperty,
  getNewEmptyObject,
  hasNestedProperty,
  isArray,
  isCloneable,
  isEmptyKey,
  splice
} from './utils';

export {__};

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
export const get = curry((path, object) => {
  return isEmptyKey(path) ? object : getNestedProperty(path, object);
});

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
export const has = curry((path, object) => {
  return isEmptyKey(path) ? !!object : hasNestedProperty(path, object);
});

/**
 * @function merge
 *
 * @description
 * get the deeply-merged object at path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @returns {Array<*>|Object} the new merged object
 */
export const merge = curry((path, objectToMerge, object) => {
  if (!isCloneable(object)) {
    return objectToMerge;
  }

  return isEmptyKey(path)
    ? getDeeplyMergedObject(object, objectToMerge)
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = getDeeplyMergedObject(ref[key], objectToMerge);
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
  if (isEmptyKey(path)) {
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
export const set = curry((path, value, object) => {
  return isEmptyKey(path)
    ? value
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = value;
    });
});

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
  const nestedValue = get(path, object);
  const fullPath = isArray(nestedValue)
    ? isArray(path) ? path.concat([nestedValue.length]) : `${isEmptyKey(path) ? '' : path}[${nestedValue.length}]`
    : path;

  return set(fullPath, value, object);
});
