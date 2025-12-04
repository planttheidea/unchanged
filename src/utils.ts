// external dependencies
import type { ParsePath, Path, PathItem } from 'pathington';
import { parse } from 'pathington';
import type {
  AnyPath,
  EmptyPath,
  HasDeep,
  NoMatch,
  PickDeep,
  PickDeepInternal,
  PickDeepOr,
  Unchangeable,
} from './internalTypes.js';

type TODO_FIX_YOUR_TYPES = any;

// eslint-disable-next-line @typescript-eslint/unbound-method
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringFunction = Function.prototype.toString;
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringObject = Object.prototype.toString;

const HAS_SYMBOL_SUPPORT = typeof Symbol === 'function' && typeof Symbol.for === 'function';
const NO_MATCH_FOUND: NoMatch = { $$noMatch: true };
const REACT_ELEMENT: symbol | number = HAS_SYMBOL_SUPPORT ? Symbol.for('react.element') : 0xeac7;

/**
 * Clone an array into a new array, keeping the original prototype if not the global array.
 */
export function cloneArray<const V extends any[]>(array: V): V {
  const clone = Array.from(array) as V;

  if (array.constructor !== Array) {
    Object.setPrototypeOf(clone, Object.getPrototypeOf(array));
  }

  return clone;
}

function clonePrototype<const V>(original: V, clone: V): V {
  Object.setPrototypeOf(clone, Object.getPrototypeOf(original));

  return clone;
}

/**
 * get the all properties (keys and symbols) of the object passed
 */
export const getOwnProperties = (object: Unchangeable): Array<string | symbol> => {
  const properties: Array<string | symbol> = Object.keys(object);

  if (!HAS_SYMBOL_SUPPORT) {
    return properties;
  }

  const ownSymbols: symbol[] = Object.getOwnPropertySymbols(object);

  if (!ownSymbols.length) {
    return properties;
  }

  return properties.concat(
    ownSymbols.reduce((enumerableSymbols: symbol[], symbol: symbol): symbol[] => {
      if (propertyIsEnumerable.call(object, symbol)) {
        enumerableSymbols.push(symbol);
      }

      return enumerableSymbols;
    }, []),
  );
};

/**
 * is the object passed considered cloneable
 */
export function isCloneable(object: any): boolean {
  if (!object || typeof object !== 'object' || object.$$typeof === REACT_ELEMENT) {
    return false;
  }

  const type = toStringObject.call(object);

  return type !== '[object Date]' && type !== '[object RegExp]';
}

/**
 * is the path passed an empty path
 */
export function isEmptyPath(path: any): path is EmptyPath {
  return path == null || (Array.isArray(path) && !path.length);
}

/**
 * is the fn passed a global constructor
 */
export const isGlobalConstructor = (fn: any) =>
  typeof fn === 'function' && !!~toStringFunction.call(fn).indexOf('[native code]');

/**
 * if the object passed is a function, call it and return its return, else return undefined
 */
export const callIfFunction = (object: any, context: any, parameters: any[]) =>
  typeof object === 'function' ? (object as (...args: any[]) => any).apply(context, parameters) : void 0;

/**
 * get a new empty child object based on the key passed
 */
export function getNewEmptyChild<V>(key: PathItem): V {
  return (typeof key === 'number' ? [] : {}) as V;
}

/**
 * get a new empty object based on the object passed
 */
export const getNewEmptyObject = (object: Unchangeable): Unchangeable => (Array.isArray(object) ? [] : {});

/**
 * create a shallow clone of the object passed, respecting its prototype
 */
export function getShallowClone<const V extends Unchangeable>(value: V): V {
  const clone = (Array.isArray(value) ? [...value] : { ...value }) as V;

  return value.constructor !== clone.constructor ? clonePrototype(value, clone) : clone;
}

/**
 * clone the object if it can be cloned, otherwise return the object itself
 */
export const cloneIfPossible = (object: any) => (isCloneable(object) ? getShallowClone(object) : object);

/**
 * if the object is cloneable, get a clone of the object, else get a new
 * empty child object based on the key
 */
export function getCloneOrEmptyObject<const V extends Unchangeable, K extends PathItem>(
  object: V,
  nextKey: K,
): TODO_FIX_YOUR_TYPES {
  return isCloneable(object) ? getShallowClone(object) : typeof nextKey === 'number' ? [] : {};
}

/**
 * return the value if not undefined, otherwise return the fallback value
 */
export const getCoalescedValue = (value: any, fallbackValue: any) => (value === void 0 ? fallbackValue : value);

/**
 * get a new object, cloned at the path specified while leveraging
 * structural sharing for the rest of the properties
 */
export function getCloneAtPath<const P extends Path, const V extends Unchangeable>(
  path: P,
  object: V,
  onMatch: (object: V, key: P[number]) => PickDeep<V, P>,
  index: number,
): V {
  const key = path[index]!;
  const nextIndex = index + 1;

  if (nextIndex === path.length) {
    onMatch(object, key);
  } else {
    // @ts-expect-error - Allow reassignment for deep cloning with structural sharing.
    object[key] = getCloneAtPath(path, getCloneOrEmptyObject(object[key], path[nextIndex]!), onMatch, nextIndex);
  }

  return object;
}

/**
 * get a clone of the object at the path specified
 */
export function getDeepClone<const P extends Path, const V extends Unchangeable>(
  path: P,
  object: V,
  onMatch: (object: V, key: P[number]) => any,
): V {
  const parsedPath = parse(path) as Path;
  const initialKey = parsedPath[0]!;
  const topLevelClone = getCloneOrEmptyObject(object, initialKey);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, initialKey);

    return topLevelClone;
  }

  return getCloneAtPath(parsedPath as P, topLevelClone, onMatch, 0);
}

/**
 * merge the source into the target, either deeply or shallowly
 */
export const getMergedObject = (target: Unchangeable, source: Unchangeable, isDeep: boolean): Unchangeable => {
  const isObject1Array = Array.isArray(target);

  if (isObject1Array !== Array.isArray(source) || !isCloneable(target)) {
    return cloneIfPossible(source);
  }

  if (isObject1Array) {
    return target.concat(source);
  }

  const targetClone: Unchangeable =
    target.constructor === Object || isGlobalConstructor(target.constructor)
      ? {}
      : Object.create(Object.getPrototypeOf(target));

  return getOwnProperties(source).reduce(
    (clone, key) => {
      clone[key] = isDeep && isCloneable(source[key]) ? getMergedObject(target[key], source[key], isDeep) : source[key];

      return clone;
    },
    Object.assign(targetClone, target),
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
    // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
    return NO_MATCH_FOUND;
  }

  const parsedPath = parse(path) as Path;

  if (isEmptyPath(parsedPath)) {
    // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
    return value;
  }

  if (parsedPath.length === 1) {
    const key = parsedPath[0]!;

    return Object.hasOwn(value, key)
      ? value[key]
      : // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
        NO_MATCH_FOUND;
  }

  let ref: any = value;
  let key = parsedPath[0]!;

  for (let index = 0; index < parsedPath.length - 1; index++) {
    // Handle bunk edge cases by bailing out.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (key == null || !ref?.[key]) {
      // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
      return NO_MATCH_FOUND;
    }

    ref = ref[key];
    key = parsedPath[index + 1]!;
  }

  return ref && Object.hasOwn(ref, key)
    ? ref[key]
    : // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
      undefined;
}

/**
 * get the path to add to, based on the object and fn passed
 */
export function getFullPath<const P extends Path, const V extends Unchangeable>(path: P, value: V): Path {
  const valueAtPath = getValueAtPath(path, value);

  return Array.isArray(valueAtPath)
    ? Array.isArray(path)
      ? path.concat([valueAtPath.length])
      : [valueAtPath.length]
    : path;
}

/**
 * get the value at the nested property, or the fallback provided
 */
export function getValueAtPath<const P extends AnyPath, const V extends Unchangeable, const N = undefined>(
  path: P,
  value: V | null | undefined,
  noMatchValue?: N,
): EmptyPath extends P ? V : PickDeepOr<V, P, N> {
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
): HasDeep<V, P> {
  // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
  return getValueAtPathInternal(path, value) !== NO_MATCH_FOUND;
}

/**
 * throw the TypeError based on the invalid handler
 */
export const throwInvalidFnError = (): never => {
  throw new TypeError('handler passed is not of type "function".');
};
