declare module 'curriable' {
  export const __: Symbol | number;

  export function curry(fn: Function, arity?: number): Function;
}
