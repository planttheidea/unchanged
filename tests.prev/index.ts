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
    const fn = (value: { untouched: boolean }): string => `--${value.untouched}--`;
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
