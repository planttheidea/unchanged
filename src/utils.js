// external dependencies
import {parse} from 'pathington';

const O = Object;
const {create, getOwnPropertySymbols, getPrototypeOf, keys, propertyIsEnumerable} = O;
const {toString: toStringObject} = O.prototype;

const {toString: toStringFunction} = Function.prototype;

/**
 * @constant {Symbol} REACT_ELEMENT
 */
const REACT_ELEMENT =
  typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('react.element') : 0xeac7;

/**
 * @constant {RegExp} FUNCTION_NAME
 */
const FUNCTION_NAME = /^\s*function\s*([^\(]*)/i;

/**
 * @function isArray
 */
export const {isArray} = Array;

export const isSameValueZero = (value1, value2) => value1 === value2 || (value1 !== value1 && value2 !== value2);

/**
 * @function cloneArray
 *
 * @description
 * shallowly clone an array
 *
 * @param {Array<any>} array the array to clone
 * @returns {Array<any>} the cloned array
 */
export const cloneArray = (array) => {
  const cloned = new array.constructor();

  for (let index = 0; index < array.length; index++) {
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
export const reduce = (array, fn, initialValue) => {
  let value = initialValue;

  for (let index = 0; index < array.length; index++) {
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
export const getOwnProperties = (object) => {
  const ownSymbols = getOwnPropertySymbols(object);

  if (!ownSymbols.length) {
    return keys(object);
  }

  return keys(object).concat(
    reduce(
      ownSymbols,
      (enumerableSymbols, symbol) => {
        if (propertyIsEnumerable.call(object, symbol)) {
          enumerableSymbols.push(symbol);
        }

        return enumerableSymbols;
      },
      []
    )
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
export const assignFallback = (target, source) => {
  if (!source) {
    return target;
  }

  return reduce(
    getOwnProperties(source),
    (clonedObject, property) => {
      clonedObject[property] = source[property];

      return clonedObject;
    },
    Object(target)
  );
};

const assign = typeof O.assign === 'function' ? O.assign : assignFallback;

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
export const isCloneable = (object) => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  const type = toStringObject.call(object);

  return type !== '[object Date]' && type !== '[object RegExp]' && object.$$typeof !== REACT_ELEMENT;
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
export const isGlobalConstructor = (fn) =>
  typeof fn === 'function' && global[fn.name || toStringFunction.call(fn).split(FUNCTION_NAME)[1]] === fn;

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
export const callIfFunction = (object, context, parameters) =>
  typeof object === 'function' ? object.apply(context, parameters) : void 0;

/**
 * @function getShallowClone
 *
 * @description
 * get a shallow clone of the value passed based on the type requested (maintaining prototype if possible)
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} key the key to base the object type fromisReactElement(object) ||
 * @returns {Array<*>|Object} a shallow clone of the value
 */
export const getShallowClone = (object) => {
  if (object.constructor === O) {
    return assign({}, object);
  }

  if (isArray(object)) {
    return cloneArray(object);
  }

  return isGlobalConstructor(object.constructor) ? {} : assign(create(getPrototypeOf(object)), object);
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
export const getNewEmptyChild = (key) => (typeof key === 'number' ? [] : {});

/**
 * @function getNewEmptyObject
 *
 * @description
 * get a new empty object for the type of key provided
 *
 * @param {Array|Object} object the object to get an empty value of
 * @returns {Array|Object} the empty object
 */
export const getNewEmptyObject = (object) => (isArray(object) ? [] : {});

/**
 * @function cloneIfPossible
 *
 * @description
 * clone the object passed if it is mergeable, else return itself
 *
 * @param {*} object he object to clone
 * @returns {*} the cloned object
 */
export const cloneIfPossible = (object) => (isCloneable(object) ? getShallowClone(object) : object);

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
export const getNewChildClone = (object, nextKey) =>
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
export const getCoalescedValue = (value, fallbackValue) => (value === void 0 ? fallbackValue : value);

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
export const onMatchAtPath = (path, object, onMatch, shouldClone, noMatchValue, index = 0) => {
  const key = path[index];
  const nextIndex = index + 1;

  if (nextIndex === path.length) {
    const result = object || shouldClone ? onMatch(object, key) : noMatchValue;

    return shouldClone ? object : result;
  }

  if (shouldClone) {
    object[key] = onMatchAtPath(
      path,
      getNewChildClone(object[key], path[nextIndex]),
      onMatch,
      shouldClone,
      noMatchValue,
      nextIndex
    );

    return object;
  }

  return object && object[key]
    ? onMatchAtPath(path, object[key], onMatch, shouldClone, noMatchValue, nextIndex)
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
export const getMergedObject = (object1, object2, isDeep) => {
  const isObject1Array = isArray(object1);

  if (isObject1Array !== isArray(object2) || !isCloneable(object1)) {
    return cloneIfPossible(object2);
  }

  if (isObject1Array) {
    return object1.concat(object2);
  }

  const target =
    object1.constructor === O || isGlobalConstructor(object1.constructor) ? {} : create(getPrototypeOf(object1));

  return reduce(
    getOwnProperties(object2),
    (clone, key) => {
      clone[key] =
        isDeep && isCloneable(object2[key]) ? getMergedObject(object1[key], object2[key], isDeep) : object2[key];

      return clone;
    },
    assign(target, object1)
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
export const getParsedPath = (path) => (isArray(path) ? path : parse(path));

/**
 * @function getNestedProperty
 *
 * @description
 * parse the path passed and get the nested property at that path
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @param {*} noMatchValue an optional fallback value to be returned when the nested property isn't found
 * @returns {*} the retrieved values
 */
export const getNestedProperty = (path, object, noMatchValue) => {
  const parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? getCoalescedValue(object[parsedPath[0]], noMatchValue) : noMatchValue;
  }

  return onMatchAtPath(
    parsedPath,
    object,
    (ref, key) => getCoalescedValue(ref[key], noMatchValue),
    false,
    noMatchValue
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
export const getDeepClone = (path, object, onMatch) => {
  const parsedPath = getParsedPath(path);
  const topLevelClone = isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]);

    return topLevelClone;
  }

  return onMatchAtPath(parsedPath, topLevelClone, onMatch, true);
};

/* eslint-disable eqeqeq */
/**
 * @function isEmptyPath
 *
 * @description
 * is the object passed an empty key value
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object an empty key value
 */
export const isEmptyPath = (object) => object == null || (isArray(object) && !object.length);
/* eslint-enable */

/**
 * @function splice
 *
 * @description
 * splice a single item from the array
 *
 * @param {Array<*>} array array to splice from
 * @param {number} splicedIndex index to splice at
 */
export const splice = (array, splicedIndex) => {
  if (array.length) {
    const {length} = array;

    let index = splicedIndex;

    while (index < length - 1) {
      array[index] = array[index + 1];

      ++index;
    }

    --array.length;
  }
};

export const throwInvalidFnError = () => {
  throw new TypeError('handler passed is not of type "function".');
};
