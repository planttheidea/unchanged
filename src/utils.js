/**
 * @constant {Object} GLOBAL
 */
export const GLOBAL = window || global;

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
    return args.length
      ? args.length >= fn.length
        ? fn(...args)
        : (...remainingArgs) => {
          return curried(...args, ...remainingArgs);
        }
      : curried;
  };
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
  return (
    fn.name ||
    (() => {
      const functionString = fn.toString();

      return functionString.substring(9, functionString.indexOf('('));
    })()
  );
};

/**
 * @function getNestedProperty
 *
 * @description
 * recursive function to get the nested key at path
 *
 * @param {Array<number|string>} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
export const getNestedProperty = (path, object) => {
  if (path.length === 1) {
    return object ? object[path[0]] : undefined;
  }

  const key = path.shift();

  return object && Object.prototype.hasOwnProperty.call(object, key) ? getNestedProperty(path, object[key]) : undefined;
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
    : typeof GLOBAL[getFunctionName(object.constructor)] === 'function'
      ? {...object}
      : Object.keys(object).reduce((clone, key) => {
        clone[key] = object[key];

        return clone;
      }, Object.create(Object.getPrototypeOf(object)));
};

/**
 * @function getNewChildClone
 *
 * @description
 * get the shallow clone of the child when it is the correct type
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} key the key to clone on the object
 * @returns {Array<*>|Object} the clone of the key at object
 */
export const getNewChildClone = (object, key) => {
  return typeof key === 'number'
    ? Array.isArray(object) ? getShallowClone(object[key]) : []
    : object[key] && typeof object[key] === 'object' ? getShallowClone(object[key]) : {};
};

/**
 * @function cloneWithCallback
 *
 * @description
 * clone the object passed, using the callback to modify the clone as needed
 *
 * @param {Array<number|string>|number|string} path the path to deeply modify the object on
 * @param {Array<*>|Object} object the objeisCurrentKeyArrayct to modify
 * @param {function} callback
 the callback to execute
 * @returns {Array<*>|Object} the clone object
 */
export const getDeepClone = (path, object, callback) => {
  if (path.length === 1) {
    callback(object, path[0]);

    return object;
  }

  const key = path.shift();

  object[key] = getDeepClone(path, getNewChildClone(object, key), callback);

  return object;
};
