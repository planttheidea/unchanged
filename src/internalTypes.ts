import type { ParsePath, Path, PathItem, ReadonlyPath } from 'pathington';

export type AnyFn<A extends unknown[] | readonly unknown[] = unknown[]> = (...args: A) => any;
export type AnyPath = EmptyPath | Path | ReadonlyPath | PathItem;
export type AnyParseablePath = Exclude<AnyPath, EmptyPath>;

export interface Unchangeable {
  [key: string]: any;
  [index: number]: any;
  [symbol: symbol]: any;
}

export type EmptyPath = null | [];

type PickArray<V extends unknown[], I extends number> = V[I];
type PickObject<V extends object, K extends keyof V> = V[K];

export interface NoMatch {
  $$noMatch: true;
}

interface UnknownMatch {
  $$unknown: true;
}

type _PickDeep<V, P extends unknown[]> = unknown extends V
  ? UnknownMatch
  : P extends [infer Next, ...infer Rest]
    ? V extends object
      ? Next extends keyof V
        ? _PickDeep<PickObject<V, Next>, Rest>
        : NoMatch
      : V extends unknown[]
        ? Next extends number
          ? _PickDeep<PickArray<V, Next>, Rest>
          : NoMatch
        : V
    : V;

export type PickDeepInternal<V, P> = EmptyPath extends P
  ? V
  : P extends unknown[]
    ? _PickDeep<V, P>
    : P extends readonly unknown[]
      ? _PickDeep<V, [...P]>
      : V;

export type PickDeep<V, P extends AnyPath, Result = PickDeepInternal<V, ParsePath<P>>> = NoMatch extends Result
  ? undefined
  : UnknownMatch extends Result
    ? any
    : Result;

export type PickDeepOr<V, P extends AnyPath, N, Result = PickDeepInternal<V, ParsePath<P>>> = NoMatch extends Result
  ? N
  : UnknownMatch extends Result
    ? any
    : Result;

export type HasDeep<V, P extends AnyPath, Result = PickDeepInternal<V, ParsePath<P>>> = NoMatch extends Result
  ? false
  : UnknownMatch extends Result
    ? boolean
    : true;
