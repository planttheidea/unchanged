// external dependencies
import type { ParsePath, Path } from 'pathington';
import { parse } from 'pathington';
import type {
  AnyPath,
  EmptyPath,
  HasDeep,
  NoMatch,
  PickDeepInternal,
  PickDeepOr,
  Unchangeable,
} from './internalTypes.js';
import { isEmptyPath } from './validation.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

const NO_MATCH_FOUND: NoMatch = { $$noMatch: true };

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
 * get the value at the nested property, or the fallback provided
 */
export function getValueAtPathInternal<const P extends AnyPath, const V extends Unchangeable>(
  path: P,
  value: V | null | undefined,
): EmptyPath extends P ? V : PickDeepInternal<V, ParsePath<P>> {
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
