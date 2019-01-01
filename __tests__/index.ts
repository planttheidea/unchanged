import {
  add,
  addWith,
  assign,
  assignWith,
  call,
  callWith,
  get,
  getOr,
  getWith,
  getWithOr,
  has,
  hasWith,
  is,
  isWith,
  merge,
  mergeWith,
  remove,
  removeWith,
  set,
  setWith,
} from '../src';

describe('get', () => {
  it('should get the value at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toEqual(object[path[0]]);
  });

  it('should get the value at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toEqual(object[path]);
  });

  it('should get the value at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toEqual(object[path[0]][path[1]]);
  });

  it('should get the value at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: unchanged.Unchangeable = get(path, object);

    const splitPath: string[] = path.split('.');

    expect(result).toEqual(object[splitPath[0]][splitPath[1]]);
  });

  it('should return the object itself if the path is empty', () => {
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toBe(object);
  });

  it('should return undefined if no match at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: unchanged.Unchangeable = get(path, object);

    expect(result).toBe(undefined);
  });
});

describe('getOr', () => {
  it('should get the value at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path[0]]);
  });

  it('should get the value at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path]);
  });

  it('should get the value at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path[0]][path[1]]);
  });

  it('should get the value at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    const splitPath: string[] = path.split('.');

    expect(result).toEqual(object[splitPath[0]][splitPath[1]]);
  });

  it('should return the object itself if the path is empty', () => {
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toBe(object);
  });

  it('should return the fallback if no match at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });
});

describe('getWith', () => {
  it('should get the value at the simple array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should get the value at the simple string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should get the value at the nested array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toEqual(false);
  });

  it('should get the value at the nested string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toEqual(false);
  });

  it('should return the result of the callback with the object passed if the path is empty', () => {
    const fn: Function = (value: any) => value && value.foo;
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toBe(object.foo);
  });

  it('should return undefined if no match at the simple array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the simple string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: unchanged.Unchangeable = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: null = null;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => getWith(fn, path, object)).toThrowError();
  });
});

describe('getWithOr', () => {
  it('should get the value at the simple array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should get the value at the simple string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should get the value at the nested array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(false);
  });

  it('should get the value at the nested string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(false);
  });

  it('should return the result of the callback with the object passed if the path is empty', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(false);
  });

  it('should return the fallback if no match at the simple array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the simple string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fallbackValue: string = 'fallback';

    const result: unchanged.Unchangeable = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: null = null;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    expect(() => getWithOr(fn, fallbackValue, path, object)).toThrowError();
  });
});

describe('has', () => {
  it('should return true with the value at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: boolean = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: boolean = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true if the path is empty and the object is existy', () => {
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = has(path, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the object is not existy', () => {
    const path: unchanged.Path = [];
    const object: null = null;

    const result: boolean = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result: boolean = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result: boolean = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: boolean = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: boolean = has(path, object);

    expect(result).toBe(false);
  });
});

describe('hasWith', () => {
  it('should return true with the value at the simple array path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the simple string path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested array path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested string path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true if the path is empty and the object is existy', () => {
    const fn: Function = (value: any): boolean =>
      value && typeof value === 'object';
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the object is not existy', () => {
    const fn: Function = (value: any): boolean =>
      value && typeof value === 'object';
    const path: unchanged.Path = [];
    const object: null = null;

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const fn: Function = (value: any): boolean => typeof value === 'string';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };

    const result: boolean = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: null = null;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => hasWith(fn, path, object)).toThrowError();
  });
});

describe('is', () => {
  it('should return true with the value matching at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path[0]];

    const result: boolean = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result: boolean = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path];

    const result: boolean = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result: boolean = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const value: any = object[path[0]][path[1]];

    const result: boolean = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const value: any = 'quz';

    const result: boolean = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const splitPath: string[] = path.split('.');

    const value: any = object[splitPath[0]][splitPath[1]];

    const result: boolean = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const value: any = 'quz';

    const result: boolean = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true if the path is empty and the value matches', () => {
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object;

    const result: boolean = is(path, value, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the value does not match', () => {
    const path: unchanged.Path = [];
    const object: null = null;
    const value: any = undefined;

    const result: boolean = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result: boolean = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result: boolean = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const value: any = 'baz';

    const result: boolean = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const value: any = 'baz';

    const result: boolean = is(path, value, object);

    expect(result).toBe(false);
  });
});

describe('isWith', () => {
  it('should return true with the value matching at the simple array path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple array path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the simple string path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple string path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested array path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'baz' ? 'blah' : value;
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested array path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'baz' ? 'blah' : value;
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };
    const value: any = 'quz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested string path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'baz' ? 'blah' : value;
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested string path', () => {
    const fn: Function = (value: any): boolean =>
      value === 'baz' ? 'blah' : value;
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {
        bar: 'baz',
      },
    };

    const value: any = 'quz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true if the path is empty and the value matches', () => {
    const fn: Function = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: unchanged.Path = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the value does not match', () => {
    const fn: Function = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: unchanged.Path = [];
    const object: null = null;
    const value: any = 'blah';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo';
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const value: any = 'baz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const fn: Function = (value: any) => value === 'bar';
    const path: unchanged.Path = 'foo.bar';
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const value: any = 'baz';

    const result: boolean = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: null = null;
    const path: unchanged.Path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    expect(() => isWith(fn, path, value, object)).toThrowError();
  });
});
