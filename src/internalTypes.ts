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
export type IsEmptyPath<T> = null extends T ? true : [] extends T ? true : false;

type PickArray<U extends unknown[], I extends number> = U[I];
type PickObject<U extends object, K extends keyof U> = U[K];

export interface NoMatch {
  $$noMatch: true;
}

interface UnknownMatch {
  $$unknown: true;
}

type _PickDeep<U, P extends unknown[]> = unknown extends U
  ? UnknownMatch
  : P extends [infer Next, ...infer Rest]
    ? U extends object
      ? Next extends keyof U
        ? _PickDeep<PickObject<U, Next>, Rest>
        : NoMatch
      : U extends unknown[]
        ? Next extends number
          ? _PickDeep<PickArray<U, Next>, Rest>
          : NoMatch
        : U
    : U;

export type PickDeepInternal<U, P> =
  true extends IsEmptyPath<P>
    ? U
    : P extends unknown[]
      ? _PickDeep<U, P>
      : P extends readonly unknown[]
        ? _PickDeep<U, [...P]>
        : U;

export type PickDeep<U, P extends AnyPath, Result = PickDeepInternal<U, ParsePath<P>>> = NoMatch extends Result
  ? undefined
  : UnknownMatch extends Result
    ? any
    : Result;

export type PickDeepOr<U, P extends AnyPath, N, Result = PickDeepInternal<U, ParsePath<P>>> = NoMatch extends Result
  ? N
  : UnknownMatch extends Result
    ? any
    : Result;

export type HasDeep<U, P extends AnyPath, Result = PickDeepInternal<U, ParsePath<P>>> = NoMatch extends Result
  ? false
  : UnknownMatch extends Result
    ? boolean
    : true;

type ExtendArray<B extends unknown[], S extends unknown[], E extends unknown[] = []> = B extends [
  infer Next,
  ...infer Rest,
]
  ? S extends [infer _NextSparse, ...infer RestSparse]
    ? ExtendArray<Rest, RestSparse, [...E, Next]>
    : [...E, Next, ...Rest]
  : S extends [infer NextSparse, ...infer RestSparse]
    ? [...E, NextSparse, ...RestSparse]
    : E;
type SparseArray<L extends number, A extends undefined[] = []> =
  L extends TupleLength<A> ? A : SparseArray<L, [...A, undefined]>;
type TupleLength<A extends unknown[]> = A extends unknown ? (number extends A['length'] ? never : A['length']) : never;

type SetArray<A extends unknown[], I extends number, V, C extends unknown[] = []> = A extends [
  infer Item,
  ...infer Rest,
]
  ? I extends TupleLength<C>
    ? [...C, V, ...Rest]
    : SetArray<Rest, I, V, [...C, Item]>
  : [...C, V];
type SetObject<O extends object, K extends number | string | symbol, V> = Omit<O, K> & Record<K, V>;

type SetDeepInternal<U, P, N> = P extends [infer Next, ...infer Rest]
  ? Next extends string
    ? [] extends Rest
      ? U extends object
        ? SetObject<U, Next, N>
        : SetObject<{}, Next, N>
      : U extends object
        ? SetObject<U, Next, SetDeepInternal<SetObject<{}, Next, {}>[Next], Rest, N>>
        : SetObject<{}, Next, SetDeepInternal<SetObject<{}, Next, {}>[Next], Rest, N>>
    : Next extends number
      ? [] extends Rest
        ? U extends unknown[]
          ? SetArray<ExtendArray<U, SparseArray<Next>>, Next, N>
          : [...SparseArray<Next>, N]
        : U extends unknown[]
          ? SetArray<ExtendArray<U, SparseArray<Next>>, Next, SetDeepInternal<U[Next], Rest, N>>
          : SetArray<SparseArray<Next>, Next, SetDeepInternal<SparseArray<Next>, Rest, N>>
      : Next extends symbol
        ? [] extends Rest
          ? U extends object
            ? SetObject<U, Next, N>
            : SetObject<{}, Next, N>
          : U extends object
            ? SetObject<U, Next, SetDeepInternal<SetObject<{}, Next, {}>[Next], Rest, N>>
            : SetObject<{}, Next, SetDeepInternal<SetObject<{}, Next, {}>[Next], Rest, N>>
        : never
  : never;

export type SetDeep<U, P, N> =
  true extends IsEmptyPath<P>
    ? N
    : P extends unknown[]
      ? SetDeepInternal<U, P, N>
      : P extends readonly unknown[]
        ? SetDeepInternal<U, P, N>
        : U;
