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
  SetDeep,
  TailArray,
  Unchangeable,
} from './internalTypes.js';
import { isCloneable, isEmptyPath } from './validation.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;
// eslint-disable-next-line @typescript-eslint/unbound-method
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

const NO_MATCH_FOUND: NoMatch = { $$noMatch: true };

function clonePrototype<const U>(original: U, clone: U): U {
  Object.setPrototypeOf(clone, Object.getPrototypeOf(original));

  return clone;
}

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
 * if the object is cloneable, get a clone of the object, else get a new
 * empty child object based on the key
 */
export function getCloneOrEmptyObject<const U extends Unchangeable, I extends PathItem>(object: U, nextKey: I): U {
  return isCloneable(object) ? getShallowClone(object) : ((typeof nextKey === 'number' ? [] : {}) as U);
}

/**
 * get a clone of the object at the path specified
 */
export function getDeepClone<const P extends Exclude<AnyPath, EmptyPath>, const U extends Unchangeable, const N>(
  path: P,
  object: U,
  onMatch: (object: PickDeep<U, P>, key: TailArray<P>) => any,
): SetDeep<U, P, N> {
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
 * get the all properties (keys and symbols) of the object passed
 */
export const getOwnProperties = (object: Unchangeable): Array<string | symbol> => {
  const ownProperties: Array<string | symbol> = Object.keys(object);
  const ownSymbols: symbol[] = Object.getOwnPropertySymbols(object);

  if (!ownSymbols.length) {
    return ownProperties;
  }

  return ownProperties.concat(
    ownSymbols.reduce((enumerableSymbols: symbol[], symbol: symbol): symbol[] => {
      if (propertyIsEnumerable.call(object, symbol)) {
        enumerableSymbols.push(symbol);
      }

      return enumerableSymbols;
    }, []),
  );
};

/**
 * create a shallow clone of the object passed, respecting its prototype
 */
export function getShallowClone<const U extends Unchangeable>(value: U): U {
  const clone = (Array.isArray(value) ? [...value] : { ...value }) as U;

  return value.constructor !== clone.constructor ? clonePrototype(value, clone) : clone;
}

/**
 * get the value at the nested property, or the fallback provided
 */
export function getValueAtPathInternal<const P extends AnyPath, const U extends Unchangeable>(
  path: P,
  value: U | null | undefined,
): PickDeepInternal<U, ParsePath<P>> {
  if (isEmptyPath(path)) {
    // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
    return value;
  }

  if (value == null) {
    // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
    return NO_MATCH_FOUND;
  }

  const parsedPath = parse(path) as Path;

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

  return ref && hasOwnProperty.call(ref, key)
    ? ref[key]
    : // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
      NO_MATCH_FOUND;
}

/**
 * get the path to add to, based on the object and fn passed
 */
export function getFullPath<const P extends Path, const U extends Unchangeable>(path: P, value: U): Path {
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
export function getValueAtPath<const P extends AnyPath, const U extends Unchangeable, const N = undefined>(
  path: P,
  value: U | null | undefined,
  noMatchValue?: N,
): PickDeepOr<U, P, N> {
  const result = getValueAtPathInternal(path, value);

  // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
  return result === NO_MATCH_FOUND ? noMatchValue : result;
}

/**
 * get the value at the nested property, or the fallback provided
 */
export function hasFullPath<const P extends AnyPath, const U extends Unchangeable>(
  path: P,
  value: U | null | undefined,
): HasDeep<U, P> {
  // @ts-expect-error - Types are widening internally due to ternary returns, but consumers get good types.
  return value != null && getValueAtPathInternal(path, value) !== NO_MATCH_FOUND;
}
