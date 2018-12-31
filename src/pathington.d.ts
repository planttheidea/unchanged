declare module 'pathington' {
  export function parse(
    path: string | number | (number | string)[],
  ): (number | string)[];
}
