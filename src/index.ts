import type { Path } from 'pathington';
import type {
  AnyFn,
  AnyPath,
  EmptyPath,
  HasDeep,
  PickDeep,
  PickDeepOr,
  SetDeep,
  Unchangeable,
} from './internalTypes.js';
import { getDeepClone, getValueAtPath, hasFullPath } from './utils.js';
import { isCallable, isEmptyPath } from './validation.js';

// export { __ };

// export const add = curry(createAdd(false));

// export const addWith = curry(createAdd(true));

// export const assign = curry(createMerge(false, false));

// export const assignWith = curry(createMerge(true, false));

// export function getOr<const N>(
//   noMatchValue: N,
// ): <A extends unknown[]>(
//   ...args: A
// ) => A extends [infer P extends AnyPath]
//   ? <const U extends Unchangeable>(object: U) => PickDeepOr<U, P, N>
//   : A extends [infer P extends AnyPath, infer U extends Unchangeable]
//     ? PickDeepOr<U, P, N>
//     : never;

export function call<const P extends EmptyPath>(
  path: P,
): <const A extends unknown[]>(
  ...args: A
) => A extends [infer CallA extends unknown[]]
  ? <const U extends AnyFn<CallA>>(object: U, context?: any) => ReturnType<U>
  : A extends [infer CallA extends unknown[], infer U]
    ? U extends AnyFn<CallA>
      ? ReturnType<U>
      : never
    : never;
export function call<const P extends AnyPath>(
  path: P,
): <const A extends unknown[]>(
  ...args: A
) => A extends [infer CallA extends unknown[]]
  ? <const U extends Unchangeable>(
      object: U,
      context?: any,
    ) => PickDeep<U, P> extends AnyFn<CallA> ? ReturnType<PickDeep<U, P>> : undefined
  : A extends [infer CallA extends unknown[], infer U extends Unchangeable]
    ? PickDeep<U, P> extends AnyFn<CallA>
      ? ReturnType<PickDeep<U, P>>
      : undefined
    : never;
export function call<const P extends EmptyPath, const A extends unknown[]>(
  path: P,
  args: A,
): <const U extends AnyFn<A>>(object: U, context?: any) => ReturnType<U>;
export function call<const P extends AnyPath, const A extends unknown[]>(
  path: P,
  args: A,
): <const U extends Unchangeable>(
  object: U,
  context?: any,
) => PickDeep<U, P> extends AnyFn<A> ? ReturnType<PickDeep<U, P>> : undefined;
export function call<const P extends EmptyPath, const A extends unknown[], const U extends AnyFn<A>>(
  path: P,
  args: A,
  object: U,
  context?: any,
): ReturnType<U>;
export function call<const P extends AnyPath, const A extends unknown[], const U extends Unchangeable>(
  path: P,
  args: A,
  object: U,
  context?: any,
): PickDeep<U, P> extends AnyFn<A> ? ReturnType<PickDeep<U, P>> : undefined;
export function call<const P extends AnyPath, const A extends unknown[], const U extends Unchangeable | AnyFn<A>>(
  path: P,
  ...rest: [eagerArgs: A, eagerValue: U, eagerContext?: any] | [eagerArgs: A] | []
) {
  if (!rest.length) {
    return <const A extends unknown[], const U extends Unchangeable | AnyFn<A>>(
      args: A,
      ...rest: [eagerValue: U, eagerContext?: any] | []
    ) => {
      if (!rest.length) {
        return <const U extends Unchangeable | AnyFn<A>>(object: U, context = object) => {
          const fn = getValueAtPath(path, object);

          if (isCallable<A>(fn)) {
            return context !== object ? fn.apply(context, args) : fn(...args);
          }
        };
      }

      const [eagerValue] = rest;

      const fn = getValueAtPath(path, eagerValue);

      if (isCallable<A>(fn)) {
        const [, eagerContext = eagerValue] = rest;

        return eagerContext !== eagerValue ? fn.apply(eagerContext, args) : fn(...args);
      }
    };
  }

  const [eagerArgs] = rest;

  if (rest.length === 1) {
    return <const U extends Unchangeable | AnyFn<A>>(object: U, context = object) => {
      const fn = getValueAtPath(path, object);

      if (isCallable<A>(fn)) {
        return context !== object ? fn.apply(context, eagerArgs) : fn(...eagerArgs);
      }
    };
  }

  const [, eagerValue, eagerContext = eagerValue] = rest;

  const fn = getValueAtPath(path, eagerValue);

  if (isCallable<A>(fn)) {
    return eagerContext !== eagerValue ? fn.apply(eagerContext, eagerArgs) : fn(...eagerArgs);
  }
}

/**
 * Get the object at the `path` for the given `object`.
 */
export function get<const P extends AnyPath>(path: P): <const U extends Unchangeable>(object: U) => PickDeep<U, P>;
export function get<const P extends AnyPath, const U extends Unchangeable>(path: P, object: U): PickDeep<U, P>;
export function get<const P extends AnyPath, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerValue: EagerV] | []
) {
  if (!rest.length) {
    return <const U extends Unchangeable>(object: U) => getValueAtPath(path, object);
  }

  const [eagerValue] = rest;

  return getValueAtPath(path, eagerValue);
}

/**
 * Get the object at the `path` for the given `object`. If there is no object found at the given path, return the
 * provided default.
 */
export function getOr<const N>(
  noMatchValue: N,
): <A extends unknown[]>(
  ...args: A
) => A extends [infer P extends AnyPath]
  ? <const U extends Unchangeable>(object: U) => PickDeepOr<U, P, N>
  : A extends [infer P extends AnyPath, infer U extends Unchangeable]
    ? PickDeepOr<U, P, N>
    : never;
export function getOr<const N, const P extends AnyPath>(
  noMatchValue: N,
  path: P,
): <const U extends Unchangeable>(object: U) => PickDeepOr<U, P, N>;
export function getOr<const N, const P extends AnyPath, const U extends Unchangeable>(
  noMatchValue: N,
  path: P,
  object: U,
): PickDeepOr<U, P, N>;
export function getOr<const N, const P extends AnyPath, const U extends Unchangeable>(
  noMatchValue: N,
  ...rest: [path: P, object: U] | [path: P] | []
) {
  if (!rest.length) {
    return <const P extends AnyPath>(path: P, ...rest: [object: U] | []) => {
      if (!rest.length) {
        return <const U extends Unchangeable>(object: U) => getValueAtPath(path, object, noMatchValue);
      }

      const [eagerValue] = rest;

      return getValueAtPath(path, eagerValue, noMatchValue);
    };
  }

  const [eagerPath] = rest;

  if (rest.length === 1) {
    return <const U extends Unchangeable>(object: U) => getValueAtPath(eagerPath, object, noMatchValue);
  }

  const [, eagerValue] = rest;

  return getValueAtPath(eagerPath, eagerValue, noMatchValue);
}

/**
 * Whether the `path` exists in the given `object`.
 */
export function has<const P extends AnyPath>(path: P): <const U>(object: U) => HasDeep<U, P>;
export function has<const P extends AnyPath, const U>(path: P, object: U): HasDeep<U, P>;
export function has<const P extends AnyPath, const EagerV extends Unchangeable>(
  path: P,
  ...rest: [eagerValue: EagerV] | []
) {
  if (!rest.length) {
    return <const U extends Unchangeable>(object: U) => hasFullPath(path, object);
  }

  const eagerValue = rest[0];

  return hasFullPath(path, eagerValue);
}

/**
 * Whether the `expected` object matches the given `object` at `path` with
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness#same-value_equality_using_object.is)
 * equality.
 */
export function is<const E>(
  expected: E,
): <A extends unknown[]>(
  ...args: A
) => A extends [AnyPath]
  ? <const U extends Unchangeable>(object: U) => boolean
  : A extends [AnyPath, Unchangeable]
    ? boolean
    : never;
export function is<const E, const P extends AnyPath>(
  expected: E,
  path: P,
): <const U extends Unchangeable>(object: U) => boolean;
export function is<const E, const P extends AnyPath, const U extends Unchangeable>(
  expected: E,
  path: P,
  object: U,
): boolean;
export function is<const E, const P extends AnyPath, const U extends Unchangeable>(
  expected: E,
  ...rest: [path: P, object: U] | [path: P] | []
) {
  if (!rest.length) {
    return <const P extends AnyPath, const U extends Unchangeable>(path: P, ...rest: [object: U] | []) => {
      if (!rest.length) {
        return <const U extends Unchangeable>(object: U) => Object.is(getValueAtPath(path, object), expected);
      }

      const [eagerValue] = rest;

      return Object.is(getValueAtPath(path, eagerValue), expected);
    };
  }

  const [eagerPath] = rest;

  if (rest.length === 1) {
    return <const U extends Unchangeable>(object: U) => Object.is(getValueAtPath(eagerPath, object), expected);
  }

  const [, eagerValue] = rest;

  return Object.is(getValueAtPath(eagerPath, eagerValue), expected);
}

// export const merge = curry(createMerge(false, true));

// export const mergeWith = curry(createMerge(true, true));

/**
 * Whether the `expected` object does not match the given `object` at `path` with
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness#same-value_equality_using_object.is)
 * equality.
 */
export function not<const E>(
  expected: E,
): <A extends unknown[]>(
  ...args: A
) => A extends [AnyPath]
  ? <const U extends Unchangeable>(object: U) => boolean
  : A extends [AnyPath, Unchangeable]
    ? boolean
    : never;
export function not<const E, const P extends AnyPath>(
  expected: E,
  path: P,
): <const U extends Unchangeable>(object: U) => boolean;
export function not<const E, const P extends AnyPath, const U extends Unchangeable>(
  expected: E,
  path: P,
  object: U,
): boolean;
export function not<const E, const P extends AnyPath, const U extends Unchangeable>(
  expected: E,
  ...rest: [path: P, object: U] | [path: P] | []
) {
  if (!rest.length) {
    return <const P extends AnyPath, const U extends Unchangeable>(path: P, ...rest: [object: U] | []) => {
      if (!rest.length) {
        return <const U extends Unchangeable>(object: U) => !is(expected, path, object);
      }

      const [eagerValue] = rest;

      return !is(expected, path, eagerValue);
    };
  }

  const [eagerPath] = rest;

  if (rest.length === 1) {
    return <const U extends Unchangeable>(object: U) => !is(expected, eagerPath, object);
  }

  const [, eagerValue] = rest;

  return !is(expected, eagerPath, eagerValue);
}

// export const remove = curry(createRemove(false));

// export const removeWith = curry(createRemove(true));

export function set<const N>(
  newValue: N,
): <const A extends unknown[]>(
  ...args: A
) => A extends [infer P extends AnyPath]
  ? <const U extends Unchangeable>(object: U) => SetDeep<U, P, N>
  : A extends [infer P extends AnyPath, infer U extends Unchangeable]
    ? SetDeep<U, P, N>
    : never;
export function set<const N, const P extends AnyPath>(
  newValue: N,
  path: P,
): <const U extends Unchangeable>(object: U) => SetDeep<U, P, N>;
export function set<const N, const P extends AnyPath, const U extends Unchangeable>(
  newValue: N,
  path: P,
  object: U,
): SetDeep<U, P, N>;
export function set<const N, const P extends AnyPath, const U extends Unchangeable>(
  newValue: N,
  ...rest: [path: P, object: U] | [path: P] | []
) {
  if (!rest.length) {
    return <const P extends AnyPath, const U extends Unchangeable>(path: P, ...rest: [object: U] | []) => {
      if (!rest.length) {
        return <const U extends Unchangeable>(object: U) =>
          isEmptyPath(path)
            ? (newValue as any)
            : getDeepClone(path, object, (ref, key) => {
                // @ts-expect-error - Allow writing to object.
                ref[key] = newValue;
              });
      }

      const [eagerObject] = rest;

      return isEmptyPath(path)
        ? (newValue as any)
        : getDeepClone(path, eagerObject, (ref, key) => {
            // @ts-expect-error - Allow writing to object.
            ref[key] = newValue;
          });
    };
  }

  const [eagerPath] = rest;

  if (rest.length === 1) {
    return <const U extends Unchangeable>(object: U) =>
      isEmptyPath(eagerPath)
        ? (newValue as any)
        : getDeepClone(eagerPath, object, (ref, key) => {
            // @ts-expect-error - Allow writing to object.
            ref[key] = newValue;
          });
  }

  const [, eagerObject] = rest;

  return isEmptyPath(eagerPath)
    ? (newValue as any)
    : getDeepClone(eagerPath, eagerObject, (ref, key) => {
        // @ts-expect-error - Allow writing to object.
        ref[key] = newValue;
      });
}
