declare namespace unchanged {
  export type PathItem = number | string;
  export type ParsedPath = PathItem[];
  export type Path = PathItem | ParsedPath;

  export interface Unchangeable {
    [key: string]: any;
    [index: number]: any;
  }

  export type withHandler = (value: any, ...extraArgs: any[]) => any;
}

declare module 'unchanged' {
  export function add(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable;

  export function addWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): unchanged.Unchangeable;

  export function assign(
    path: unchanged.Path,
    objectToAssign: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable;

  export function assignWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): unchanged.Unchangeable;

  export function call(
    path: unchanged.Path,
    parameters: any[],
    object: unchanged.Unchangeable | Function,
    context?: any,
  ): any;

  export function callWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    parameters: any[],
    object: unchanged.Unchangeable | Function,
    context?: any,
    ...extraArgs: any[]
  ): any;

  export function get(
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): any;

  export function getOr(
    fallbackValue: any,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): any;

  export function getWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): any;

  export function getWithOr(
    fn: unchanged.withHandler,
    fallbackValue: any,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): any;

  export function has(
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): boolean;

  export function hasWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): boolean;

  export function is(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): boolean;

  export function isWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): boolean;

  export function merge(
    path: unchanged.Path,
    objectToMerge: unchanged.Unchangeable,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable;

  export function mergeWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): unchanged.Unchangeable;

  export function not(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): boolean;

  export function notWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): boolean;

  export function remove(
    path: unchanged.Path,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable;

  export function removeWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): unchanged.Unchangeable;

  export function set(
    path: unchanged.Path,
    value: any,
    object: unchanged.Unchangeable,
  ): unchanged.Unchangeable;

  export function setWith(
    fn: unchanged.withHandler,
    path: unchanged.Path,
    object: unchanged.Unchangeable,
    ...extraArgs: any[]
  ): unchanged.Unchangeable;
}
