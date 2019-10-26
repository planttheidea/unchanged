import { parse } from 'pathington';

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
  not,
  notWith,
  remove,
  removeWith,
  set,
  setWith,
} from '../src';

describe('add', () => {
  it('should add the value to the object at the simple array path', () => {
    const path = ['foo'];
    const value = 'value';
    const object = {};

    const result = add(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: value,
    });
  });

  it('should add the value to the object at the simple string path', () => {
    const path = 'foo';
    const value = 'value';
    const object = {};

    const result = add(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: value,
    });
  });

  it('should add the value to the object at the nested array path', () => {
    const path = ['foo', 0];
    const value = 'value';
    const object: { foo: any[] } = {
      foo: [],
    };

    const result = add(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should add the value to the object at the nested string path', () => {
    const path = 'foo[0]';
    const value = 'value';
    const object: { foo: any[] } = {
      foo: [],
    };

    const result = add(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should add to the array object directly if an empty path', () => {
    const path: any = null;
    const value = 'value';
    const object: any[] = [];

    const result = add(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual([value]);
  });

  it('should return the value directly if the object is not an array and path is empty', () => {
    const path: any = null;
    const value = 'value';
    const object = {};

    const result = add(path, value, object);

    expect(result).toBe(value);
  });
});

describe('addWith', () => {
  it('should add the value to the object at the simple array path', () => {
    const fn = (value: any) => ({ value });
    const path = ['foo'];
    const object: unchanged.Unchangeable = {
      foo: 'bar',
    };

    const result = addWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        value: object[path[0]],
      },
    });
  });

  it('should add the value to the object at the simple string path', () => {
    const fn = (value: any) => ({ value });
    const path = 'foo';
    const object: unchanged.Unchangeable = {
      foo: 'bar',
    };

    const result = addWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        value: object[path],
      },
    });
  });

  it('should add the value to the object at the nested array path', () => {
    const fn = (value: any) => ({ value });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = addWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          value: object[path[0]][path[1]],
        },
      ],
    });
  });

  it('should add the value to the object at the nested string path', () => {
    const fn = (value: any) => ({ value });
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = addWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          value: object[parsedPath[0]][parsedPath[1]],
        },
      ],
    });
  });

  it('should add to the array object directly if an empty path', () => {
    const fn = (value: any) => ({ value });
    const path: any = null;
    const object: any[] = [];

    const result = addWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual([
      {
        value: undefined,
      },
    ]);
  });

  it('should return the value directly if the object is not an array and path is empty', () => {
    const fn = (value: any) => ({ value });
    const path: any = null;
    const object = {};

    const result = addWith(fn, path, object);

    expect(result).toEqual({
      value: object,
    });
  });
});

describe('assign', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const path = ['foo'];
    const value = { bar: 'baz' };
    const object = { foo: 'bar', untouched: true };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: value,
    });
  });

  it('should create a new object with the value assigned at the simple array path', () => {
    const path = ['foo'];
    const value = { bar: 'baz' };
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        ...object[path[0]],
        ...value,
      },
    });
  });

  it('should create a new object with the value set at the simple string path', () => {
    const path = 'foo';
    const value = { bar: 'baz' };
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: value,
    });
  });

  it('should create a new object with the value assigned at the simple string path', () => {
    const path = 'foo';
    const value = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz', deeply: { set: 'stuff' } },
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        ...object[path],
        ...value,
      },
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = { bar: 'baz' };
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value assigned at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz', deeply: { set: 'stuff' } }],
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          ...object[path[0]][path[1]],
          ...value,
        },
      ],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const path = 'foo[0]';
    const value: any = { bar: 'baz' };
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should create a new object with the value assigned at the nested array path', () => {
    const path = 'foo[0]';
    const value: any = { baz: 'quz' };
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          ...object[parsedPath[0]][parsedPath[1]],
          ...value,
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assign(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should return the assigned objects if the path is empty', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assign(path, value, object);

    expect(result).toEqual({
      ...object,
      ...value,
    });
  });

  it('should return the value if the object is not cloneable', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: any = 123;

    const result = assign(path, value, object);

    expect(result).toBe(value);
  });
});

describe('assignWith', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        value: object[path[0]],
      },
    });
  });

  it('should create a new object with the value assigned at the simple array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo'];
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        ...object[path[0]],
        value: object[path[0]],
      },
    });
  });

  it('should create a new object with the value set at the simple string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        value: object[path],
      },
    });
  });

  it('should create a new object with the value assigned at the simple string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo';
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        ...object[path],
        value: object[path],
      },
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          value: object[path[0]][path[1]],
        },
      ],
    });
  });

  it('should create a new object with the value assigned at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          ...object[path[0]][path[1]],
          value: object[path[0]][path[1]],
        },
      ],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          value: object[parsedPath[0]][parsedPath[1]],
        },
      ],
    });
  });

  it('should create a new object with the value assigned at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          ...object[parsedPath[0]][parsedPath[1]],
          value: object[parsedPath[0]][parsedPath[1]],
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          value: undefined,
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          value: undefined,
        },
      ],
    });
  });

  it('should return the merged objects if the path is empty', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path: any[] = [];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).toEqual({
      ...object,
      value: object,
    });
  });

  it('should return the original objects if the path is empty and the fn returns falsy', () => {
    const fn = (value: any): any => null;
    const path: any[] = [];
    const object = { untouched: true };

    const result = assignWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object = {};

    expect(() => mergeWith(fn, path, object)).toThrowError();
  });

  it('should return the value returned by fn if the object is not cloneable', () => {
    const fn = (value: any): any => null;
    const path: any[] = [];
    const object = 123;

    const result = assignWith(fn, path, object);

    expect(result).toBe(null);
  });
});

describe('call', () => {
  it('should call the function at the simple array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const path = ['foo'];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: fn };

    const result = call(path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should call the function at the simple array path with the custom context value', () => {
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const context = { iam: 'context' };

    const fn = jest.fn().mockImplementation(function (this: any) {
      expect(this).toBe(context);

      return 'called';
    });

    const object = { [path[0]]: fn };

    const result = call(path, parameters, object, context);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should call the function at the simple string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const path = 'foo';
    const parameters: any[] = [123, null];
    const object = { [path]: fn };

    const result = call(path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should call the function at the nested array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const path = ['foo', 0];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: [fn] };

    const result = call(path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should call the function at the nested string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const path = 'foo[0]';
    const parameters: any[] = [123, null];
    const object = { [path.split('[')[0]]: [fn] };

    const result = call(path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if no match found at the simple array path', () => {
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const object = {};

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the simple string path', () => {
    const path = 'foo';
    const parameters: any[] = [123, null];
    const object = {};

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the nested array path', () => {
    const path = ['foo', 0];
    const parameters: any[] = [123, null];
    const object: { foo: any[] } = { foo: [] };

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the nested string path', () => {
    const path = 'foo[0]';
    const parameters: any[] = [123, null];
    const object: { foo: any[] } = { foo: [] };

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should call the object if the path is empty and the object is a function', () => {
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object = jest.fn().mockReturnValue('called');

    const result = call(path, parameters, object);

    expect(object).toBeCalledTimes(1);
    expect(object).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if the path is empty and the object is not function', () => {
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object: any = null;

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });
});

describe('callWith', () => {
  it('should call the function returned by fn at the simple array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = <T extends any>(value: T): T => value;
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: fn };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should call the function returned by fn at the simple array path with custom context', () => {
    const fnWith = <T extends any>(value: T): T => value;
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const context: object = { iam: 'context' };

    const fn = jest.fn().mockImplementation(function (this: any) {
      expect(this).toBe(context);

      return 'called';
    });

    const object = { [path[0]]: fn };

    const result = callWith(fnWith, path, parameters, object, context);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if fn returns a non-function at the simple array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = (value: any): boolean => value === fn;
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: fn };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(0);

    expect(result).toBe(undefined);
  });

  it('should call the function returned by fn at the simple string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = <T extends any>(value: T): T => value;
    const path = 'foo';
    const parameters: any[] = [123, null];
    const object = { [path]: fn };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if fn returns a non-function at the simple string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = (value: any): boolean => value === fn;
    const path = 'foo';
    const parameters: any[] = [123, null];
    const object = { [path]: fn };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(0);

    expect(result).toBe(undefined);
  });

  it('should call the function returned by fn at the nested array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = <T extends any>(value: T): T => value;
    const path = ['foo', 0];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: [fn] };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if fn returns a non-function at the nested array path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = (value: any): boolean => value === fn;
    const path = ['foo', 0];
    const parameters: any[] = [123, null];
    const object = { [path[0]]: [fn] };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(0);

    expect(result).toBe(undefined);
  });

  it('should call the function returned by fn at the nested string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = <T extends any>(value: T): T => value;
    const path = 'foo[0]';
    const parameters: any[] = [123, null];
    const object = { [path.split('[')[0]]: [fn] };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  it('should return undefined if fn returns a non-function at the nested string path', () => {
    const fn = jest.fn().mockReturnValue('called');

    const fnWith = (value: any): boolean => value === fn;
    const path = 'foo[0]';
    const parameters: any[] = [123, null];
    const object = { [path.split('[')[0]]: [fn] };

    const result = callWith(fnWith, path, parameters, object);

    expect(fn).toBeCalledTimes(0);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the simple array path', () => {
    const fn = <T extends any>(value: T): T => value;
    const path = ['foo'];
    const parameters: any[] = [123, null];
    const object = {};

    const result = callWith(fn, path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the simple string path', () => {
    const fn = <T extends any>(value: T): T => value;
    const path = 'foo';
    const parameters: any[] = [123, null];
    const object = {};

    const result = callWith(fn, path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the nested array path', () => {
    const fn = <T extends any>(value: T): T => value;
    const path = ['foo', 0];
    const parameters: any[] = [123, null];
    const object: { foo: any[] } = { foo: [] };

    const result = callWith(fn, path, parameters, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match found at the nested string path', () => {
    const fn = <T extends any>(value: T): T => value;
    const path = 'foo[0]';
    const parameters: any[] = [123, null];
    const object: { foo: any[] } = { foo: [] };

    const result = callWith(fn, path, parameters, object);

    expect(result).toBe(undefined);
  });

  // tslint:disable-next-line max-line-length
  it('should call the object if the path is empty and the object returned from fn is a function', () => {
    const fn = <T extends any>(value: T): T => value;
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object = jest.fn().mockReturnValue('called');

    const result = callWith(fn, path, parameters, object);

    expect(object).toBeCalledTimes(1);
    expect(object).toBeCalledWith(...parameters);

    expect(result).toEqual('called');
  });

  // tslint:disable-next-line max-line-length
  it('should return undefined if the path is empty and the object returned from fn is a not function', () => {
    const fn = (value: any) => !value;
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object = jest.fn().mockReturnValue('called');

    const result = callWith(fn, path, parameters, object);

    expect(object).toBeCalledTimes(0);

    expect(result).toBe(undefined);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object = jest.fn().mockReturnValue('called');

    expect(() => callWith(fn, path, parameters, object)).toThrowError();
  });
});

describe('get', () => {
  it('should get the value at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = get(path, object);

    expect(result).toEqual(object[path[0]]);
  });

  it('should get the value at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = get(path, object);

    expect(result).toEqual(object[path]);
  });

  it('should get the value at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = get(path, object);

    expect(result).toEqual(object[path[0]][path[1]]);
  });

  it('should get the value at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = get(path, object);

    const parsedPath = parse(path);

    expect(result).toEqual(object[parsedPath[0]][parsedPath[1]]);
  });

  it('should return the object itself if the path is empty', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = get(path, object);

    expect(result).toBe(object);
  });

  it('should return undefined if no match at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = get(path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = get(path, object);

    expect(result).toBe(undefined);
  });
});

describe('getOr', () => {
  it('should get the value at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path[0]]);
  });

  it('should get the value at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path]);
  });

  it('should get the value at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toEqual(object[path[0]][path[1]]);
  });

  it('should get the value at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    const parsedPath = parse(path);

    expect(result).toEqual(object[parsedPath[0]][parsedPath[1]]);
  });

  it('should return the object itself if the path is empty', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toBe(object);
  });

  it('should return the fallback if no match at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const fallbackValue: string = 'fallback';

    const result = getOr(fallbackValue, path, object);

    expect(result).toBe(fallbackValue);
  });
});

describe('getWith', () => {
  it('should get the value at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should get the value at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should get the value at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should get the value at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = getWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return the result of the callback with the object passed if the path is empty', () => {
    const fn = (value: any) => value && value.foo;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = getWith(fn, path, object);

    expect(result).toBe(object.foo);
  });

  it('should return undefined if no match at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should return undefined if no match at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = getWith(fn, path, object);

    expect(result).toBe(undefined);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => getWith(fn, path, object)).toThrowError();
  });
});

describe('getWithOr', () => {
  it('should get the value at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should get the value at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should get the value at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should get the value at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toEqual(true);
  });

  it('should return the result of the callback with the object passed if the path is empty', () => {
    const fn = (value: any) => value === 'bar';
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(false);
  });

  it('should return the fallback if no match at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback if no match at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const fallbackValue: string = 'fallback';

    const result = getWithOr(
      fn,
      fallbackValue,
      path,
      object,
    );

    expect(result).toBe(fallbackValue);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const fallbackValue: string = 'fallback';

    expect(() => getWithOr(fn, fallbackValue, path, object)).toThrowError();
  });
});

describe('has', () => {
  it('should return true with the value at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = has(path, object);

    expect(result).toEqual(true);
  });

  it('should return true if the path is empty and the object is existy', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = has(path, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the object is not existy', () => {
    const path: any[] = [];
    const object: any = null;

    const result = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = has(path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = has(path, object);

    expect(result).toBe(false);
  });
});

describe('hasWith', () => {
  it('should return true with the value at the simple array path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the simple string path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested array path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true with the value at the nested string path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const result = hasWith(fn, path, object);

    expect(result).toEqual(true);
  });

  it('should return true if the path is empty and the object is existy', () => {
    const fn = (value: any): boolean =>
      value && typeof value === 'object';
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };

    const result = hasWith(fn, path, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the object is not existy', () => {
    const fn = (value: any): boolean =>
      value && typeof value === 'object';
    const path: any[] = [];
    const object: any = null;

    const result = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    const result = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = 'foo';
    const object: unchanged.Unchangeable = {};

    const result = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const fn = (value: any): boolean => typeof value === 'string';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };

    const result = hasWith(fn, path, object);

    expect(result).toBe(false);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => hasWith(fn, path, object)).toThrowError();
  });
});

describe('is', () => {
  it('should return true with the value matching at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path[0]];

    const result = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path];

    const result = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = object[path[0]][path[1]];

    const result = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'quz';

    const result = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const parsedPath = parse(path);

    const value: any = object[parsedPath[0]][parsedPath[1]];

    const result = is(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'quz';

    const result = is(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true if the path is empty and the value matches', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object;

    const result = is(path, value, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the value does not match', () => {
    const path: any[] = [];
    const object: any = null;
    const value: any = undefined;

    const result = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const path = 'foo';
    const object = {};
    const value = 'bar';

    const result = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const path = ['foo', 0];
    const object: { foo: any[] } = {
      foo: [],
    };
    const value = 'baz';

    const result = is(path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const path = 'foo[0]';
    const object: { foo: any[] } = {
      foo: [],
    };
    const value = 'baz';

    const result = is(path, value, object);

    expect(result).toBe(false);
  });
});

describe('isWith', () => {
  it('should return true with the value matching at the simple array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the simple string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the simple string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'quz';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value matching at the nested string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value not matching at the nested string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'quz';

    const result = isWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true if the path is empty and the value matches', () => {
    const fn = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return false if the path is empty and the value does not match', () => {
    const fn = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: any[] = [];
    const object: any = null;
    const value: any = 'blah';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return false if no match at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    expect(() => isWith(fn, path, value, object)).toThrowError();
  });
});

describe('merge', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const path = ['foo'];
    const value: any = { bar: 'baz' };
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: value,
    });
  });

  it('should create a new object with the value set at the simple string path', () => {
    const path = 'foo';
    const value: any = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: value,
    });
  });

  it('should create a new object with the value merged at the simple string path', () => {
    const path = 'foo';
    const value: any = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz', deeply: { set: 'stuff' } },
      untouched: true,
    };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        ...object[path],
        ...value,
        deeply: {
          ...object[path].deeply,
          ...value.deeply,
        },
      },
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value merged at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = { bar: 'baz', deeply: { nested: 'value' } };
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz', deeply: { set: 'stuff' } }],
      untouched: true,
    };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          ...object[path[0]][path[1]],
          ...value,
          deeply: {
            ...object[path[0]][path[1]].deeply,
            ...value.deeply,
          },
        },
      ],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const path = 'foo[0]';
    const value: any = { bar: 'baz' };
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should create a new object with the value merged at the nested array path', () => {
    const path = 'foo[0]';
    const value: any = { baz: 'quz' };
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          ...object[parsedPath[0]][parsedPath[1]],
          ...value,
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = merge(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should return the merged objects if the path is empty', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: unchanged.Unchangeable = { untouched: true };

    const result = merge(path, value, object);

    expect(result).toEqual({
      ...object,
      ...value,
    });
  });

  it('should return the value if the object is not cloneable', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: any = 123;

    const result = merge(path, value, object);

    expect(result).toBe(value);
  });
});

describe('mergeWith', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        value: object[path[0]],
      },
    });
  });

  it('should create a new object with the value merged at the simple array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo'];
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: {
        ...object[path[0]],
        value: object[path[0]],
      },
    });
  });

  it('should do nothing if the return from fun is falsy at the simple array path', () => {
    const fn = (value: any): boolean => !value;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should create a new object with the value set at the simple string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        value: object[path],
      },
    });
  });

  it('should create a new object with the value merged at the simple string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo';
    const object: unchanged.Unchangeable = {
      foo: { bar: 'nope', baz: 'quz' },
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: {
        ...object[path],
        value: object[path],
      },
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          value: object[path[0]][path[1]],
        },
      ],
    });
  });

  it('should create a new object with the value merged at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          ...object[path[0]][path[1]],
          value: object[path[0]][path[1]],
        },
      ],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          value: object[parsedPath[0]][parsedPath[1]],
        },
      ],
    });
  });

  it('should create a new object with the value merged at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [{ bar: 'baz' }],
      untouched: true,
    };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          ...object[parsedPath[0]][parsedPath[1]],
          value: object[parsedPath[0]][parsedPath[1]],
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [
        {
          value: undefined,
        },
      ],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [
        {
          value: undefined,
        },
      ],
    });
  });

  it('should return the merged objects if the path is empty', () => {
    const fn = (value: any): object => ({
      value,
    });
    const path: any[] = [];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).toEqual({
      ...object,
      value: object,
    });
  });

  it('should return the original objects if the path is empty and the fn returns falsy', () => {
    const fn = (value: any): any => null;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = mergeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => mergeWith(fn, path, object)).toThrowError();
  });

  it('should return the value returned by fn if the object is not cloneable', () => {
    const fn = (value: any): any => null;
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: any = 123;

    const result = mergeWith(fn, path, object);

    expect(result).toBe(null);
  });
});

describe('not', () => {
  it('should return false with the value matching at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path[0]];

    const result = not(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = not(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object[path];

    const result = not(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = not(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = object[path[0]][path[1]];

    const result = not(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'quz';

    const result = not(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const parsedPath = parse(path);

    const value: any = object[parsedPath[0]][parsedPath[1]];

    const result = not(path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'quz';

    const result = not(path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false if the path is empty and the value matches', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = object;

    const result = not(path, value, object);

    expect(result).toBe(false);
  });

  it('should return true if the path is empty and the value does not match', () => {
    const path: any[] = [];
    const object: any = null;
    const value: any = undefined;

    const result = not(path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the simple array path', () => {
    const path = ['foo'];
    const object = {};
    const value = 'bar';

    const result = not(path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = not(path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = not(path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = not(path, value, object);

    expect(result).toBe(true);
  });
});

describe('notWith', () => {
  it('should return false with the value matching at the simple array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the simple array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the simple string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the simple string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'baz';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the nested array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the nested array path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };
    const value: any = 'quz';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false with the value matching at the nested string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(false);
  });

  it('should return true with the value not matching at the nested string path', () => {
    const fn = (value: any): boolean =>
      value === 'bar' ? 'blah' : value;
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
    };

    const value: any = 'quz';

    const result = notWith(fn, path, value, object);

    expect(result).toEqual(true);
  });

  it('should return false if the path is empty and the value matches', () => {
    const fn = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar' };
    const value: any = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should return true if the path is empty and the value does not match', () => {
    const fn = (value: any): boolean =>
      value && value.foo === 'bar' ? 'blah' : value;
    const path: any[] = [];
    const object: any = null;
    const value = 'blah';

    const result = notWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = notWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    const result = notWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return true if no match at the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = notWith(fn, path, value, object);

    expect(result).toBe(true);
  });

  it('should return false if no match at the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [],
    };
    const value: any = 'baz';

    const result = isWith(fn, path, value, object);

    expect(result).toBe(false);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};
    const value: any = 'bar';

    expect(() => isWith(fn, path, value, object)).toThrowError();
  });
});

describe('remove', () => {
  it('should remove the key from the object in the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = remove(path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      bar: 'baz',
    });
  });

  it('should remove the key from the object in the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = remove(path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      bar: 'baz',
    });
  });

  it('should remove the key from the object in the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = remove(path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      foo: ['quz'],
      bar: 'baz',
    });
  });

  it('should remove the key from the object in the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = remove(path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      foo: ['quz'],
      bar: 'baz',
    });
  });

  it('should return the object if no match found in the simple array path', () => {
    const path = ['foo'];
    const object: unchanged.Unchangeable = { bar: 'baz' };

    const result = remove(path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the simple string path', () => {
    const path = 'foo';
    const object: unchanged.Unchangeable = { bar: 'baz' };

    const result = remove(path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the nested array path', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { foo: [], bar: 'baz' };

    const result = remove(path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the nested string path', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = { foo: [], bar: 'baz' };

    const result = remove(path, object);

    expect(result).toBe(object);
  });

  it('should return a new empty object if the path is empty', () => {
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = remove(path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({});
  });
});

describe('removeWith', () => {
  it('should remove the key from the object if fn returns truthy in the simple array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      bar: 'baz',
    });
  });

  it('should return the object if fn returns falsy in the simple array path', () => {
    const fn = (value: any) => value === 'baz';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should remove the key from the object if fn returns truthy in the simple string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      bar: 'baz',
    });
  });

  it('should return the object if fn returns falsy in the simple string path', () => {
    const fn = (value: any) => value === 'baz';
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should remove the key from the object if fn returns truthy in the nested array path', () => {
    const fn = (value: any) => value === 'bar';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      foo: ['quz'],
      bar: 'baz',
    });
  });

  it('should return the object if fn returns falsy in the nested array path', () => {
    const fn = (value: any) => value === 'baz';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should remove the key from the object if fn returns truthy in the nested string path', () => {
    const fn = (value: any) => value === 'bar';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      foo: ['quz'],
      bar: 'baz',
    });
  });

  it('should return the object if fn returns falsy in the nested string path', () => {
    const fn = (value: any) => value === 'baz';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = { foo: ['bar', 'quz'], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the simple array path', () => {
    const fn = (value: any) => value === 'baz';
    const path = ['foo'];
    const object: unchanged.Unchangeable = { bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the simple string path', () => {
    const fn = (value: any) => value === 'baz';
    const path = 'foo';
    const object: unchanged.Unchangeable = { bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the nested array path', () => {
    const fn = (value: any) => value === 'baz';
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { foo: [], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should return the object if no match found in the nested string path', () => {
    const fn = (value: any) => value === 'baz';
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = { foo: [], bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should return a new empty object if fn returns truthy and the path is empty', () => {
    const fn = <T extends any>(value: T): T => value;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({});
  });

  it('should return the object if fn returns falsy and the path is empty', () => {
    const fn = (value: any) => Array.isArray(value);
    const path: any[] = [];
    const object: unchanged.Unchangeable = { foo: 'bar', bar: 'baz' };

    const result = removeWith(fn, path, object);

    expect(result).toBe(object);
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => removeWith(fn, path, object)).toThrowError();
  });
});

describe('set', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const path = ['foo'];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = set(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: value,
    });
  });

  it('should create a new object with the value set at the simple string path', () => {
    const path = 'foo';
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = set(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: value,
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = set(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const path = 'foo[0]';
    const value: any = 'new value';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = set(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = set(path, value, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [value],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const path = ['foo', 0];
    const value: any = 'new value';
    const object: unchanged.Unchangeable = { untouched: true };

    const result = set(path, value, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [value],
    });
  });

  it('should return the value passed if the path is empty', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object: unchanged.Unchangeable = { untouched: true };

    const result = set(path, value, object);

    expect(result).toBe(value);
  });
});

describe('setWith', () => {
  it('should create a new object with the value set at the simple array path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = ['foo'];
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: `--${object[path[0]]}--`,
    });
  });

  it('should create a new object with the value set at the simple string path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: `--${object[path]}--`,
    });
  });

  it('should create a new object with the value set at the nested array path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: [`--${object[path[0]][path[1]]}--`],
    });
  });

  it('should create a new object with the value set at the nested string path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: ['bar'],
      untouched: true,
    };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: [`--${object[parsedPath[0]][parsedPath[1]]}--`],
    });
  });

  it('should create a new object with the value created at the nested array path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path[0]]: ['--undefined--'],
    });
  });

  it('should create a new object with the value created at the nested string path', () => {
    const fn = (value: string): string => `--${value}--`;
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = setWith(fn, path, object);

    expect(result).not.toBe(object);

    const parsedPath = parse(path);

    expect(result).toEqual({
      ...object,
      [parsedPath[0]]: ['--undefined--'],
    });
  });

  it('should return the value passed if the path is empty', () => {
    const fn = (value: { untouched: boolean }): string =>
      `--${value.untouched}--`;
    const path: any[] = [];
    const object: unchanged.Unchangeable = { untouched: true };

    const result = setWith(fn, path, object);

    expect(result).toBe('--true--');
  });

  it('should throw if the function passed is not a function', () => {
    const fn: any = null;
    const path = ['foo'];
    const object: unchanged.Unchangeable = {};

    expect(() => setWith(fn, path, object)).toThrowError();
  });

  it('should create a new object with the value set at the simple string path based on extra arguments', () => {
    const fn = (ignoredValue: string, actualValue: string): string => `--${actualValue}--`;
    const path = 'foo';
    const object: unchanged.Unchangeable = { foo: 'bar', untouched: true };
    const extra = 'extra';

    const result = setWith(fn, path, object, extra);

    expect(result).not.toBe(object);
    expect(result).toEqual({
      ...object,
      [path]: `--${extra}--`,
    });
  });

});
