import type { AnyFn, EmptyPath } from 'internalTypes.js';

/**
 * Whether the value passed is a callable function.
 */
export function isCallable<const A extends unknown[]>(fn: any): fn is AnyFn<A> {
  return typeof fn === 'function';
}

/**
 * Whether the path passed an empty path.
 */
export function isEmptyPath(path: any): path is EmptyPath {
  return path == null || (Array.isArray(path) && !path.length);
}
