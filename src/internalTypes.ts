import type { ParsePath, Path, PathItem, ReadonlyPath } from 'pathington';

export type AnyPath = Path | ReadonlyPath | PathItem;

export interface Unchangeable {
  [key: string]: any;
  [index: number]: any;
  [symbol: symbol]: any;
}

export type EmptyPath = null | [];

type PickArray<V extends unknown[], I extends number> = V[I];
type PickObject<V extends object, K extends keyof V> = V[K];

export interface NoMatchFound {
  $$noMatch: true;
}

type _PickDeep<V, P extends unknown[]> = P extends [infer Next, ...infer Rest]
  ? V extends object
    ? Next extends keyof V
      ? _PickDeep<PickObject<V, Next>, Rest>
      : NoMatchFound
    : V extends unknown[]
      ? Next extends number
        ? _PickDeep<PickArray<V, Next>, Rest>
        : NoMatchFound
      : V
  : V;

export type PickDeepInternal<V, P> = EmptyPath extends P
  ? V
  : P extends unknown[]
    ? _PickDeep<V, P>
    : P extends readonly unknown[]
      ? _PickDeep<V, [...P]>
      : V;

export type PickDeep<V, P extends AnyPath, Result = PickDeepInternal<V, ParsePath<P>>> = NoMatchFound extends Result
  ? undefined
  : Result;

export type PickDeepOr<V, P extends AnyPath, N, Result = PickDeep<V, P>> = NoMatchFound extends Result ? N : Result;

export type HasDeep<V, P extends AnyPath, Result = PickDeepInternal<V, ParsePath<P>>> = NoMatchFound extends Result
  ? false
  : true;
