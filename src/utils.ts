// external dependencies
import { parse } from 'pathington';

const O = Object;
const { create, getOwnPropertySymbols, getPrototypeOf, keys, propertyIsEnumerable } = O;

const { isArray } = Array;

type ToString = (value: any) => string;

const toStringFunction: ToString = Function.prototype.bind.call(
  Function.prototype.call,
  Function.prototype.toString,
);
const toStringObject: ToString = Function.prototype.bind.call(
  Function.prototype.call,
  O.prototype.toString,
);

/**
 * @constant HAS_SYMBOL_SUPPORT are Symbols supported
 */
const HAS_SYMBOL_SUPPORT = typeof Symbol === 'function' && typeof Symbol.for === 'function';

/**
 * @constant REACT_ELEMENT the symbol / number specific to react elements
 */
const REACT_ELEMENT: symbol | number = HAS_SYMBOL_SUPPORT ? Symbol.for('react.element') : 0xeac7;

/**
 * @function cloneArray
 *
 * @description
 * clone an array to a new array
 *
 * @param array the array to clone
 * @returns the cloned array
 */
export const cloneArray = (array: any[]): any[] => {
  const Constructor = array.constructor as ArrayConstructor;
  const cloned = Constructor === Array ? [] : new Constructor();

  for (let index = 0, length = array.length; index < length; index++) {
    cloned[index] = array[index];
  }

  return cloned;
};

/**
 * @function reduce
 *
 * @description
 * a targeted reduce method faster than the native
 *
 * @param array the array to reduce
 * @param fn the method to reduce each array value with
 * @param initialValue the initial value of the reduction
 * @returns the reduced value
 */
export const reduce = (
  array: any[],
  fn: (accum: any, value: any) => any,
  initialValue: any,
): any => {
  let value = initialValue;

  for (let index = 0, length = array.length; index < length; index++) {
    value = fn(value, array[index]);
  }

  return value;
};

/**
 * @function getOwnProperties
 *
 * @description
 * get the all properties (keys and symbols) of the object passed
 *
 * @param object the object to get the properties of
 * @returns the keys and symbols the object has
 */
export const getOwnProperties = (object: unchanged.Unchangeable): (string | symbol)[] => {
  if (!HAS_SYMBOL_SUPPORT) {
    return keys(object);
  }

  const ownSymbols: symbol[] = getOwnPropertySymbols(object);

  if (!ownSymbols.length) {
    return keys(object);
  }

  return keys(object).concat(
    reduce(
      ownSymbols,
      (enumerableSymbols: symbol[], symbol: symbol): symbol[] => {
        if (propertyIsEnumerable.call(object, symbol)) {
          enumerableSymbols.push(symbol);
        }

        return enumerableSymbols;
      },
      [],
    ),
  );
};

/**
 * @function assignFallback
 *
 * @description
 * a targeted fallback if native Object.assign is unavailable
 *
 * @param target the object to shallowly merge into
 * @param source the object to shallowly merge into target
 * @returns the shallowly merged object
 */
export const assignFallback = (
  target: unchanged.Unchangeable,
  source: unchanged.Unchangeable,
): unchanged.Unchangeable => {
  if (!source) {
    return target;
  }

  return reduce(
    getOwnProperties(source),
    (clonedObject: unchanged.Unchangeable, property: string) => {
      clonedObject[property] = source[property];

      return clonedObject;
    },
    Object(target),
  );
};

const assign = typeof O.assign === 'function' ? O.assign : assignFallback;

/**
 * @function createWithProto
 *
 * @description
 * create a new object with the prototype of the object passed
 *
 * @param object object whose prototype will be the new object's prototype
 * @returns object with the prototype of the one passed
 */
export const createWithProto = (object: unchanged.Unchangeable): unchanged.Unchangeable =>
  create(object.__proto__ || getPrototypeOf(object));

/**
 * @function isCloneable
 *
 * @description
 * is the object passed considered cloneable
 *
 * @param object the object that is being checked for cloneability
 * @returns whether the object can be cloned
 */
export const isCloneable = (object: any) => {
  if (!object || typeof object !== 'object' || object.$$typeof === REACT_ELEMENT) {
    return false;
  }

  const type = toStringObject(object);

  return type !== '[object Date]' && type !== '[object RegExp]';
};

/**
 * @function isEmptyPath
 *
 * @description
 * is the path passed an empty path
 *
 * @param path the path to check for emptiness
 * @returns whether the path passed is considered empty
 */
export const isEmptyPath = (path: any) => path == null || (isArray(path) && !path.length);

/**
 * @function isGlobalConstructor
 *
 * @description
 * is the fn passed a global constructor
 *
 * @param fn the fn to check if a global constructor
 * @returns whether the fn passed is a global constructor
 */
export const isGlobalConstructor = (fn: any) =>
  typeof fn === 'function' && !!~toStringFunction(fn).indexOf('[native code]');

/**
 * @function callIfFunction
 *
 * @description
 * if the object passed is a function, call it and return its return, else return undefined
 *
 * @param object the object to call if a function
 * @param context the context to call the function with
 * @param parameters the parameters to call the function with
 * @returns the result of the function call, or undefined
 */
export const callIfFunction = (object: any, context: any, parameters: any[]) =>
  typeof object === 'function' ? object.apply(context, parameters) : void 0;

/**
 * @function getNewEmptyChild
 *
 * @description
 * get a new empty child object based on the key passed
 *
 * @param key the key to base the empty child on
 * @returns the empty object the child is built from
 */
export const getNewEmptyChild = (key: any): unchanged.Unchangeable =>
  typeof key === 'number' ? [] : {};

/**
 * @function getNewEmptyObject
 *
 * @description
 * get a new empty object based on the object passed
 *
 * @param object the object to base the empty object on
 * @returns an empty version of the object passed
 */
export const getNewEmptyObject = (object: unchanged.Unchangeable): unchanged.Unchangeable =>
  isArray(object) ? [] : {};

/**
 * @function getShallowClone
 *
 * @description
 * create a shallow clone of the object passed, respecting its prototype
 *
 * @param object the object to clone
 * @returns a shallow clone of the object passed
 */
export const getShallowClone = (object: unchanged.Unchangeable): unchanged.Unchangeable => {
  if (object.constructor === O) {
    return assign({}, object);
  }

  if (isArray(object)) {
    return cloneArray(object);
  }

  return isGlobalConstructor(object.constructor) ? {} : assign(createWithProto(object), object);
};

/**
 * @function isSameValueZero
 *
 * @description
 * are the values equal based on SameValueZero
 *
 * @param value1 the first value to test
 * @param value2 the second value to test
 * @returns are the two values passed equal based on SameValueZero
 */
export const isSameValueZero = (value1: any, value2: any) =>
  value1 === value2 || (value1 !== value1 && value2 !== value2);

/**
 * @function cloneIfPossible
 *
 * @description
 * clone the object if it can be cloned, otherwise return the object itself
 *
 * @param object the object to clone
 * @returns a cloned version of the object, or the object itself if not cloneable
 */
export const cloneIfPossible = (object: any) =>
  isCloneable(object) ? getShallowClone(object) : object;

/**
 * @function getCloneOrEmptyObject
 *
 * @description
 * if the object is cloneable, get a clone of the object, else get a new
 * empty child object based on the key
 *
 * @param object the object to clone
 * @param nextKey the key to base the empty child object on
 * @returns a clone of the object, or an empty child object
 */
export const getCloneOrEmptyObject = (
  object: unchanged.Unchangeable,
  nextKey: any,
): unchanged.Unchangeable =>
  isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);

/**
 * @function getCoalescedValue
 *
 * @description
 * return the value if not undefined, otherwise return the fallback value
 *
 * @param value the value to coalesce if undefined
 * @param fallbackValue the value to coalesce to
 * @returns the coalesced value
 */
export const getCoalescedValue = (value: any, fallbackValue: any) =>
  value === void 0 ? fallbackValue : value;

/**
 * @function getParsedPath
 *
 * @description
 * parse the path passed into an array path
 *
 * @param path the path to parse
 * @returns the parsed path
 */
export const getParsedPath = (path: unchanged.Path): unchanged.ParsedPath =>
  isArray(path) ? path : parse(path);

/**
 * @function getCloneAtPath
 *
 * @description
 * get a new object, cloned at the path specified while leveraging
 * structural sharing for the rest of the properties
 *
 * @param path the path to clone at
 * @param object the object with cloned children at path
 * @param onMatch the method to call once the end of the path is reached
 * @param index the path index
 * @returns the object deeply cloned at the path specified
 */
export const getCloneAtPath = (
  path: unchanged.ParsedPath,
  object: unchanged.Unchangeable,
  onMatch: (object: unchanged.Unchangeable, key: unchanged.PathItem) => any,
  index: number,
) => {
  const key = path[index];
  const nextIndex = index + 1;

  if (nextIndex === path.length) {
    onMatch(object, key);
  } else {
    object[key] = getCloneAtPath(
      path,
      getCloneOrEmptyObject(object[key], path[nextIndex]),
      onMatch,
      nextIndex,
    );
  }

  return object;
};

/**
 * @function getDeepClone
 *
 * @description
 * get a clone of the object at the path specified
 *
 * @param path the path to clone at
 * @param object the object to clone at the path
 * @param onMatch once a patch match is found, the callback to fire
 * @returns the clone of the object at path specified
 */
export const getDeepClone = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  onMatch: (object: unchanged.Unchangeable, key: unchanged.PathItem) => any,
): unchanged.Unchangeable => {
  const parsedPath = getParsedPath(path);
  const topLevelClone = getCloneOrEmptyObject(object, parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]);

    return topLevelClone;
  }

  return getCloneAtPath(parsedPath, topLevelClone, onMatch, 0);
};

/**
 * @function getMergedObject
 *
 * @description
 * merge the source into the target, either deeply or shallowly
 *
 * @param target the object to merge into
 * @param source the object being merged into the target
 * @param isDeep is the merge a deep merge
 * @returns the merged object
 */
export const getMergedObject = (
  target: unchanged.Unchangeable,
  source: unchanged.Unchangeable,
  isDeep: boolean,
): unchanged.Unchangeable => {
  const isObject1Array: boolean = isArray(target);

  if (isObject1Array !== isArray(source) || !isCloneable(target)) {
    return cloneIfPossible(source);
  }

  if (isObject1Array) {
    return target.concat(source);
  }

  const targetClone: unchanged.Unchangeable =
    target.constructor === O || isGlobalConstructor(target.constructor)
      ? {}
      : createWithProto(target);

  return reduce(
    getOwnProperties(source),
    (clone: unchanged.Unchangeable, key: string): unchanged.Unchangeable => {
      clone[key] =
        isDeep && isCloneable(source[key])
          ? getMergedObject(target[key], source[key], isDeep)
          : source[key];

      return clone;
    },
    assign(targetClone, target),
  );
};

/**
 * @function getValueAtPath
 *
 * @description
 * get the value at the nested property, or the fallback provided
 *
 * @param path the path to get the value from
 * @param object the object to get the value from at path
 * @param noMatchValue the value returned if no match is found
 * @returns the matching value, or the fallback provided
 */
export const getValueAtPath = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  noMatchValue?: any,
) => {
  const parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? getCoalescedValue(object[parsedPath[0]], noMatchValue) : noMatchValue;
  }

  let ref: any = object;
  let key: number | string = parsedPath[0];

  for (let index: number = 0; index < parsedPath.length - 1; index++) {
    if (!ref || !ref[key]) {
      return noMatchValue;
    }

    ref = ref[key];
    key = parsedPath[index + 1];
  }

  return ref ? getCoalescedValue(ref[key], noMatchValue) : noMatchValue;
};

/**
 * @function getFullPath
 *
 * @description
 * get the path to add to, based on the object and fn passed
 *
 * @param path the path to add to
 * @param object the object traversed by the path
 * @param fn the function to transform the retrieved value with
 * @returns the full path to add to
 */
export const getFullPath = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  fn?: (value: any) => any,
): unchanged.Path => {
  const isPathEmpty: boolean = isEmptyPath(path);
  const valueAtPath: any = isPathEmpty
    ? object
    : fn
    ? fn(getValueAtPath(path, object))
    : getValueAtPath(path, object);

  return isArray(valueAtPath)
    ? isArray(path)
      ? path.concat([valueAtPath.length])
      : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
    : path;
};

/**
 * @function splice
 *
 * @description
 * a faster, more targeted version of the native splice
 *
 * @param array the array to remove the value from
 * @param splicedIndex the index of the value to remove
 */
export const splice = (array: any[], splicedIndex: number): void => {
  if (array.length) {
    const cutoff = array.length - 1;

    let index = splicedIndex;

    while (index < cutoff) {
      array[index] = array[index + 1];

      ++index;
    }

    array.length = cutoff;
  }
};

/**
 * @function throwInvalidFnError
 *
 * @description
 * throw the TypeError based on the invalid handler
 *
 * @throws
 */
export const throwInvalidFnError = (): never => {
  throw new TypeError('handler passed is not of type "function".');
};
