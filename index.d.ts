/* eslint-disable */

declare namespace unchanged {
  export type PathItem = number | string;
  export type ParsedPath = PathItem[];
  export type Path = PathItem | ParsedPath;

  export interface Unchangeable {
    [key: string]: any;
    [index: number]: any;
  }

  export type Fn = (...args: any[]) => any;

  export type WithHandler = (value: any, ...extraArgs: any[]) => any;

  export type Add = (path: Path, value: any, object: Unchangeable) => Unchangeable;

  export type AddWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => Unchangeable;

  export type Assign = (
    path: Path,
    objectToAssign: Unchangeable,
    object: Unchangeable,
  ) => Unchangeable;

  export type AssignWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => Unchangeable;

  export type Call = (
    path: Path,
    parameters: any[],
    object: Unchangeable | Fn,
    context?: any,
  ) => any;

  export type CallWith = (
    fn: WithHandler,
    path: Path,
    parameters: any[],
    object: Unchangeable | Fn,
    context?: any,
    ...extraArgs: any[]
  ) => any;

  export type Get = (path: Path, object: Unchangeable) => any;

  export type GetOr = (fallbackValue: any, path: Path, object: Unchangeable) => any;

  export type GetWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => any;

  export type GetWithOr = (
    fn: WithHandler,
    fallbackValue: any,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => any;

  export type Has = (path: Path, object: Unchangeable) => boolean;

  export type HasWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => boolean;

  export type Is = (path: Path, value: any, object: Unchangeable) => boolean;

  export type IsWith = (
    fn: WithHandler,
    path: Path,
    value: any,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => boolean;

  export type Merge = (
    path: Path,
    objectToMerge: Unchangeable,
    object: Unchangeable,
  ) => Unchangeable;

  export type MergeWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => Unchangeable;

  export type Not = (path: Path, value: any, object: Unchangeable) => boolean;

  export type NotWith = (
    fn: WithHandler,
    path: Path,
    value: any,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => boolean;

  export type Remove = (path: Path, object: Unchangeable) => Unchangeable;

  export type RemoveWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => Unchangeable;

  export type Set = (path: Path, value: any, object: Unchangeable) => Unchangeable;

  export type SetWith = (
    fn: WithHandler,
    path: Path,
    object: Unchangeable,
    ...extraArgs: any[]
  ) => Unchangeable;
}

declare module 'unchanged' {
  type Curried<Handler extends unchanged.Fn> = import('curriable').Curried<Handler>;

  export const add: Curried<unchanged.Add>;
  export const addWith: Curried<unchanged.AddWith>;
  export const assign: Curried<unchanged.Assign>;
  export const assignWith: Curried<unchanged.AssignWith>;
  export const call: Curried<unchanged.Call>;
  export const callWith: Curried<unchanged.CallWith>;
  export const get: Curried<unchanged.Get>;
  export const getOr: Curried<unchanged.GetOr>;
  export const getWith: Curried<unchanged.GetWith>;
  export const getWithOr: Curried<unchanged.GetWithOr>;
  export const has: Curried<unchanged.Has>;
  export const hasWith: Curried<unchanged.HasWith>;
  export const is: Curried<unchanged.Is>;
  export const isWith: Curried<unchanged.IsWith>;
  export const merge: Curried<unchanged.Merge>;
  export const mergeWith: Curried<unchanged.MergeWith>;
  export const not: Curried<unchanged.Not>;
  export const notWith: Curried<unchanged.NotWith>;
  export const remove: Curried<unchanged.Remove>;
  export const removeWith: Curried<unchanged.RemoveWith>;
  export const set: Curried<unchanged.Set>;
  export const setWith: Curried<unchanged.SetWith>;
}
