// external dependencies
import {parse} from 'pathington';

// utils
import {curry, getDeepClone, getNestedProperty, getShallowClone} from './utils';

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
  return path ? getNestedProperty(parse(path), object) : object;
});

/**
 * @function remove
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @returns {Array<*>|Object} a new object with the same structure and the value removed
 */
export const remove = curry((path, object) => {
  return getDeepClone(parse(path), getShallowClone(object), (ref, key) => {
    if (Array.isArray(ref)) {
      ref.splice(key, 1);
    } else {
      delete ref[key];
    }
  });
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
  return getDeepClone(parse(path), getShallowClone(object), (ref, key) => {
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
  const fullPath = Array.isArray(nestedValue) ? `${path}[${nestedValue.length}]` : path;

  return set(fullPath, value, object);
});
