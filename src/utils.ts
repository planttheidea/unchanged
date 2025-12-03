// external dependencies
import type { ParsePath, Path, PathItem } from 'pathington';
import { parse } from 'pathington';
import type {
  AnyPath,
  EmptyPath,
  HasDeep,
  NoMatchFound,
  PickDeepInternal,
  PickDeepOr,
  Unchangeable,
} from './internalTypes.js';

const O = Object;
const { create, getOwnPropertySymbols, getPrototypeOf, keys, propertyIsEnumerable } = O;

const { isArray } = Array;

type ToString = (value: any) => string;

// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringFunction: ToString = Function.prototype.bind.call(Function.prototype.call, Function.prototype.toString);
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringObject: ToString = Function.prototype.bind.call(Function.prototype.call, O.prototype.toString);

const HAS_SYMBOL_SUPPORT = typeof Symbol === 'function' && typeof Symbol.for === 'function';
const NO_MATCH_FOUND = { [Symbol('$$noMatch')]: true } as unknown as NoMatchFound;
const REACT_ELEMENT: symbol | number = HAS_SYMBOL_SUPPORT ? Symbol.for('react.element') : 0xeac7;

/**
 * clone an array to a new array
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
 * a targeted reduce method faster than the native
 */
export const reduce = (array: any[], fn: (accum: any, value: any) => any, initialValue: any): any => {
  let value = initialValue;

  for (let index = 0, length = array.length; index < length; index++) {
    value = fn(value, array[index]);
  }

  return value;
};

/**
 * get the all properties (keys and symbols) of the object passed
 */
export const getOwnProperties = (object: Unchangeable): Array<string | symbol> => {
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
 * a targeted fallback if native Object.assign is unavailable
 */
export const assignFallback = (target: Unchangeable, source: Unchangeable): Unchangeable => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!source) {
    return target;
  }

  return reduce(
    getOwnProperties(source),
    (clonedObject: Unchangeable, property: string) => {
      clonedObject[property] = source[property];

      return clonedObject;
    },
    Object(target),
  );
};

const assign = typeof O.assign === 'function' ? O.assign : assignFallback;

/**
 * create a new object with the prototype of the object passed
 */
export const createWithProto = (object: Unchangeable): Unchangeable =>
  create(object.__proto__ ?? getPrototypeOf(object));

/**
 * is the object passed considered cloneable
 */
export const isCloneable = (object: any) => {
  if (!object || typeof object !== 'object' || object.$$typeof === REACT_ELEMENT) {
    return false;
  }

  const type = toStringObject(object);

  return type !== '[object Date]' && type !== '[object RegExp]';
};

/**
 * is the path passed an empty path
 */
export function isEmptyPath(path: any): path is EmptyPath {
  return path == null || (isArray(path) && !path.length);
}

/**
 * is the fn passed a global constructor
 */
export const isGlobalConstructor = (fn: any) =>
  typeof fn === 'function' && !!~toStringFunction(fn).indexOf('[native code]');

/**
 * if the object passed is a function, call it and return its return, else return undefined
 */
export const callIfFunction = (object: any, context: any, parameters: any[]) =>
  typeof object === 'function' ? (object as (...args: any[]) => any).apply(context, parameters) : void 0;

/**
 * get a new empty child object based on the key passed
 */
export const getNewEmptyChild = (key: any): Unchangeable => (typeof key === 'number' ? [] : {});

/**
 * get a new empty object based on the object passed
 */
export const getNewEmptyObject = (object: Unchangeable): Unchangeable => (isArray(object) ? [] : {});

/**
 * create a shallow clone of the object passed, respecting its prototype
 */
export const getShallowClone = (object: Unchangeable): Unchangeable => {
  if (object.constructor === O) {
    return assign({}, object);
  }

  if (isArray(object)) {
    return cloneArray(object);
  }

  return isGlobalConstructor(object.constructor) ? {} : assign(createWithProto(object), object);
};

/**
 * clone the object if it can be cloned, otherwise return the object itself
 */
export const cloneIfPossible = (object: any) => (isCloneable(object) ? getShallowClone(object) : object);

/**
 * if the object is cloneable, get a clone of the object, else get a new
 * empty child object based on the key
 */
export const getCloneOrEmptyObject = (object: Unchangeable, nextKey: any): Unchangeable =>
  isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);

/**
 * return the value if not undefined, otherwise return the fallback value
 */
export const getCoalescedValue = (value: any, fallbackValue: any) => (value === void 0 ? fallbackValue : value);

/**
 * get a new object, cloned at the path specified while leveraging
 * structural sharing for the rest of the properties
 */
export const getCloneAtPath = (
  path: Path,
  object: Unchangeable,
  onMatch: (object: Unchangeable, key: PathItem) => any,
  index: number,
) => {
  const key = path[index]!;
  const nextIndex = index + 1;

  if (nextIndex === path.length) {
    onMatch(object, key);
  } else {
    object[key] = getCloneAtPath(path, getCloneOrEmptyObject(object[key], path[nextIndex]), onMatch, nextIndex);
  }

  return object;
};

/**
 * get a clone of the object at the path specified
 */
export const getDeepClone = (
  path: Path,
  object: Unchangeable,
  onMatch: (object: Unchangeable, key: PathItem) => any,
): Unchangeable => {
  const parsedPath = parse(path);
  const topLevelClone = getCloneOrEmptyObject(object, parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]!);

    return topLevelClone;
  }

  return getCloneAtPath(parsedPath, topLevelClone, onMatch, 0);
};

/**
 * merge the source into the target, either deeply or shallowly
 */
export const getMergedObject = (target: Unchangeable, source: Unchangeable, isDeep: boolean): Unchangeable => {
  const isObject1Array = isArray(target);

  if (isObject1Array !== isArray(source) || !isCloneable(target)) {
    return cloneIfPossible(source);
  }

  if (isObject1Array) {
    return target.concat(source);
  }

  const targetClone: Unchangeable =
    target.constructor === O || isGlobalConstructor(target.constructor) ? {} : createWithProto(target);

  return reduce(
    getOwnProperties(source),
    (clone: Unchangeable, key: string): Unchangeable => {
      clone[key] = isDeep && isCloneable(source[key]) ? getMergedObject(target[key], source[key], isDeep) : source[key];

      return clone;
    },
    assign(targetClone, target),
  );
};

/**
 * get the value at the nested property, or the fallback provided
 */
export function getValueAtPathInternal<const P extends AnyPath, const V extends Unchangeable>(
  path: P,
  value: V | null | undefined,
): EmptyPath extends P ? V : PickDeepInternal<V, ParsePath<P>> {
  if (value == null) {
    return NO_MATCH_FOUND;
  }

  const parsedPath = parse(path);

  if (isEmptyPath(parsedPath)) {
    return value;
  }

  if (parsedPath.length === 1) {
    const key = parsedPath[0] as PathItem;

    return Object.hasOwn(value, key) ? value[key] : NO_MATCH_FOUND;
  }

  let ref: any = value;
  let key = parsedPath[0] as PathItem;

  for (let index = 0; index < parsedPath.length - 1; index++) {
    // Handle bunk edge cases by bailing out.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (key == null) {
      return NO_MATCH_FOUND;
    }

    if (!ref?.[key]) {
      return NO_MATCH_FOUND;
    }

    ref = ref[key];
    key = parsedPath[index + 1] as PathItem;
  }

  return ref && Object.hasOwn(ref, key) ? ref[key] : undefined;
}

/**
 * get the value at the nested property, or the fallback provided
 */
export function getValueAtPath<const P extends AnyPath, const V extends Unchangeable, const N = undefined>(
  path: P,
  value: V | null | undefined,
  noMatchValue?: N,
): EmptyPath extends P ? V : PickDeepOr<V, ParsePath<P>, N> {
  const result = getValueAtPathInternal(path, value);

  // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
  return result === NO_MATCH_FOUND ? noMatchValue : result;
}

/**
 * get the value at the nested property, or the fallback provided
 */
export function hasFullPath<const P extends AnyPath, const V extends Unchangeable>(
  path: P,
  value: V | null | undefined,
): HasDeep<V, ParsePath<P>> {
  return getValueAtPathInternal(path, value) !== NO_MATCH_FOUND;
}

/**
 * get the path to add to, based on the object and fn passed
 */
export function getFullPath<const P extends Path, const V extends Unchangeable>(path: P, value: V): Path {
  const valueAtPath = getValueAtPath(path, value);

  return isArray(valueAtPath) ? (isArray(path) ? path.concat([valueAtPath.length]) : [valueAtPath.length]) : path;
}

/**
 * a faster, more targeted version of the native splice
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
 * throw the TypeError based on the invalid handler
 */
export const throwInvalidFnError = (): never => {
  throw new TypeError('handler passed is not of type "function".');
};
