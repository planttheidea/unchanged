// utils
import {
  callIfFunction,
  getDeepClone,
  getMergedObject,
  getNestedProperty,
  getNewEmptyObject,
  isArray,
  isCloneable,
  isEmptyPath,
  isSameValueZero,
  splice,
  throwInvalidFnError,
} from './utils';

export const assignWith = (fn, path, objectToAssign, object, ...extraArgs) => {
  if (!isCloneable(object)) {
    return objectToAssign;
  }

  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    return isEmptyPath(path)
      ? fn(getMergedObject(object, objectToAssign, false))
      : getDeepClone(path, object, (ref, key) => {
        ref[key] = fn(getMergedObject(ref[key], objectToAssign, false), ...extraArgs);
      });
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToAssign, false)
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = getMergedObject(ref[key], objectToAssign, false);
    });
};

/**
 * @function callWith
 *
 * @description
 * call a nested method at the path requested with the parameters provided
 *
 * @param {function} fn the function to validate if the function should be called
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>} parameters the parameters to call the method with
 * @param {Array<*>|Object} object the object to call the method from
 * @param {*} context the context to set as "this" in the function call
 * @returns {*} the return of the function call
 */
export const callWith = (fn, path, parameters, object, context = object, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      return callIfFunction(fn(object, ...extraArgs), context, parameters);
    }

    const value = getNestedProperty(path, object);

    return fn(value, ...extraArgs) ? callIfFunction(value, context, parameters) : void 0;
  }
};

export const getWith = (fn, path, object, noMatchValue, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      return fn(object);
    }

    const value = getNestedProperty(path, object, noMatchValue);

    if (value === void 0) {
      return;
    }

    return fn(value, ...extraArgs) ? value : void 0;
  }

  return isEmptyPath(path) ? object : getNestedProperty(path, object, noMatchValue);
};

export const hasWith = (fn, path, object, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      // eslint-disable-next-line eqeqeq
      return object == null;
    }

    const value = getNestedProperty(path, object);

    return value !== void 0 && !!fn(value, ...extraArgs);
  }

  // eslint-disable-next-line eqeqeq
  return isEmptyPath(path) ? object != null : getNestedProperty(path, object) !== void 0;
};

export const isWith = (fn, path, value, object, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      // eslint-disable-next-line eqeqeq
      return fn(object, ...extraArgs) == null;
    }

    return isSameValueZero(fn(getNestedProperty(path, object), ...extraArgs), value);
  }

  return isEmptyPath(path) ? isSameValueZero(object, value) : isSameValueZero(getNestedProperty(path, object), value);
};

/**
 * @function mergeWith
 *
 * @description
 * get the deeply-merged object at path
 *
 * @param {function} fn the function to compute the value to merge
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} objectToMerge the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @returns {Array<*>|Object} the new merged object
 */
export const mergeWith = (fn, path, objectToMerge, object, ...extraArgs) => {
  if (!isCloneable(object)) {
    return objectToMerge;
  }

  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    return isEmptyPath(path)
      ? fn(getMergedObject(object, objectToMerge, true), ...extraArgs)
      : getDeepClone(path, object, (ref, key) => {
        ref[key] = fn(getMergedObject(ref[key], objectToMerge, true), ...extraArgs);
      });
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToMerge, true)
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = getMergedObject(ref[key], objectToMerge, true);
    });
};

/**
 * @function removeWith
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {function} fn the function to validate if the value should be removed
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @returns {Array<*>|Object} a new object with the same structure and the value removed
 */
export const removeWith = (fn, path, object, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      return fn(getNewEmptyObject(object), ...extraArgs);
    }

    return fn(getNestedProperty(path, object), ...extraArgs)
      ? getDeepClone(path, object, (ref, key) => {
        if (isArray(ref)) {
          splice(ref, key);
        } else {
          delete ref[key];
        }
      })
      : object;
  }

  if (isEmptyPath(path)) {
    return getNewEmptyObject(object);
  }

  return getNestedProperty(path, object) !== void 0
    ? getDeepClone(path, object, (ref, key) => {
      if (isArray(ref)) {
        splice(ref, key);
      } else {
        delete ref[key];
      }
    })
    : object;
};

/**
 * @function setWith
 *
 * @description
 * perform same operation as set, but using a callback function that receives
 * the value (and additional parameters, if provided) to get the value to set
 *
 * @param {function} fn the function to set the retrieved value with
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {*} value the value to set in the object
 * @param {Array<*>|Object} object the object to set the value in
 * @param {...Array<any>} extraArgs additional arguments to pass to the transform function
 * @returns {Array<*>|Object} a new object with the same structure and the value assigned
 */
export const setWith = (fn, path, value, object, ...extraArgs) => {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    return isEmptyPath(path)
      ? fn(object, ...extraArgs)
      : getDeepClone(path, object, (ref, key) => {
        ref[key] = fn(ref[key], ...extraArgs);
      });
  }

  return isEmptyPath(path)
    ? value
    : getDeepClone(path, object, (ref, key) => {
      ref[key] = value;
    });
};

/**
 * @function addWith
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {function} fn the function that will determine the value to add
 * @param {Array<number|string>|null|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value added
 */
export const addWith = (fn, path, value, object, ...extraArgs) => {
  const isPathEmpty = isEmptyPath(path);
  const valueAtPath = isPathEmpty ? object : getNestedProperty(path, object);
  const fullPath = isArray(valueAtPath)
    ? isArray(path)
      ? path.concat([valueAtPath.length])
      : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
    : path;

  return setWith(fn, fullPath, value, object, ...extraArgs);
};
