// external dependencies
import {parse} from 'pathington';

/**
 * @constant {Object} GLOBAL
 */
export const GLOBAL = typeof window === 'object' ? window : global;

/**
 * @function curry
 *
 * @description
 * simple curry application method
 *
 * @param {function} fn the function to curry
 * @returns {function(...Array<*>): *} the curried version of fn
 */
export const curry = (fn) => {
  return function curried(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...remainingArgs) => {
        return curried(...args, ...remainingArgs);
      };
  };
};

/**
 * @function isKeyForArrayType
 *
 * @description
 * is the key passed for array type children
 *
 * @param {number|string} key the key to test
 * @returns {boolean} is the key passed for array types
 */
export const isKeyForArrayType = (key) => {
  return typeof key === 'number';
};

/**
 * @function getFunctionName
 *
 * @description
 * get the function name based on the property or derivation from the string value
 *
 * @param {function} fn the function to get the name of
 * @returns {string} the name of the function
 */
export const getFunctionName = (fn) => {
  const match =
    typeof fn === 'function' ? (fn.name ? [null, fn.name] : fn.toString().match(/function ([^\(]+)/)) : null;

  return match ? match[1] : '__NO_CONSTRUCTOR_FOUND__';
};

/**
 * @function getShallowClone
 *
 * @description
 * get a shallow clone of the value passed based on the type requested (maintaining prototype)
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} key the key to base the object type from
 * @returns {Array<*>|Object} a shallow clone of the value
 */
export const getShallowClone = (object) => {
  return Array.isArray(object)
    ? [...object]
    : object.constructor === Object || typeof GLOBAL[getFunctionName(object.constructor)] === 'function'
      ? {...object}
      : Object.keys(object).reduce((clone, key) => {
        clone[key] = object[key];

        return clone;
      }, Object.create(Object.getPrototypeOf(object)));
};

/**
 * @function getNewEmptyChild
 *
 * @description
 * get a new empty child for the type of key provided
 *
 * @param {number|string} key the key to test
 * @returns {Array|Object} the empty child
 */
export const getNewEmptyChild = (key) => {
  return isKeyForArrayType(key) ? [] : {};
};

/**
 * @function getNewChildClone
 *
 * @description
 * get the shallow clone of the child when it is the correct type
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} nextKey the key that the next object will be based from
 * @returns {Array<*>|Object} the clone of the key at object
 */
export const getNewChildClone = (object, nextKey) => {
  return object
    ? isKeyForArrayType(nextKey)
      ? Array.isArray(object) ? getShallowClone(object) : []
      : Array.isArray(object) ? {} : getShallowClone(object)
    : getNewEmptyChild(nextKey);
};

/**
 * @function onMatchAtPath
 *
 * @description
 * when there is a match for the path requested, call onMatch, else return the noMatchValue
 *
 * @param {Array<number|string>} path the path to find a match at
 * @param {Array<*>|Object} object the object to find the path in
 * @param {boolean} shouldClone should the object be cloned
 * @param {function} onMatch when a match is found, call this method
 * @param {*} noMatchValue when no match is found, return this value
 * @returns {*} either the return from onMatch or the noMatchValue
 */
export const onMatchAtPath = (path, object, shouldClone, onMatch, noMatchValue) => {
  if (path.length <= 1) {
    const result = shouldClone || object ? onMatch(object, path[0]) : noMatchValue;

    return shouldClone ? object : result;
  }

  const key = path.shift();

  if (shouldClone) {
    object[key] = onMatchAtPath(path, getNewChildClone(object[key], path[0]), shouldClone, onMatch, noMatchValue);

    return object;
  }

  return object && Object.prototype.hasOwnProperty.call(object, key)
    ? onMatchAtPath(path, object[key], shouldClone, onMatch, noMatchValue)
    : noMatchValue;
};

/**
 * @function getNestedProperty
 *
 * @description
 * parse the path passed and get the nested property at that path
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
export const getNestedProperty = (path, object) => {
  return onMatchAtPath(parse(path), object, false, (ref, key) => {
    return ref[key];
  });
};

/**
 * @function getDeepClone
 *
 * @description
 * parse the path passed and clone the object at that path
 *
 * @param {Array<number|string>|number|string} path the path to deeply modify the object on
 * @param {Array<*>|Object} object the objeisCurrentKeyArrayct to modify
 * @param {function} callback the callback to execute
 * @returns {Array<*>|Object} the clone object
 */
export const getDeepClone = (path, object, callback) => {
  const parsedPath = parse(path);

  return onMatchAtPath(parsedPath, object ? getShallowClone(object) : getNewEmptyChild(parsedPath[0]), true, callback);
};

/**
 * @function hasNestedProperty
 *
 * @description
 * parse the path passed and determine if a value at the path exists
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {boolean} does the nested path exist
 */
export const hasNestedProperty = (path, object) => {
  return object
    ? onMatchAtPath(
      parse(path),
      object,
      false,
      (ref, key) => {
        return !!ref && Object.prototype.hasOwnProperty.call(ref, key);
      },
      false
    )
    : false;
};

/**
 * @function isEmptyKey
 *
 * @description
 * is the object passed an empty key value
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object an empty key value
 */
export const isEmptyKey = (object) => {
  return object === void 0 || object === null || object.length === 0;
};
