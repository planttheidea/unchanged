// utils
import {curry, getDeepClone, getNestedProperty, hasNestedProperty, isEmptyKey} from './utils';

/**
 * @function get
 *
 * @description
 * get the value to the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to get the value at
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
 * @param {Array<number|string>|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {boolean} does the path exist
 */
export const has = curry((path, object) => {
  return isEmptyKey(path) ? !!object : hasNestedProperty(path, object);
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
  return hasNestedProperty(path, object)
    ? getDeepClone(path, object, (ref, key) => {
      if (Array.isArray(ref)) {
        ref.splice(key, 1);
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
  return getDeepClone(path, object, (ref, key) => {
    ref[key] = value;
  });
});

/**
 * @function add
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value added
 */
export const add = curry((path, value, object) => {
  const nestedValue = get(path, object);
  const fullPath = Array.isArray(nestedValue) ? `${isEmptyKey(path) ? '' : path}[${nestedValue.length}]` : path;

  return set(fullPath, value, object);
});
