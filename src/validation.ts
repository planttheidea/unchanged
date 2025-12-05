import type { AnyFn, EmptyPath } from 'internalTypes.js';
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringObject = Object.prototype.toString;

const REACT_ELEMENT = Symbol.for('react.element');

/**
 * Whether the value passed is a callable function.
 */
export function isCallable<const A extends unknown[]>(fn: any): fn is AnyFn<A> {
  return typeof fn === 'function';
}

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
 * Whether the path passed an empty path.
 */
export function isEmptyPath(path: any): path is EmptyPath {
  return path == null || (Array.isArray(path) && !path.length);
}
