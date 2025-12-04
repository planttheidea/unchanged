import { __, curry } from 'curriable';
import { isFn } from 'validation.js';
import { createAdd, createMerge, createRemove, createSet } from './handlers.js';
import type { AnyFn, AnyPath, EmptyPath, HasDeep, PickDeep, PickDeepOr, Unchangeable } from './internalTypes.js';
import { getValueAtPath, hasFullPath } from './utils.js';

export { __ };

export const add = curry(createAdd(false));

export const addWith = curry(createAdd(true));

export const assign = curry(createMerge(false, false));

export const assignWith = curry(createMerge(true, false));

export function call<const P extends AnyPath>(
  path: P,
): <const A extends unknown[]>(
  args: A,
) => <const V extends Unchangeable>(
  value: V,
  context?: any,
) => PickDeep<V, P> extends AnyFn<A> ? ReturnType<PickDeep<V, P>> : undefined;
export function call<const P extends EmptyPath>(
  path: P,
): <const A extends any[]>(args: A) => <const V extends AnyFn<A>>(value: V, context?: any) => ReturnType<V>;
export function call<const P extends EmptyPath, const A extends unknown[]>(
  path: P,
  args: A,
): <const V extends AnyFn<A>>(value: V, context?: any) => ReturnType<V>;
export function call<const P extends AnyPath, const A extends unknown[]>(
  path: P,
  args: A,
): <const V extends Unchangeable>(
  value: V,
  context?: any,
) => PickDeep<V, P> extends AnyFn<A> ? ReturnType<PickDeep<V, P>> : undefined;
export function call<const P extends EmptyPath, const A extends unknown[], const V extends AnyFn<A>>(
  path: P,
  args: A,
  value: V,
  context?: any,
): ReturnType<V>;
export function call<const P extends AnyPath, const A extends unknown[], const V extends Unchangeable>(
  path: P,
  args: A,
  value: V,
  context?: any,
): PickDeep<V, P> extends AnyFn<A> ? ReturnType<PickDeep<V, P>> : undefined;
export function call<
  const P extends AnyPath | EmptyPath,
  const A extends unknown[],
  const V extends Unchangeable | AnyFn<A>,
>(path: P, ...rest: [eagerArgs: A, eagerValue: V, eagerContext?: any] | [eagerArgs: A] | []) {
  if (!rest.length) {
    return <const A extends unknown[], const V extends Unchangeable | AnyFn<A>>(
      args: A,
      ...rest: [eagerValue: V, eagerContext?: any] | []
    ) => {
      if (!rest.length) {
        return <const V extends Unchangeable | AnyFn<A>>(value: V, context = value) => {
          const fn = getValueAtPath(path, value);

          if (isFn<A>(fn)) {
            return context !== value ? fn.apply(context, args) : fn(...args);
          }
        };
      }

      const [, eagerValue, eagerContext = eagerValue] = rest;

      const fn = getValueAtPath(path, eagerValue);

      if (isFn<A>(fn)) {
        return eagerContext !== eagerValue ? fn.apply(eagerContext, args) : fn(...args);
      }
    };
  }

  const [eagerArgs] = rest;

  if (rest.length === 1) {
    return <const V extends Unchangeable | AnyFn<A>>(value: V, context = value) => {
      const fn = getValueAtPath(path, value);

      if (isFn<A>(fn)) {
        return context !== value ? fn.apply(context, eagerArgs) : fn(...eagerArgs);
      }
    };
  }

  const [, eagerValue, eagerContext = eagerValue] = rest;

  const fn = getValueAtPath(path, eagerValue);

  if (isFn<A>(fn)) {
    return eagerContext !== eagerValue ? fn.apply(eagerContext, eagerArgs) : fn(...eagerArgs);
  }
}

/**
 * Get the value at the `path` for the given `object`.
 */
export function get<const P extends AnyPath>(path: P): <const V extends Unchangeable>(value: V) => PickDeep<V, P>;
export function get<const P extends AnyPath, const V extends Unchangeable>(path: P, value: V): PickDeep<V, P>;
export function get<const P extends AnyPath, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerValue: EagerV] | []
) {
  if (!rest.length) {
    return <const V extends Unchangeable>(value: V) => getValueAtPath(path, value);
  }

  const [eagerValue] = rest;

  return getValueAtPath(path, eagerValue);
}

/**
 * Get the value at the `path` for the given `object`. If there is no value found at the given path, return the
 * provided default.
 */
export function getOr<const P extends AnyPath>(
  path: P,
): <const V extends Unchangeable, const N>(value: V, noMatchValue: N) => PickDeepOr<V, P, N>;
export function getOr<const P extends AnyPath, const V extends Unchangeable, const N>(
  path: P,
  value: V,
  noMatchValue: N,
): PickDeepOr<V, P, N>;
export function getOr<const P extends AnyPath, const EagerV extends Unchangeable, const EagerN>(
  path: P,
  ...rest: [eagerValue: EagerV, eagerNoMatchValue: EagerN] | []
) {
  if (!rest.length) {
    return <const V extends Unchangeable, const N>(value: V, noMatchValue: N) =>
      getValueAtPath(path, value, noMatchValue);
  }

  const [eagerValue, noMatchValue] = rest;

  return getValueAtPath(path, eagerValue, noMatchValue);
}

/**
 * Whether the `path` exists in the given `object`.
 */
export function has<const P extends AnyPath>(path: P): <const V>(value: V) => HasDeep<V, P>;
export function has<const P extends AnyPath, const V>(path: P, value: V): HasDeep<V, P>;
export function has<const P extends AnyPath, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerValue: EagerV] | []
) {
  if (!rest.length) {
    return <const V extends Unchangeable>(value: V) => hasFullPath(path, value);
  }

  const eagerValue = rest[0];

  return hasFullPath(path, eagerValue);
}

/**
 * Whether the `expected` value matches the given `object` at `path` with
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness#same-value_equality_using_object.is)
 * equality.
 */
export function is<const P extends AnyPath>(path: P): <const E>(expected: E) => <const V>(value: V) => boolean;
export function is<const P extends AnyPath>(path: P): <const E, const V>(expected: E, value: V) => boolean;
export function is<const P extends AnyPath, const E, const V>(path: P, expected: E, value: V): HasDeep<V, P>;
export function is<const P extends AnyPath, const EagerE, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerExpected: EagerE, eagerValue: EagerV] | [eagerExpected: EagerE] | []
) {
  if (!rest.length) {
    return <const E, const V extends Unchangeable>(expected: E, ...rest: [eagerValue?: V]) => {
      if (!rest.length) {
        return <const V extends Unchangeable>(value: V) => Object.is(getValueAtPath(path, value), expected);
      }

      const [eagerValue] = rest;

      return Object.is(getValueAtPath(path, eagerValue), eagerExpected);
    };
  }

  const [eagerExpected] = rest;

  if (rest.length === 1) {
    return <const V extends Unchangeable>(value: V) => Object.is(getValueAtPath(path, value), eagerExpected);
  }

  const [, eagerValue] = rest;

  return Object.is(getValueAtPath(path, eagerValue), eagerExpected);
}

export const merge = curry(createMerge(false, true));

export const mergeWith = curry(createMerge(true, true));

/**
 * Whether the `expected` value does not match the given `object` at `path` with
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness#same-value_equality_using_object.is)
 * equality.
 */
export function not<const P extends AnyPath>(path: P): <const E>(expected: E) => <const V>(value: V) => boolean;
export function not<const P extends AnyPath>(path: P): <const E, const V>(expected: E, value: V) => boolean;
export function not<const P extends AnyPath, const E, const V>(path: P, expected: E, value: V): HasDeep<V, P>;
export function not<const P extends AnyPath, const EagerE, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerExpected: EagerE, eagerValue: EagerV] | [eagerExpected: EagerE] | []
) {
  if (!rest.length) {
    return <const E, const V extends Unchangeable>(expected: E, ...rest: [eagerValue?: V]) => {
      if (!rest.length) {
        return <const V extends Unchangeable>(value: V) => !is(path, expected, value);
      }

      const [eagerValue] = rest;

      return !is(path, expected, eagerValue);
    };
  }

  const [eagerExpected] = rest;

  if (rest.length === 1) {
    return <const V extends Unchangeable>(value: V) => !is(path, eagerExpected, value);
  }

  const [, eagerValue] = rest;

  return !is(path, eagerExpected, eagerValue);
}

export const remove = curry(createRemove(false));

export const removeWith = curry(createRemove(true));

export const set = curry(createSet(false));

export const setWith = curry(createSet(true));
