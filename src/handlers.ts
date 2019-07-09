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
const slice = Function.prototype.bind.call(Function.prototype.bind, Array.prototype.slice);

/**
 * @function createCall
 *
 * @description
 * create handlers for call / callWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns call / callWith
 */
export function createCall<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.CallWith : unchanged.Call;
export function createCall<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.CallWith | unchanged.Call {
  if (isWithHandler) {
    return function callWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      parameters: any[],
      object: unchanged.Unchangeable | unchanged.Fn,
      context: any = object,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 5);

      if (isEmptyPath(path)) {
        return callIfFunction(fn(object, ...extraArgs), context, parameters);
      }

      const value = getValueAtPath(path, object);

      if (value === void 0) {
        return;
      }

      const result = fn(value, ...extraArgs);

      return callIfFunction(result, context, parameters);
    };
  }

  return function call(
    path: unchanged.Path,
    parameters: any[],
    object: unchanged.Unchangeable | Function,
    context: any = object,
  ) {
    const callable = isEmptyPath(path) ? object : getValueAtPath(path, object);

    return callIfFunction(callable, context, parameters);
  };
}

/**
 * @function createGet
 *
 * @description
 * create handlers for get / getWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns get / getWith
 */
export function createGet<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.GetWith : unchanged.Get;
export function createGet<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.GetWith | unchanged.Get {
  if (isWithHandler) {
    return function getWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value = getValueAtPath(path, object);

      return value === void 0 ? value : fn(value, ...extraArgs);
    };
  }

  return function get(path: unchanged.Path, object: unchanged.Unchangeable) {
    return isEmptyPath(path) ? object : getValueAtPath(path, object);
  };
}

/**
 * @function createGetOr
 *
 * @description
 * create handlers for getOr / getWithOr
 *
 * @param isWithHandler is the method using a with handler
 * @returns getOr / getWithOr
 */
export function createGetOr<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.GetWithOr : unchanged.GetOr;
export function createGetOr<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.GetWithOr | unchanged.GetOr {
  if (isWithHandler) {
    return function getWithOr(
      fn: unchanged.WithHandler,
      noMatchValue: any,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 4);

      if (isEmptyPath(path)) {
        return fn(object, ...extraArgs);
      }

      const value = getValueAtPath(path, object);

      return value === void 0 ? noMatchValue : fn(value, ...extraArgs);
    };
  }

  return function getOr(noMatchValue: any, path: unchanged.Path, object: unchanged.Unchangeable) {
    return isEmptyPath(path) ? object : getValueAtPath(path, object, noMatchValue);
  };
}

/**
 * @function createHas
 *
 * @description
 * create handlers for has / hasWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns has / hasWith
 */
export function createHas<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.HasWith : unchanged.Has;
export function createHas<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.HasWith | unchanged.Has {
  if (isWithHandler) {
    return function hasWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 3);

      if (isEmptyPath(path)) {
        return !!fn(object, ...extraArgs);
      }

      const value: any = getValueAtPath(path, object);

      return value !== void 0 && !!fn(value, ...extraArgs);
    };
  }

  return function has(path: unchanged.Path, object: unchanged.Unchangeable) {
    return isEmptyPath(path) ? object != null : getValueAtPath(path, object) !== void 0;
  };
}

/**
 * @function createIs
 *
 * @description
 * create handlers for is / isWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns is / isWith
 */
export function createIs<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.IsWith : unchanged.Is;
export function createIs<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.IsWith | unchanged.Is {
  if (isWithHandler) {
    return function isWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      value: any,
      object: unchanged.Unchangeable,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 4);

      if (isEmptyPath(path)) {
        return isSameValueZero(fn(object, ...extraArgs), value);
      }

      return isSameValueZero(fn(getValueAtPath(path, object), ...extraArgs), value);
    };
  }

  return function is(path: unchanged.Path, value: any, object: unchanged.Unchangeable) {
    const _path = isEmptyPath(path) ? object : getValueAtPath(path, object);

    return isSameValueZero(_path, value);
  };
}

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
export function createMerge<IsWith extends true | false>(
  isWithHandler: IsWith,
  isDeep: boolean,
): IsWith extends true ? unchanged.MergeWith : unchanged.Merge;
export function createMerge<IsWith extends true | false>(
  isWithHandler: IsWith,
  isDeep: boolean,
): unchanged.MergeWith | unchanged.Merge {
  if (isWithHandler) {
    return function mergeWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 3);

      if (!isCloneable(object)) {
        return fn(object, ...extraArgs);
      }

      if (isEmptyPath(path)) {
        const objectToMerge: any = fn(object, ...extraArgs);

        return objectToMerge ? getMergedObject(object, objectToMerge, isDeep) : object;
      }

      let hasChanged: boolean = false;

      const result: unchanged.Unchangeable = getDeepClone(
        path,
        object,
        (ref: unchanged.Unchangeable, key: unchanged.PathItem): void => {
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

  return function merge(
    path: unchanged.Path,
    objectToMerge: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable {
    if (!isCloneable(object)) {
      return objectToMerge;
    }

    return isEmptyPath(path)
      ? getMergedObject(object, objectToMerge, true)
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: unchanged.PathItem): void => {
            ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
          },
        );
  };
}

/**
 * @function createNot
 *
 * @description
 * create handlers for not / notWith
 *
 * @param isWithHandler not the method using a with handler
 * @returns not / notWithHandler
 */
export function createNot<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.NotWith : unchanged.Not;
export function createNot<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.NotWith | unchanged.Not {
  const is: Function = createIs(isWithHandler);

  return function not(this: any) {
    return !is.apply(this, arguments);
  };
}

/**
 * @function createRemove
 *
 * @description
 * create handlers for remove / removeWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns remove / removeWith
 */
export function createRemove<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.RemoveWith : unchanged.Remove;
export function createRemove<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.RemoveWith | unchanged.Remove {
  if (isWithHandler) {
    return function removeWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 3);

      if (isEmptyPath(path)) {
        const emptyObject: unchanged.Unchangeable = getNewEmptyObject(object);

        return fn(emptyObject, ...extraArgs) ? emptyObject : object;
      }

      const value: any = getValueAtPath(path, object);

      return value !== void 0 && fn(value, ...extraArgs)
        ? getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: number | string): void => {
              if (isArray(ref)) {
                splice(ref, key as number);
              } else {
                delete ref[key];
              }
            },
          )
        : object;
    };
  }

  return function remove(
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable {
    if (isEmptyPath(path)) {
      return getNewEmptyObject(object);
    }

    return getValueAtPath(path, object) !== void 0
      ? getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: number | string): void => {
            if (isArray(ref)) {
              splice(ref, key as number);
            } else {
              delete ref[key];
            }
          },
        )
      : object;
  };
}

/**
 * @function createSet
 *
 * @description
 * create handlers for set / setWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns set / setWith
 */
export function createSet<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.SetWith : unchanged.Set;
export function createSet<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.SetWith | unchanged.Set {
  if (isWithHandler) {
    return function setWith(
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      const extraArgs: any[] = slice(arguments, 3);

      return isEmptyPath(path)
        ? fn(object, ...extraArgs)
        : getDeepClone(
            path,
            object,
            (ref: unchanged.Unchangeable, key: unchanged.PathItem): void => {
              ref[key] = fn(ref[key], ...extraArgs);
            },
          );
    };
  }

  return function set(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable {
    return isEmptyPath(path)
      ? value
      : getDeepClone(
          path,
          object,
          (ref: unchanged.Unchangeable, key: unchanged.PathItem): void => {
            ref[key] = value;
          },
        );
  };
}

/**
 * @function createAdd
 *
 * @description
 * create handlers for add / addWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns add / addWith
 */
export function createAdd<IsWith extends true | false>(
  isWithHandler: IsWith,
): IsWith extends true ? unchanged.AddWith : unchanged.Add;
export function createAdd<IsWith extends true | false>(
  isWithHandler: IsWith,
): unchanged.AddWith | unchanged.Add {
  const _add: Function = createSet(isWithHandler);

  if (isWithHandler) {
    return function addWith(
      this: any,
      fn: unchanged.WithHandler,
      path: unchanged.Path,
      object: unchanged.Unchangeable,
    ): unchanged.Unchangeable {
      return _add.apply(
        this,
        [fn, getFullPath(path, object, fn), object].concat(slice(arguments, 3)),
      );
    };
  }

  return function add(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable {
    return _add(getFullPath(path, object), value, object);
  };
}
