// external dependencies
import { parse } from 'pathington';

const O = Object;
const {
  create,
  getOwnPropertySymbols,
  getPrototypeOf,
  keys,
  propertyIsEnumerable,
} = O;
const { toString: toStringObject } = O.prototype;

const { toString: toStringFunction } = Function.prototype;

const GLOBAL: Window | NodeJS.Global =
  typeof window === 'object' ? window : global;

/**
 * @constant {Symbol} REACT_ELEMENT
 */
const REACT_ELEMENT: symbol | number =
  typeof Symbol === 'function' && typeof Symbol.for === 'function'
    ? Symbol.for('react.element')
    : 0xeac7;

/**
 * @constant {RegExp} FUNCTION_NAME
 */
const FUNCTION_NAME: RegExp = /^\s*function\s*([^\(]*)/i;

const { isArray } = Array;

export const isSameValueZero: Function = (value1: any, value2: any): boolean =>
  value1 === value2 || (value1 !== value1 && value2 !== value2);

/**
 * @function cloneArray
 *
 * @description
 * shallowly clone an array
 *
 * @param {Array<any>} array the array to clone
 * @returns {Array<any>} the cloned array
 */
export const cloneArray: Function = (array: any[]): any[] => {
  // @ts-ignore
  const cloned: any[] = new array.constructor();

  for (let index: number = 0; index < array.length; index++) {
    cloned[index] = array[index];
  }

  return cloned;
};

/**
 * @function reduce
 *
 * @description
 * a slimmer, simpler reduce than native (for performance)
 *
 * @param {Array<any>} array the array to reduce
 * @param {function} fn the function to reduce each iteration of the array with
 * @param {any} initialValue the initial value of the reduction
 * @returns {any} the reduced array value
 */
export const reduce: Function = (
  array: any[],
  fn: Function,
  initialValue: any,
): any => {
  let value: any = initialValue;

  for (let index: number = 0; index < array.length; index++) {
    value = fn(value, array[index]);
  }

  return value;
};

/**
 * @function getOwnProperties
 *
 * @description
 * get the own properties of an object, either keys or symbols
 *
 * @param {Object} object the object to get all keys and symbols of
 * @returns {Array<string|symbol>} the own properties of the object
 */
export const getOwnProperties: Function = (
  object: Object,
): (string | symbol)[] => {
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
 * a simple implementation of Object.assign
 *
 * @param {Object} target the target object
 * @param {Object} source the object to merge into target
 * @returns {Object} the shallowly-merged object
 */
export const assignFallback: Function = (
  target: unchanged.Unchangeable,
  source: unchanged.Unchangeable,
): Object => {
  if (!source) {
    return target;
  }

  return reduce(
    getOwnProperties(source),
    (
      clonedObject: unchanged.Unchangeable,
      property: string,
    ): unchanged.Unchangeable => {
      clonedObject[property] = source[property];

      return clonedObject;
    },
    Object(target),
  );
};

const assign: Function =
  typeof O.assign === 'function' ? O.assign : assignFallback;

/**
 * @function isCloneable
 *
 * @description
 * can the object be cloned
 *
 * - the object exists and is an object
 * - the object is not a Date or RegExp
 * - the object is not a React element
 *
 * @param {*} object the object to test
 * @returns {boolean} can the object be merged
 */
export const isCloneable: Function = (object: any): boolean => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  const type = toStringObject.call(object);

  return (
    type !== '[object Date]' &&
    type !== '[object RegExp]' &&
    object.$$typeof !== REACT_ELEMENT
  );
};

/**
 * @function isGlobalConstructor
 *
 * @description
 * is the function passed a global constructor function
 *
 * @param {function} fn the function to test
 * @returns {boolean} is the function a global constructor
 */
export const isGlobalConstructor: Function = (fn: any) =>
  typeof fn === 'function' &&
  // @ts-ignore
  GLOBAL[fn.name || toStringFunction.call(fn).split(FUNCTION_NAME)[1]] === fn;

/**
 * @function callIfFunction
 *
 * @description
 * call the object passed if it is a function and return its return, else return undefined
 *
 * @param {*} object the object to conditionally call if a function
 * @param {*} context the context to apply to the call
 * @param {Array<*>} parameters the parametesr to apply the function with
 * @returns {*} the restulf of the call or undefined
 */
export const callIfFunction: Function = (
  object: any,
  context: any,
  parameters: any[],
): any =>
  typeof object === 'function' ? object.apply(context, parameters) : void 0;

/**
 * @function getShallowClone
 *
 * @description
 * get a shallow clone of the value passed based on the type requested
 * (maintaining prototype if possible)
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} key the key to base the object type fromisReactElement(object) ||
 * @returns {Array<*>|Object} a shallow clone of the value
 */
export const getShallowClone: Function = (object: any): any => {
  if (object.constructor === O) {
    return assign({}, object);
  }

  if (isArray(object)) {
    return cloneArray(object);
  }

  return isGlobalConstructor(object.constructor)
    ? {}
    : assign(create(getPrototypeOf(object)), object);
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
export const getNewEmptyChild: Function = (
  key: number | string,
): unchanged.Unchangeable => (typeof key === 'number' ? [] : {});

/**
 * @function getNewEmptyObject
 *
 * @description
 * get a new empty object for the type of key provided
 *
 * @param {Array|Object} object the object to get an empty value of
 * @returns {Array|Object} the empty object
 */
export const getNewEmptyObject: Function = (
  object: any,
): unchanged.Unchangeable => (isArray(object) ? [] : {});

/**
 * @function cloneIfPossible
 *
 * @description
 * clone the object passed if it is mergeable, else return itself
 *
 * @param {*} object he object to clone
 * @returns {*} the cloned object
 */
export const cloneIfPossible: Function = (object: any): any =>
  isCloneable(object) ? getShallowClone(object) : object;

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
export const getNewChildClone: Function = (
  object: any,
  nextKey: number | string,
) =>
  isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);

/**
 * @function getCoalescedValue
 *
 * @description
 * get the value if it is not undefined, else get the fallback
 *`
 * @param {any} value the main value to return
 * @param {any} fallbackValue the value to return if main is undefined
 * @returns {any} the coalesced value
 */
export const getCoalescedValue = (value: any, fallbackValue: any): any =>
  value === void 0 ? fallbackValue : value;

/**
 * @function onMatchAtPath
 *
 * @description
 * when there is a match for the path requested, call onMatch, else return the noMatchValue
 *
 * @param {Array<number|string>} path the path to find a match at
 * @param {Array<*>|Object} object the object to find the path in
 * @param {function} onMatch when a match is found, call this method
 * @param {boolean} shouldClone should the object be cloned
 * @param {*} noMatchValue when no match is found, return this value
 * @param {number} [index=0] the index of the key to process
 * @returns {*} either the return from onMatch or the noMatchValue
 */
export const onMatchAtPath: Function = (
  path: unchanged.ParsedPath,
  object: unchanged.Unchangeable,
  onMatch: Function,
  shouldClone?: boolean,
  noMatchValue?: any,
  index: number = 0,
): any => {
  const key: unchanged.PathItem = path[index];
  const nextIndex: number = index + 1;

  if (nextIndex === path.length) {
    const result: any =
      object || shouldClone ? onMatch(object, key) : noMatchValue;

    return shouldClone ? object : result;
  }

  if (shouldClone) {
    object[key] = onMatchAtPath(
      path,
      getNewChildClone(object[key], path[nextIndex]),
      onMatch,
      shouldClone,
      noMatchValue,
      nextIndex,
    );

    return object;
  }

  return object && object[key]
    ? onMatchAtPath(
        path,
        object[key],
        onMatch,
        shouldClone,
        noMatchValue,
        nextIndex,
      )
    : noMatchValue;
};

/**
 * @function getMergedObject
 *
 * @description
 * get the objects merged into a new object
 *
 * @param {Array<*>|Object} object1 the object to merge into
 * @param {Array<*>|Object} object2 the object to merge
 * @param {boolean} isDeep is the object deeply merged
 * @returns {Array<*>|Object} the merged object
 */
export const getMergedObject: Function = (
  object1: unchanged.Unchangeable,
  object2: unchanged.Unchangeable,
  isDeep?: boolean,
): unchanged.Unchangeable => {
  const isObject1Array: boolean = isArray(object1);

  if (isObject1Array !== isArray(object2) || !isCloneable(object1)) {
    return cloneIfPossible(object2);
  }

  if (isObject1Array) {
    return object1.concat(object2);
  }

  const target: unchanged.Unchangeable =
    object1.constructor === O || isGlobalConstructor(object1.constructor)
      ? {}
      : create(getPrototypeOf(object1));

  return reduce(
    getOwnProperties(object2),
    (clone: unchanged.Unchangeable, key: string): unchanged.Unchangeable => {
      clone[key] =
        isDeep && isCloneable(object2[key])
          ? getMergedObject(object1[key], object2[key], isDeep)
          : object2[key];

      return clone;
    },
    assign(target, object1),
  );
};

/**
 * @function getParsedPath
 *
 * @description
 * get the path array, either as-is if already an array, or parsed by pathington
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
export const getParsedPath: Function = (
  path: unchanged.Path,
): unchanged.ParsedPath => (isArray(path) ? path : parse(path));

/**
 * @function getNestedProperty
 *
 * @description
 * parse the path passed and get the nested property at that path
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @param {*} noMatchValue an optional fallback value returned when the nested property isn't found
 * @returns {*} the retrieved values
 */
export const getNestedProperty: Function = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  noMatchValue?: any,
): any => {
  const parsedPath: unchanged.ParsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object
      ? getCoalescedValue(object[parsedPath[0]], noMatchValue)
      : noMatchValue;
  }

  return onMatchAtPath(
    parsedPath,
    object,
    (ref: unchanged.Unchangeable, key: unchanged.PathItem): void =>
      getCoalescedValue(ref[key], noMatchValue),
    false,
    noMatchValue,
  );
};

/**
 * @function getDeepClone
 *
 * @description
 * parse the path passed and clone the object at that path
 *
 * @param {Array<number|string>|number|string} path the path to deeply modify the object on
 * @param {Array<*>|Object} object the objeisCurrentKeyArrayct to modify
 * @param {function} onMatch the callback to execute
 * @returns {Array<*>|Object} the clone object
 */
export const getDeepClone: Function = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  onMatch: Function,
): unchanged.Unchangeable => {
  const parsedPath: unchanged.ParsedPath = getParsedPath(path);
  const topLevelClone: unchanged.Unchangeable = isCloneable(object)
    ? getShallowClone(object)
    : getNewEmptyChild(parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]);

    return topLevelClone;
  }

  return onMatchAtPath(parsedPath, topLevelClone, onMatch, true);
};

/**
 * @function isEmptyPath
 *
 * @description
 * is the object passed an empty key value
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object an empty key value
 */
export const isEmptyPath: Function = (object: any): boolean =>
  object == null || (isArray(object) && !object.length);

/**
 * @function splice
 *
 * @description
 * splice a single item from the array
 *
 * @param {Array<*>} array array to splice from
 * @param {number} splicedIndex index to splice at
 */
export const splice: Function = (array: any[], splicedIndex: number): void => {
  if (array.length) {
    const { length } = array;

    let index: number = splicedIndex;

    while (index < length - 1) {
      array[index] = array[index + 1];

      ++index;
    }

    --array.length;
  }
};

export const throwInvalidFnError: Function = (): never => {
  throw new TypeError('handler passed is not of type "function".');
};
