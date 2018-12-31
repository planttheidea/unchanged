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

export const createAssign: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      objectToAssign: unchanged.Unchangeable,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      return isEmptyPath(path)
        ? fn(getMergedObject(object, objectToAssign, false), ...extraArgs)
        : getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              ref[key] = fn(
                getMergedObject(ref[key], objectToAssign, false),
                ...extraArgs,
              );
            },
          );
    };
  }

  return (
    path: unchanged.Path,
    objectToAssign: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable =>
    isEmptyPath(path)
      ? getMergedObject(object, objectToAssign, false)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: string): void => {
            ref[key] = getMergedObject(ref[key], objectToAssign, false);
          },
        );
};

export const createCall: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
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

      const result: any = fn(getNestedProperty(path, object), ...extraArgs);

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
      : getNestedProperty(path, object);

    return callIfFunction(callable, context, parameters);
  };
};

export const createGet: Function = (
  isWith: boolean,
  isOr: boolean,
): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
      noMatchValue?: any,
    ): any {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value: any = getNestedProperty(
        path,
        object,
        isOr ? noMatchValue : void 0,
      );

      if (value === void 0) {
        return;
      }

      return fn(value, ...extraArgs) ? value : void 0;
    };
  }

  return (
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    noMatchValue?: any,
  ): any =>
    isEmptyPath(path)
      ? object
      : getNestedProperty(path, object, isOr ? noMatchValue : void 0);
};

export const createGetFullPath: Function = (isWith: boolean): Function => {
  if (isWith) {
    return (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Path => {
      const isPathEmpty: boolean = isEmptyPath(path);
      const valueAtPath: any = isPathEmpty
        ? object
        : fn(getNestedProperty(path, object));

      return isArray(valueAtPath)
        ? isArray(path)
          ? path.concat([valueAtPath.length])
          : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
        : path;
    };
  }

  return (
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): unchanged.Path => {
    const isPathEmpty: boolean = isEmptyPath(path);
    const valueAtPath: any = isPathEmpty
      ? object
      : getNestedProperty(path, object);

    return isArray(valueAtPath)
      ? isArray(path)
        ? path.concat([valueAtPath.length])
        : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
      : path;
  };
};

export const createHas: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      if (isEmptyPath(path)) {
        return object == null;
      }

      const value: any = getNestedProperty(path, object);
      const extraArgs: any[] = slice.call(arguments, 3);

      return value !== void 0 && !!fn(value, ...extraArgs);
    };
  }

  return (path: unchanged.Path, object: unchanged.Unchangeable): boolean =>
    isEmptyPath(path)
      ? object != null
      : getNestedProperty(path, object) !== void 0;
};

export const createIs: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      value: any,
      object: unchanged.Unchangeable,
    ): boolean {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs) == null;
      }

      return isSameValueZero(
        fn(getNestedProperty(path, object), ...extraArgs),
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
      : isSameValueZero(getNestedProperty(path, object), value);
};

export const createMerge: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      objectToMerge: unchanged.Unchangeable,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (!isCloneable(object)) {
        return objectToMerge;
      }

      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 4);

      return isEmptyPath(path)
        ? fn(getMergedObject(object, objectToMerge, true), ...extraArgs)
        : getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: string): void => {
              ref[key] = fn(
                getMergedObject(ref[key], objectToMerge, true),
                ...extraArgs,
              );
            },
          );
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
            ref[key] = getMergedObject(ref[key], objectToMerge, true);
          },
        );
  };
};

export const createRemove: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        return fn(getNewEmptyObject(object), ...extraArgs);
      }

      return fn(getNestedProperty(path, object), ...extraArgs)
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

    return getNestedProperty(path, object) !== void 0
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

export const createSet: Function = (isWith: boolean): Function => {
  if (isWith) {
    return function (
      fn: Function,
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

export const createAdd: Function = (isWith: boolean): Function => {
  const add: Function = createSet(isWith);
  const getFullPath: Function = createGetFullPath(isWith);

  if (isWith) {
    return function (
      fn: Function,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      return add(
        fn,
        getFullPath(fn, path, object),
        object,
        ...slice.call(arguments, 3),
      );
    };
  }

  return (
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable => add(getFullPath(path, object), value, object);
};
