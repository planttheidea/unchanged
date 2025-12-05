/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import type { Mock } from 'vitest';
import { describe, expect, vi, test } from 'vitest';
import { call, get, getOr, has, is, not, set } from '../src/index.js';

describe('call', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], getObject: (fn: Mock) => ({ foo: fn }) },
    {
      type: 'simple array path with the custom context value',
      path: ['foo'],
      getObject: (fn: Mock) => ({ foo: fn }),
      context: { iam: 'context' },
    },
    { type: 'simple string path', path: 'foo', getObject: (fn: Mock) => ({ foo: fn }) },
    { type: 'nested array path', path: ['foo', 0], getObject: (fn: Mock) => ({ foo: [fn] }) },
    { type: 'nested string path', path: 'foo[0]', getObject: (fn: Mock) => ({ foo: [fn] }) },
  ])('calls the function at the $type', ({ path, getObject, context }) => {
    const returned = { returned: 'value' };
    const fn = vi.fn(function (this: any, _string: string, _number: number, _object: object) {
      if (this) {
        expect(this).toBe(context);
      }
      return returned;
    });
    const args = ['foo', 123, {}];
    const object = getObject(fn);

    const resultStandard = call(path, args, object, context);

    expect(resultStandard).toBe(returned);
    expect(fn).toHaveBeenCalledWith(...args);

    fn.mockClear();

    const resultPartialPath = call(path)(args, object, context);

    expect(resultPartialPath).toBe(returned);
    expect(fn).toHaveBeenCalledWith(...args);

    fn.mockClear();

    const resultPartialArgs = call(path, args)(object, context);

    expect(resultPartialArgs).toBe(returned);
    expect(fn).toHaveBeenCalledWith(...args);

    fn.mockClear();

    const resultCurried = call(path)(args)(object, context);

    expect(resultCurried).toBe(returned);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], getObject: (fn: Mock) => ({ bar: fn }) },
    {
      type: 'simple array path with the custom context value',
      path: ['foo'],
      getObject: (fn: Mock) => ({ bar: fn }),
      context: { iam: 'context' },
    },
    { type: 'simple string path', path: 'foo', getObject: (fn: Mock) => ({ bar: fn }) },
    { type: 'nested array path', path: ['foo', 0], getObject: (fn: Mock) => ({ bar: [fn] }) },
    { type: 'nested string path', path: 'foo[0]', getObject: (fn: Mock) => ({ bar: [fn] }) },
  ])('returns undefined if no match found at $type', ({ path, getObject, context }) => {
    const fn = vi.fn(function (this: any, _string: string, _number: number, _object: object) {
      throw Error('boom');
    });
    const args = ['foo', 123, {}];
    const object = getObject(fn);

    const resultStandard = call(path, args, object, context);

    expect(resultStandard).toBe(undefined);
    expect(fn).not.toHaveBeenCalled();

    const resultPartialPath = call(path)(args, object, context);

    expect(resultPartialPath).toBe(undefined);
    expect(fn).not.toHaveBeenCalled();

    const resultPartialArgs = call(path, args)(object, context);

    expect(resultPartialArgs).toBe(undefined);
    expect(fn).not.toHaveBeenCalled();

    const resultCurried = call(path)(args)(object, context);

    expect(resultCurried).toBe(undefined);
  });

  test.each([
    { type: 'null', path: null },
    { type: 'null with the custom context value', path: null, context: { iam: 'context' } },
    { type: 'empty array', path: [] },
  ])('calls the object if the path is empty an the object is a function', ({ path, context }) => {
    const returned = { returned: 'value' };
    const args = ['foo', 123, {}];
    const object = vi.fn(function (this: any, _string: string, _number: number, _object: object) {
      if (this) {
        expect(this).toBe(context);
      }
      return returned;
    });

    const resultStandard = call(path, args, object, context);

    expect(resultStandard).toBe(returned);
    expect(object).toHaveBeenCalledWith(...args);

    object.mockClear();

    const resultPartialPath = call(path)(args, object, context);

    expect(resultPartialPath).toBe(returned);
    expect(object).toHaveBeenCalledWith(...args);

    object.mockClear();

    const resultPartialArgs = call(path, args)(object, context);

    expect(resultPartialArgs).toBe(returned);
    expect(object).toHaveBeenCalledWith(...args);

    object.mockClear();

    const resultCurried = call(path)(args)(object, context);

    expect(resultCurried).toBe(returned);
  });

  test.each([
    { type: 'null', path: null },
    { type: 'null with the custom context value', path: null, context: { iam: 'context' } },
    { type: 'empty array', path: [] },
  ])('returns undefined if the path is empty an the object is not a function', ({ path, context }) => {
    const args = ['foo', 123, {}];
    const object = 'boink' as any;

    const resultStandard = call(path, args, object, context);

    expect(resultStandard).toBe(undefined);

    const resultPartialPath = call(path)(args, object, context);

    expect(resultPartialPath).toBe(undefined);

    const resultPartialArgs = call(path, args)(object, context);

    expect(resultPartialArgs).toBe(undefined);

    const resultCurried = call(path)(args)(object, context);

    expect(resultCurried).toBe(undefined);
  });

  test('returns if the path is empty and the object is not function', () => {
    const path: any[] = [];
    const parameters: any[] = [123, null];
    const object: any = null;

    const result = call(path, parameters, object);

    expect(result).toBe(undefined);
  });
});

describe('get', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], object: { foo: 'bar' }, expected: 'bar' },
    { type: 'simple string path', path: 'foo', object: { foo: 'bar' }, expected: 'bar' },
    { type: 'nested array path', path: ['foo', 0], object: { foo: ['bar'] }, expected: 'bar' },
    { type: 'nested string path', path: 'foo[0]', object: { foo: ['bar'] }, expected: 'bar' },
  ])('gets the value at the $type', ({ path, object, expected }) => {
    const resultStandard = get(path, object);

    expect(resultStandard).toEqual(expected);

    const resultCurried = get(path)(object);

    expect(resultCurried).toEqual(expected);
  });

  test.each([
    { type: 'null', path: null, object: { foo: 'bar' } },
    { type: 'empty array', path: [], object: { foo: 'bar' } },
  ])('returns the object itself if the empty path is $type', ({ path, object }) => {
    const resultStandard = get(path, object);

    expect(resultStandard).toBe(object);

    const resultCurried = get(path)(object);

    expect(resultCurried).toBe(object);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], object: { bar: 'baz' } },
    { type: 'simple strng path', path: 'foo', object: { bar: 'baz' } },
    { type: 'nested array path', path: ['foo', 0], object: { bar: ['baz'] } },
    { type: 'nested string path', path: 'foo[0]', object: { bar: ['baz'] } },
  ])('returns undefined if no match at the $type', ({ path, object }) => {
    const resultStandard = get(path, object);

    expect(resultStandard).toBe(undefined);

    const resultCurried = get(path)(object);

    expect(resultCurried).toBe(undefined);
  });
});

describe('getOr', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], object: { foo: 'bar' }, expected: 'bar', fallback: 'fallback' },
    { type: 'simple string path', path: 'foo', object: { foo: 'bar' }, expected: 'bar', fallback: 'fallback' },
    { type: 'nested array path', path: ['foo', 0], object: { foo: ['bar'] }, expected: 'bar', fallback: 'fallback' },
    { type: 'nested string path', path: 'foo[0]', object: { foo: ['bar'] }, expected: 'bar', fallback: 'fallback' },
  ])('gets the matched value at the $type', ({ path, object, expected, fallback }) => {
    const resultStandard = getOr(fallback, path, object);

    expect(resultStandard).toEqual(expected);

    const resultPartialFallback = getOr(fallback)(path, object);

    expect(resultPartialFallback).toEqual(expected);

    const resultPartialObject = getOr(fallback, path)(object);

    expect(resultPartialObject).toEqual(expected);

    const resultCurried = getOr(fallback, path, object);

    expect(resultCurried).toEqual(expected);
  });

  test.each([
    { type: 'null', path: null, object: { foo: 'bar' }, fallback: 'fallback' },
    { type: 'empty array', path: [], object: { foo: 'bar' }, fallback: 'fallback' },
  ])('returns the object itself if the empty path is $type', ({ path, object, fallback }) => {
    const resultStandard = getOr(fallback, path, object);

    expect(resultStandard).toBe(object);

    const resultPartialFallback = getOr(fallback)(path, object);

    expect(resultPartialFallback).toBe(object);

    const resultPartialObject = getOr(fallback, path)(object);

    expect(resultPartialObject).toBe(object);

    const resultCurried = getOr(fallback, path, object);

    expect(resultCurried).toBe(object);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], object: { bar: 'baz' }, fallback: 'fallback' },
    { type: 'simple strng path', path: 'foo', object: { bar: 'baz' }, fallback: 'fallback' },
    { type: 'nested array path', path: ['foo', 0], object: { bar: ['baz'] }, fallback: 'fallback' },
    { type: 'nested string path', path: 'foo[0]', object: { bar: ['baz'] }, fallback: 'fallback' },
  ])('returns undefined if no match at the $type', ({ path, object, fallback }) => {
    const resultStandard = getOr(fallback, path, object);

    expect(resultStandard).toBe(fallback);

    const resultPartialFallback = getOr(fallback)(path, object);

    expect(resultPartialFallback).toEqual(fallback);

    const resultPartialObject = getOr(fallback, path)(object);

    expect(resultPartialObject).toBe(fallback);

    const resultCurried = getOr(fallback)(path)(object);

    expect(resultCurried).toBe(fallback);
  });
});

describe('has', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], object: { foo: 'bar' } },
    { type: 'simple string path', path: 'foo', object: { foo: 'bar' } },
    { type: 'nested array path', path: ['foo', 0], object: { foo: ['bar'] } },
    { type: 'nested string path', path: 'foo[0]', object: { foo: ['bar'] } },
  ])('returns true if matched at the $type', ({ path, object }) => {
    const resultStandard = has(path, object);

    expect(resultStandard).toEqual(true);

    const resultCurried = has(path)(object);

    expect(resultCurried).toEqual(true);
  });

  test.each([
    { type: 'null', path: null, object: { foo: 'bar' } },
    { type: 'empty array', path: [], object: { foo: 'bar' } },
  ])('returns true if the empty path is $type', ({ path, object }) => {
    const resultStandard = has(path, object);

    expect(resultStandard).toBe(true);

    const resultCurried = has(path)(object);

    expect(resultCurried).toBe(true);
  });

  test.each([
    { type: 'null', path: null, object: null },
    { type: 'null', path: null, object: undefined },
    { type: 'empty array', path: [], object: null },
    { type: 'empty array', path: [], object: undefined },
  ])('returns false if the empty path is $type but the object is nullish', ({ path, object }) => {
    const resultStandard = has(path, object);

    expect(resultStandard).toBe(false);

    const resultCurried = has(path)(object);

    expect(resultCurried).toBe(false);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], object: { bar: 'baz' } },
    { type: 'simple strng path', path: 'foo', object: { bar: 'baz' } },
    { type: 'nested array path', path: ['foo', 0], object: { bar: ['baz'] } },
    { type: 'nested string path', path: 'foo[0]', object: { bar: ['baz'] } },
  ])('returns false if no match at the $type', ({ path, object }) => {
    const resultStandard = has(path, object);

    expect(resultStandard).toBe(false);

    const resultCurried = has(path)(object);

    expect(resultCurried).toBe(false);
  });
});

describe('is', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], object: { foo: 'bar' }, value: 'bar' },
    { type: 'simple strng path', path: 'foo', object: { foo: 'bar' }, value: 'bar' },
    { type: 'nested array path', path: ['foo', 0], object: { foo: ['bar'] }, value: 'bar' },
    { type: 'nested string path', path: 'foo[0]', object: { foo: ['bar'] }, value: 'bar' },
  ])('returns true when the value matches at the $type', ({ path, object, value }) => {
    const resultStandard = is(value, path, object);

    expect(resultStandard).toBe(true);

    const resultPartialValue = is(value)(path, object);

    expect(resultPartialValue).toBe(true);

    const resultPartialObject = is(value, path)(object);

    expect(resultPartialObject).toBe(true);

    const resultCurried = is(value)(path)(object);

    expect(resultCurried).toBe(true);
  });

  test.each([
    { type: 'null', path: null, object: { foo: 'bar' } },
    { type: 'empty array', path: [], object: { foo: 'bar' } },
  ])('returns true if the empty path is $type and the same ref', ({ path, object }) => {
    const resultStandard = is(object, path, object);

    expect(resultStandard).toBe(true);

    const resultPartialValue = is(object)(path, object);

    expect(resultPartialValue).toBe(true);

    const resultPartialObject = is(object, path)(object);

    expect(resultPartialObject).toBe(true);

    const resultCurried = is(object)(path)(object);

    expect(resultCurried).toBe(true);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], object: { bar: 'baz' }, value: 'bar' },
    { type: 'simple strng path', path: 'foo', object: { bar: 'baz' }, value: 'bar' },
    { type: 'nested array path', path: ['foo', 0], object: { bar: ['baz'] }, value: 'bar' },
    { type: 'nested string path', path: 'foo[0]', object: { bar: ['baz'] }, value: 'bar' },
  ])('returns false when the value does not match at the $type', ({ path, object, value }) => {
    const resultStandard = is(value, path, object);

    expect(resultStandard).toBe(false);

    const resultPartialValue = is(value)(path, object);

    expect(resultPartialValue).toBe(false);

    const resultPartialObject = is(value, path)(object);

    expect(resultPartialObject).toBe(false);

    const resultCurried = is(value)(path)(object);

    expect(resultCurried).toBe(false);
  });
});

describe('not', () => {
  test.each([
    { type: 'simple array path', path: ['foo'], object: { foo: 'bar' }, value: 'bar' },
    { type: 'simple strng path', path: 'foo', object: { foo: 'bar' }, value: 'bar' },
    { type: 'nested array path', path: ['foo', 0], object: { foo: ['bar'] }, value: 'bar' },
    { type: 'nested string path', path: 'foo[0]', object: { foo: ['bar'] }, value: 'bar' },
  ])('returns false when the value matches at the $type', ({ path, object, value }) => {
    const resultStandard = not(value, path, object);

    expect(resultStandard).toBe(false);

    const resultPartialValue = not(value)(path, object);

    expect(resultPartialValue).toBe(false);

    const resultPartialObject = not(value, path)(object);

    expect(resultPartialObject).toBe(false);

    const resultCurried = not(value)(path)(object);

    expect(resultCurried).toBe(false);
  });

  test.each([
    { type: 'null', path: null, object: { foo: 'bar' } },
    { type: 'empty array', path: [], object: { foo: 'bar' } },
  ])('returns false if the empty path is $type and the same ref', ({ path, object }) => {
    const resultStandard = not(object, path, object);

    expect(resultStandard).toBe(false);

    const resultPartialValue = not(object)(path, object);

    expect(resultPartialValue).toBe(false);

    const resultPartialObject = not(object, path)(object);

    expect(resultPartialObject).toBe(false);

    const resultCurried = not(object)(path)(object);

    expect(resultCurried).toBe(false);
  });

  test.each([
    { type: 'simple array path', path: ['foo'], object: { bar: 'baz' }, value: 'bar' },
    { type: 'simple strng path', path: 'foo', object: { bar: 'baz' }, value: 'bar' },
    { type: 'nested array path', path: ['foo', 0], object: { bar: ['baz'] }, value: 'bar' },
    { type: 'nested string path', path: 'foo[0]', object: { bar: ['baz'] }, value: 'bar' },
  ])('returns true when the value does not match at the $type', ({ path, object, value }) => {
    const resultStandard = not(value, path, object);

    expect(resultStandard).toBe(true);

    const resultPartialValue = not(value)(path, object);

    expect(resultPartialValue).toBe(true);

    const resultPartialObject = not(value, path)(object);

    expect(resultPartialObject).toBe(true);

    const resultCurried = not(value)(path)(object);

    expect(resultCurried).toBe(true);
  });
});

describe.only('set', () => {
  const setExisting = [
    {
      type: 'existing simple array path',
      path: ['foo'],
      object: { foo: 'bar', untouched: true },
      value: 'new',
      expected: { foo: 'new', untouched: true },
    },
    {
      type: 'existing simple strng path',
      path: 'foo',
      object: { foo: 'bar', untouched: true },
      value: 'new',
      expected: { foo: 'new', untouched: true },
    },
    {
      type: 'existing nested array path',
      path: ['foo', 0],
      object: { foo: ['bar'], untouched: true },
      value: 'new',
      expected: { foo: ['new'], untouched: true },
    },
    {
      type: 'existing nested string path',
      path: 'foo[0]',
      object: { foo: ['bar'], untouched: true },
      value: 'new',
      expected: { foo: ['new'], untouched: true },
    },
    {
      type: 'new simple array path',
      path: ['foo'],
      object: { untouched: true },
      value: 'new',
      expected: { foo: 'new', untouched: true },
    },
    {
      type: 'new simple strng path',
      path: 'foo',
      object: { untouched: true },
      value: 'new',
      expected: { foo: 'new', untouched: true },
    },
    {
      type: 'new nested array path',
      path: ['foo', 0],
      object: { untouched: true },
      value: 'new',
      expected: { foo: ['new'], untouched: true },
    },
    {
      type: 'new nested string path',
      path: 'foo[0]',
      object: { untouched: true },
      value: 'new',
      expected: { foo: ['new'], untouched: true },
    },
  ] as const;

  test.each(setExisting)('sets the value matching at the $type (standard)', ({ path, object, value, expected }) => {
    const resultStandard = set(value, path, object);

    expect(resultStandard).toEqual(expected);
  });

  test.each(setExisting)(
    'sets the value matching at the $type (partial value)',
    ({ path, object, value, expected }) => {
      const resultPartialValue = set(value)(path, object);

      expect(resultPartialValue).toEqual(expected);
    },
  );

  test.each(setExisting)(
    'sets the value matching at the $type (partial object)',
    ({ path, object, value, expected }) => {
      const resultPartialObject = set(value, path)(object);

      expect(resultPartialObject).toEqual(expected);
    },
  );

  test.each(setExisting)('sets the value matching at the $type (curried)', ({ path, object, value, expected }) => {
    const resultCurried = set(value)(path)(object);

    expect(resultCurried).toEqual(expected);
  });

  test('returns the value passed if the path is empty', () => {
    const path: any[] = [];
    const value: any = { foo: 'bar' };
    const object = { untouched: true };

    const result = set(value, path, object);

    expect(result).toBe(value);
  });
});
