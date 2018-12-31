declare namespace unchanged {
  export type PathItem = number | string;
  export type ParsedPath = PathItem[];
  export type Path = PathItem | ParsedPath;

  export interface Unchangeable {
    [key: string]: any;
    [index: number]: any;
  }
}
