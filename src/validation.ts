import type { AnyFn } from 'internalTypes.js';

export function isFn<const A extends unknown[]>(fn: any): fn is AnyFn<A> {
  return typeof fn === 'function';
}
