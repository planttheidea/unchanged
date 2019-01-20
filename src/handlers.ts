// utils
import {
  callIfFunction,
  getDeepClone,
  getFullPath,
  getMergedObject,
  getValueAtPath,
  getNewEmptyObject,
  isCloneable,
  isEmptyPath,
  isSameValueZero,
  splice,
  throwInvalidFnError,
} from './utils';

const { isArray } = Array;
const { slice } = Array.prototype;

/**
 * @function createCall
 *
 * @description
 * create handlers for call / callWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns call / callWith
 */
export const createCall: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      parameters: any[],
      object: unchanged.Unchangeable | Function,
      context: any = object,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 5);

      if (isEmptyPath(path)) {
        return callIfFunction(fn(object, ...extraArgs), context, parameters);
      }

      const value: any = getValueAtPath(path, object);

      if (value === void 0) {
        return;
      }

      const result: any = fn(value, ...extraArgs);

      return callIfFunction(result, context, parameters);
    };
  }

  return (
    path: unchanged.Path,
    parameters: any[],
    object: unchanged.Unchangeable | Function,
    context = object,
  ): any => {
    const callable: any = isEmptyPath(path)
      ? object
      : getValueAtPath(path, object);

    return callIfFunction(callable, context, parameters);
  };
};

/**
 * @function createGet
 *
 * @description
 * create handlers for get / getWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns get / getWith
 */
export const createGet: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value: any = getValueAtPath(path, object);

      return value === void 0 ? value : fn(value, ...extraArgs);
    };
  }

  return (path: unchanged.Path, object: unchanged.Unchangeable): any =>
    isEmptyPath(path) ? object : getValueAtPath(path, object);
};

/**
 * @function createGetOr
 *
 * @description
 * create handlers for getOr / getWithOr
 *
 * @param isWithHandler is the method using a with handler
 * @returns getOr / getWithOr
 */
export const createGetOr: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      noMatchValue: any,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value: any = getValueAtPath(path, object);

      return value === void 0 ? noMatchValue : fn(value, ...extraArgs);
    };
  }

  return (
    noMatchValue: any,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): any =>
    isEmptyPath(path) ? object : getValueAtPath(path, object, noMatchValue);
};

/**
 * @function createHas
 *
 * @description
 * create handlers for has / hasWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns has / hasWith
 */
export const createHas: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        return !!fn(object, ...extraArgs);
      }

      const value: any = getValueAtPath(path, object);

      return value !== void 0 && !!fn(value, ...extraArgs);
    };
  }

  return (path: unchanged.Path, object: unchanged.Unchangeable): boolean =>
    isEmptyPath(path)
      ? object != null
      : getValueAtPath(path, object) !== void 0;
};

/**
 * @function createIs
 *
 * @description
 * create handlers for is / isWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns is / isWith
 */
export const createIs: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      value: any,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return isSameValueZero(fn(object, ...extraArgs), value);
      }

      return isSameValueZero(
        fn(getValueAtPath(path, object), ...extraArgs),
        value,
      );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): boolean =>
    isEmptyPath(path)
      ? isSameValueZero(object, value)
      : isSameValueZero(getValueAtPath(path, object), value);
};

/**
 * @function createMerge
 *
 * @description
 * create handlers for merge / mergeWith
 *
 * @param isWithHandler is the method using a with handler
 * @param isDeep is the handler for a deep merge or shallow
 * @returns merge / mergeWith
 */
export const createMerge: Function = (
  isWithHandler: boolean,
  isDeep: boolean,
): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (!isCloneable(object)) {
        return fn(object, ...extraArgs);
      }

      if (isEmptyPath(path)) {
        const objectToMerge: any = fn(object, ...extraArgs);

        return objectToMerge
          ? getMergedObject(object, objectToMerge, isDeep)
          : object;
      }

      let hasChanged: boolean = false;

      const result: unchanged.Unchangeable = getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: string): void => {
          const objectToMerge: any = fn(ref[key], ...extraArgs);

          if (objectToMerge) {
            ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);

            hasChanged = true;
          }
        },
      );

      return hasChanged ? result : object;
    };
  }

  return (
    path: unchanged.Path,
    objectToMerge: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => {
    if (!isCloneable(object)) {
      return objectToMerge;
    }

    return isEmptyPath(path)
      ? getMergedObject(object, objectToMerge, true)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
          },
        );
  };
};

/**
 * @function createNot
 *
 * @description
 * create handlers for not / notWith
 *
 * @param isWithHandler not the method using a with handler
 * @returns not / notWithHandler
 */
export const createNot: Function = (isWithHandler: boolean): Function => {
  const is: Function = createIs(isWithHandler);

  return function () {
    return !is.apply(this, arguments);
  };
};

/**
 * @function createRemove
 *
 * @description
 * create handlers for remove / removeWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns remove / removeWith
 */
export const createRemove: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        const emptyObject: unchanged.Unchangeable = getNewEmptyObject(object);

        return fn(emptyObject, ...extraArgs) ? emptyObject : object;
      }

      const value: any = getValueAtPath(path, object);

      return value !== void 0 && fn(value, ...extraArgs)
        ? getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              if (isArray(ref)) {
                splice(ref, key);
              } else {
                delete ref[key];
              }
            },
          )
        : object;
    };
  }

  return (
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => {
    if (isEmptyPath(path)) {
      return getNewEmptyObject(object);
    }

    return getValueAtPath(path, object) !== void 0
      ? getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            if (isArray(ref)) {
              splice(ref, key);
            } else {
              delete ref[key];
            }
          },
        )
      : object;
  };
};

/**
 * @function createSet
 *
 * @description
 * create handlers for set / setWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns set / setWith
 */
export const createSet: Function = (isWithHandler: boolean): Function => {
  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      return isEmptyPath(path)
        ? fn(object, ...extraArgs)
        : getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              ref[key] = fn(ref[key], ...extraArgs);
            },
          );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable =>
    isEmptyPath(path)
      ? value
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            ref[key] = value;
          },
        );
};

/**
 * @function createAdd
 *
 * @description
 * create handlers for add / addWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns add / addWith
 */
export const createAdd: Function = (isWithHandler: boolean): Function => {
  const add: Function = createSet(isWithHandler);

  if (isWithHandler) {
    return function (
      fn: unchanged.withHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      return add.apply(
        this,
        [fn, getFullPath(path, object, fn), object].concat(
          slice.call(arguments, 3),
        ),
      );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => add(getFullPath(path, object), value, object);
};
