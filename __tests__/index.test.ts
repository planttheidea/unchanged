/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { describe, expect, test } from 'vitest';
import { get, getOr, has, is, not } from '../src/index.js';

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

    const resultPartialObject = not(value, path)(object);

    expect(resultPartialObject).toBe(true);

    const resultCurried = not(value)(path)(object);

    expect(resultCurried).toBe(true);
  });
});
