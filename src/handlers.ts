import type { Path, PathItem } from 'pathington';
import type { Unchangeable } from './internalTypes.js';
import {
  callIfFunction,
  getDeepClone,
  getFullPath,
  getMergedObject,
  getValueAtPath,
  getNewEmptyObject,
  isCloneable,
  isEmptyPath,
  splice,
  throwInvalidFnError,
} from './utils.js';

type Handler<Value, ExtraArgs extends unknown[], Result> = (value: Value, ...extraArgs: ExtraArgs) => Result;

const slice = Array.prototype.slice;

/**
 * @function createAdd
 *
 * @description
 * create handlers for add / addWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns add / addWith
 */
export function createAdd<IsWith extends true | false>(isWithHandler: IsWith): IsWith extends true ? AddWith : Add;
export function createAdd<IsWith extends true | false>(isWithHandler: IsWith): AddWith | Add {
  const _add: Function = createSet(isWithHandler);

  if (isWithHandler) {
    return function addWith(this: any, fn: Handler, path: Path, object: Unchangeable): Unchangeable {
      return _add.apply(this, [fn, getFullPath(path, object, fn), object].concat(slice.call(arguments, 3)));
    };
  }

  return function add(path: Path, value: any, object: Unchangeable): Unchangeable {
    return _add(getFullPath(path, object), value, object);
  };
}

/**
 * @function createCall
 *
 * @description
 * create handlers for call / callWith
 *
 * @param isWithHandler is the method using a with handler
 * @returns call / callWith
 */
export function createCall<IsWith extends true | false>(isWithHandler: IsWith): IsWith extends true ? CallWith : Call;
export function createCall<IsWith extends true | false>(isWithHandler: IsWith): CallWith | Call {
  if (isWithHandler) {
    return function callWith<Value extends Unchangeable, ExtraArgs extends unknown[], Result>(
      fn: Handler<Value, ExtraArgs, Result>,
      path: Path,
      parameters: any[],
      object: Value | Handler<Value, ExtraArgs, Result>,
      context: any = object,
    ) {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      // eslint-disable-next-line prefer-rest-params
      const extraArgs = slice.call(arguments, 5) as ExtraArgs;

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

  return function call(path: Path, parameters: any[], object: Unchangeable | Function, context: any = object) {
    const callable = getValueAtPath(path, object);

    return callIfFunction(callable, context, parameters);
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
): IsWith extends true ? MergeWith : Merge;
export function createMerge<IsWith extends true | false>(isWithHandler: IsWith, isDeep: boolean): MergeWith | Merge {
  if (isWithHandler) {
    return function mergeWith(fn: Handler, path: Path, object: Unchangeable): Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      // eslint-disable-next-line prefer-rest-params
      const extraArgs: any[] = slice.call(arguments, 3);

      if (!isCloneable(object)) {
        return fn(object, ...extraArgs);
      }

      if (isEmptyPath(path)) {
        const objectToMerge: any = fn(object, ...extraArgs);

        return objectToMerge ? getMergedObject(object, objectToMerge, isDeep) : object;
      }

      let hasChanged = false;

      const result: Unchangeable = getDeepClone(path, object, (ref: Unchangeable, key: PathItem): void => {
        const objectToMerge: any = fn(ref[key], ...extraArgs);

        if (objectToMerge) {
          ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);

          hasChanged = true;
        }
      });

      return hasChanged ? result : object;
    };
  }

  return function merge(path: Path, objectToMerge: Unchangeable, object: Unchangeable): Unchangeable {
    if (!isCloneable(object)) {
      return objectToMerge;
    }

    return isEmptyPath(path)
      ? getMergedObject(object, objectToMerge, true)
      : getDeepClone(path, object, (ref: Unchangeable, key: PathItem): void => {
          ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
        });
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
export function createNot<IsWith extends true | false>(isWithHandler: IsWith): IsWith extends true ? NotWith : Not;
export function createNot<IsWith extends true | false>(isWithHandler: IsWith): NotWith | Not {
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
): IsWith extends true ? RemoveWith : Remove;
export function createRemove<IsWith extends true | false>(isWithHandler: IsWith): RemoveWith | Remove {
  if (isWithHandler) {
    return function removeWith(fn: Handler, path: Path, object: Unchangeable): Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      // eslint-disable-next-line prefer-rest-params
      const extraArgs: any[] = slice.call(arguments, 3);

      if (isEmptyPath(path)) {
        const emptyObject: Unchangeable = getNewEmptyObject(object);

        return fn(emptyObject, ...extraArgs) ? emptyObject : object;
      }

      const value: any = getValueAtPath(path, object);

      return value !== void 0 && fn(value, ...extraArgs)
        ? getDeepClone(path, object, (ref: Unchangeable, key: number | string): void => {
            if (isArray(ref)) {
              splice(ref, key as number);
            } else {
              delete ref[key];
            }
          })
        : object;
    };
  }

  return function remove(path: Path, object: Unchangeable): Unchangeable {
    if (isEmptyPath(path)) {
      return getNewEmptyObject(object);
    }

    return getValueAtPath(path, object) !== void 0
      ? getDeepClone(path, object, (ref: Unchangeable, key: number | string): void => {
          if (isArray(ref)) {
            splice(ref, key as number);
          } else {
            delete ref[key];
          }
        })
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
export function createSet<IsWith extends true | false>(isWithHandler: IsWith): IsWith extends true ? SetWith : Set;
export function createSet<IsWith extends true | false>(isWithHandler: IsWith): SetWith | Set {
  if (isWithHandler) {
    return function setWith(fn: Handler, path: Path, object: Unchangeable): Unchangeable {
      if (typeof fn !== 'function') {
        throwInvalidFnError();
      }

      // eslint-disable-next-line prefer-rest-params
      const extraArgs: any[] = slice.call(arguments, 3);

      return isEmptyPath(path)
        ? fn(object, ...extraArgs)
        : getDeepClone(path, object, (ref: Unchangeable, key: PathItem): void => {
            ref[key] = fn(ref[key], ...extraArgs);
          });
    };
  }

  return function set(path: Path, value: any, object: Unchangeable): Unchangeable {
    return isEmptyPath(path)
      ? value
      : getDeepClone(path, object, (ref: Unchangeable, key: PathItem): void => {
          ref[key] = value;
        });
  };
}
