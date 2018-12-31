// utils
import {
  callIfFunction,
  getDeepClone,
  getMergedObject,
  getNestedProperty,
  getNewEmptyObject,
  isCloneable,
  isEmptyPath,
  isSameValueZero,
  splice,
  throwInvalidFnError,
} from './utils';

const { isArray } = Array;
const { slice } = Array.prototype;

export const assignWith: Function = function (
  path: unchanged.Path,
  objectToAssign: unchanged.Unchangeable,
  object: unchanged.Unchangeable,
  fn?: Function,
): unchanged.Unchangeable {
  if (!isCloneable(object)) {
    return objectToAssign;
  }

  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 4);

    return isEmptyPath(path)
      ? fn(getMergedObject(object, objectToAssign, false), ...extraArgs)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
            ref[key] = fn(
              getMergedObject(ref[key], objectToAssign, false),
              ...extraArgs,
            );
          },
        );
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToAssign, false)
    : getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
          ref[key] = getMergedObject(ref[key], objectToAssign, false);
        },
      );
};

/**
 * @function callWith
 *
 * @description
 * call a nested method at the path requested with the parameters provided
 *
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>} parameters the parameters to call the method with
 * @param {Array<*>|Object} object the object to call the method from
 * @param {*} context the context to set as "this" in the function call
 * @param {function} fn the function to validate if the function should be called
 * @returns {*} the return of the function call
 */
export const callWith: Function = function (
  path: unchanged.Path,
  parameters: any[],
  object: unchanged.Unchangeable | Function,
  context: any = object,
  fn?: Function,
): any {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 5);

    if (isEmptyPath(path)) {
      return callIfFunction(fn(object, ...extraArgs), context, parameters);
    }

    const value: any = getNestedProperty(path, object);

    return fn(value, ...extraArgs)
      ? callIfFunction(value, context, parameters)
      : void 0;
  }

  const callable: any = isEmptyPath(path)
    ? object
    : getNestedProperty(path, object);

  return callIfFunction(callable, context, parameters);
};

export const getWith: Function = function (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  noMatchValue?: any,
  fn?: Function,
): any {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 4);

    if (isEmptyPath(path)) {
      return fn(object, ...extraArgs);
    }

    const value: any = getNestedProperty(path, object, noMatchValue);

    if (value === void 0) {
      return;
    }

    return fn(value, ...extraArgs) ? value : void 0;
  }

  return isEmptyPath(path)
    ? object
    : getNestedProperty(path, object, noMatchValue);
};

export const hasWith: Function = function (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  fn?: Function,
): boolean {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    if (isEmptyPath(path)) {
      // eslint-disable-next-line eqeqeq
      return object == null;
    }

    const value: any = getNestedProperty(path, object);
    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 3);

    return value !== void 0 && !!fn(value, ...extraArgs);
  }

  // eslint-disable-next-line eqeqeq
  return isEmptyPath(path)
    ? object != null
    : getNestedProperty(path, object) !== void 0;
};

export const isWith: Function = function (
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable,
  fn?: Function,
): boolean {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 4);

    if (isEmptyPath(path)) {
      // eslint-disable-next-line eqeqeq
      return fn(object, ...extraArgs) == null;
    }

    return isSameValueZero(
      fn(getNestedProperty(path, object), ...extraArgs),
      value,
    );
  }

  return isEmptyPath(path)
    ? isSameValueZero(object, value)
    : isSameValueZero(getNestedProperty(path, object), value);
};

/**
 * @function mergeWith
 *
 * @description
 * get the deeply-merged object at path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} objectToMerge the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @param {function} fn the function to compute the value to merge
 * @returns {Array<*>|Object} the new merged object
 */
export const mergeWith: Function = function (
  path: unchanged.Path,
  objectToMerge: unchanged.Unchangeable,
  object: unchanged.Unchangeable,
  fn?: Function,
): any {
  if (!isCloneable(object)) {
    return objectToMerge;
  }

  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 4);

    return isEmptyPath(path)
      ? fn(getMergedObject(object, objectToMerge, true), ...extraArgs)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
            ref[key] = fn(
              getMergedObject(ref[key], objectToMerge, true),
              ...extraArgs,
            );
          },
        );
  }

  return isEmptyPath(path)
    ? getMergedObject(object, objectToMerge, true)
    : getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
          ref[key] = getMergedObject(ref[key], objectToMerge, true);
        },
      );
};

/**
 * @function removeWith
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @param {function} fn the function to validate if the value should be removed
 * @returns {Array<*>|Object} a new object with the same structure and the value removed
 */
export const removeWith: Function = function (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  fn?: Function,
): unchanged.Unchangeable {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line
    const extraArgs: any[] = slice.call(arguments, 3);

    if (isEmptyPath(path)) {
      return fn(getNewEmptyObject(object), ...extraArgs);
    }

    if (fn(getNestedProperty(path, object), ...extraArgs)) {
      return getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
          if (isArray(ref)) {
            splice(ref, key);
          } else {
            delete ref[key];
          }
        },
      );
    }

    return object;
  }

  if (isEmptyPath(path)) {
    return getNewEmptyObject(object);
  }

  if (getNestedProperty(path, object) === void 0) {
    return object;
  }

  return getDeepClone(
    path,
    object,
    (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
      if (isArray(ref)) {
        splice(ref, key);
      } else {
        delete ref[key];
      }
    },
  );
};

/**
 * @function setWith
 *
 * @description
 * perform same operation as set, but using a callback function that receives
 * the value (and additional parameters, if provided) to get the value to set
 *
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {*} value the value to set in the object
 * @param {Array<*>|Object} object the object to set the value in
 * @param {function} fn the function to set the retrieved value with
 * @returns {Array<*>|Object} a new object with the same structure and the value assigned
 */
export const setWith: Function = function (
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable,
  fn?: Function,
): any {
  if (fn) {
    if (typeof fn !== 'function') {
      throwInvalidFnError();
    }

    // eslint-disable-next-line prefer-rest-params
    const extraArgs: any[] = slice.call(arguments, 4);

    return isEmptyPath(path)
      ? fn(object, ...extraArgs)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
            ref[key] = fn(ref[key], ...extraArgs);
          },
        );
  }

  return isEmptyPath(path)
    ? value
    : getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: unchanged.PathItem) => {
          ref[key] = value;
        },
      );
};

/**
 * @function addWith
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @param {function} fn the function that will determine the value to add
 * @returns {Array<*>|Object} a new object with the same structure and the value added
 */
export const addWith: Function = function (
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable,
  fn?: Function,
): any {
  const isPathEmpty: boolean = isEmptyPath(path);
  const valueAtPath: any = isPathEmpty
    ? object
    : getNestedProperty(path, object);
  const fullPath: unchanged.Path = isArray(valueAtPath)
    ? isArray(path)
      ? path.concat([valueAtPath.length])
      : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
    : path;

  // eslint-disable-next-line prefer-rest-params
  return setWith(fullPath, value, object, fn, ...slice.call(arguments, 4));
};
