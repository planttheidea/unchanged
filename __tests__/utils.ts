import { parse } from 'pathington';
import React from 'react';

import {
  assignFallback,
  callIfFunction,
  cloneArray,
  cloneIfPossible,
  createWithProto,
  getCoalescedValue,
  getDeepClone,
  getFullPath,
  getOwnProperties,
  getMergedObject,
  getValueAtPath,
  getCloneOrEmptyObject,
  getNewEmptyChild,
  getNewEmptyObject,
  getParsedPath,
  getShallowClone,
  isCloneable,
  isEmptyPath,
  isGlobalConstructor,
  isSameValueZero,
  getCloneAtPath,
  reduce,
  splice,
  throwInvalidFnError,
} from '../src/utils';

describe('assignFallback', () => {
  it('should return the target if no source exists', () => {
    const target = {};
    const source: any = null;

    const result = assignFallback(target, source);

    expect(result).toBe(target);
  });

  it('should shallowly merge the source into the target', () => {
    const symbol = Symbol('baz');
    const target = {
      foo: 'bar',
    };
    const source = {
      bar: 'baz',
      [symbol]: 'quz',
    };

    const result = assignFallback(target, source);

    expect(result).toEqual({
      ...target,
      ...source,
    });
  });
});

describe('callIfFunction', () => {
  it('should call the object if it is a function', () => {
    const object = jest.fn().mockReturnValue('returned');
    const context = {};
    const parameters = ['foo', 123];

    const result = callIfFunction(object, context, parameters);

    expect(result).toBe('returned');
    expect(object).toBeCalledTimes(1);
    expect(object).toBeCalledWith(...parameters);
  });

  it('should do nothing if the object is not a function', () => {
    const object = 'foo';
    const context = {};
    const parameters = ['foo', 123];

    const result = callIfFunction(object, context, parameters);

    expect(result).toBe(undefined);
  });
});

describe('cloneArray', () => {
  it('should clone the contents of the array into a new array', () => {
    const array: any[] = ['foo', 123, Symbol('bar'), { baz: 'quz' }, []];

    const result = cloneArray(array);

    expect(result).not.toBe(array);
    expect(result).toEqual(array);
  });
});

describe('cloneIfPossible', () => {
  it('should clone the object if it is cloneable', () => {
    const object = { foo: 'bar' };

    const result = cloneIfPossible(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should not clone the object if it is not cloneable', () => {
    const object = React.createElement('div', {});

    const result = cloneIfPossible(object);

    expect(result).toBe(object);
  });
});

describe('createWithProto', () => {
  it('should clone the object with a custom prototype', () => {
    class Foo {
      value: any;

      constructor(value: any) {
        this.value = value;
      }
    }

    const object = new Foo('bar');

    const result = createWithProto(object);

    expect(result instanceof Foo).toBe(true);
  });

  it('should clone the pure object with a null prototype', () => {
    const object = Object.create(null);

    const result = createWithProto(object);

    expect(result.__proto__).toBe(undefined);
    expect(Object.getPrototypeOf(result)).toBe(null);
  });
});

describe('getCoalescedValue', () => {
  it('should return the fallback value if undefined', () => {
    const value: any = undefined;
    const fallbackValue = 123;

    const result = getCoalescedValue(value, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the value if not undefined', () => {
    const value: null = null;
    const fallbackValue = 123;

    const result: null = getCoalescedValue(value, fallbackValue);

    expect(result).toBe(value);
  });
});

describe('getDeepClone', () => {
  it('should create a deep clone on the object at the simple path specified', () => {
    const value = 'value';

    const path = 'deeply';
    const object = {
      untouched: {
        existing: 'value',
      },
    };
    const callback = jest.fn().mockImplementation((ref: unchanged.Unchangeable, key: string) => {
      expect(ref).toEqual(object);
      expect(key).toEqual(path);

      ref[key] = value;
    });

    const result = getDeepClone(path, object, callback);

    expect(callback).toBeCalledTimes(1);

    expect(result).toEqual({
      ...object,
      deeply: value,
    });
  });

  it('should create a deep clone on the object at the deep path specified', () => {
    const value = 'value';

    const path = 'deeply[0].nested';
    const object = {
      untouched: {
        existing: 'value',
      },
    };
    const callback = jest.fn().mockImplementation((ref: unchanged.Unchangeable, key: string) => {
      expect(ref).toEqual({});
      expect(key).toEqual(path.split('.')[1]);

      ref[key] = value;
    });

    const result = getDeepClone(path, object, callback);

    expect(callback).toBeCalledTimes(1);

    expect(result).toEqual({
      ...object,
      deeply: [
        {
          nested: value,
        },
      ],
    });
  });

  it('should create a deep clone on a new object if not present at the path specified', () => {
    const value = 'value';

    const path = 'deeply[0].nested';
    const object: any = null;
    const callback = jest.fn().mockImplementation((ref: unchanged.Unchangeable, key: string) => {
      expect(ref).toEqual({});
      expect(key).toEqual(path.split('.')[1]);

      ref[key] = value;
    });

    const result = getDeepClone(path, object, callback);

    expect(callback).toBeCalledTimes(1);

    expect(result).toEqual({
      deeply: [
        {
          nested: value,
        },
      ],
    });
  });
});

describe('getFullPath', () => {
  it('should return the added index if both path and value are arrays', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(['foo', 0, 0]);
  });

  it('should return the added index if path is a string and value is an array', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('foo[0][0]');
  });

  it('should return the added index if path is an array and value is not', () => {
    const path = ['foo', 'bar'];
    const object = {
      foo: {},
    };
    const fn: any = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(path);
  });

  it('should return the added index if path is null and value is an array', () => {
    const path: any = null;
    const object: any[] = [];
    const fn: any = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('[0]');
  });

  it('should return the added index if both path and value returned from fn are arrays', () => {
    const path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(['foo', 0, 0]);
  });

  // tslint:disable-next-line max-line-length
  it('should return the added index if path is a string and value returned from fn is an array', () => {
    const path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('foo[0][0]');
  });

  it('should return the added index if path is an array and value returned from fn is not', () => {
    const path = ['foo', 'bar'];
    const object = {
      foo: {},
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(path);
  });

  // tslint:disable-next-line max-line-length
  it('should return the added index if path is an empty string and value returned from fn is an array', () => {
    const path: any = null;
    const object: any[] = [];
    const fn: any = <T extends any>(value: T): T => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('[0]');
  });
});

describe('getOwnProperties', () => {
  it('should get all keys and symbols in the object passed', () => {
    const symbol = Symbol('baz');
    const object = {
      foo: 'bar',
      bar: 'baz',
      [symbol]: 'quz',
    };

    const result = getOwnProperties(object);

    const keys = Object.keys(object);

    expect(result).toEqual(keys.concat([(symbol as unknown) as string]));
  });

  it('should get only keys if no symbols in the object passed exist', () => {
    const object = {
      foo: 'bar',
      bar: 'baz',
    };

    const result = getOwnProperties(object);

    expect(result).toEqual(Object.keys(object));
  });

  it('should get only get enumerable symbols in the object passed', () => {
    const symbol = Symbol('baz');
    const object = {
      foo: 'bar',
      bar: 'baz',
      [symbol]: 'quz',
    };

    Object.defineProperty(object, Symbol('quz'), {
      value: 'blah',
    });

    const result = getOwnProperties(object);

    const keys = Object.keys(object);

    expect(result).toEqual(keys.concat([(symbol as unknown) as string]));
  });
});

describe('getMergedObject', () => {
  it('should shallowly clone the second object if the objects are different types', () => {
    const object1: object = { key: 'value' };
    const object2 = ['key', 'value'];
    const isDeep: boolean = false;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(object2);
  });

  it('should deeply clone the second object if the objects are different types', () => {
    const object1: object = { key: 'value' };
    const object2 = ['key', 'value'];
    const isDeep: boolean = true;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(object2);
  });

  it('should merge the arrays if both objects are arrays and is not deep merge', () => {
    const object1 = ['one'];
    const object2 = ['two'];
    const isDeep: boolean = false;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual([...object1, ...object2]);

    expect(result[0]).toStrictEqual(object1[0]);
    expect(result[1]).toStrictEqual(object2[0]);
  });

  it('should merge the arrays if both objects are arrays and is deep merge', () => {
    const object1 = ['one'];
    const object2 = ['two'];
    const isDeep: boolean = true;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual([...object1, ...object2]);

    expect(result[0]).toStrictEqual(object1[0]);
    expect(result[1]).toStrictEqual(object2[0]);
  });

  it('should merge the objects if both objects are objects and is not deep merge', () => {
    const object1: { date: { willBe: string }; deep: { key: string } } = {
      date: { willBe: 'overwritten' },
      deep: { key: 'value' },
    };
    const object2: {
      date: Date;
      deep: { otherKey: string };
      untouched: string;
    } = {
      date: new Date(),
      deep: { otherKey: 'otherValue' },
      untouched: 'value',
    };
    const isDeep = false;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual({
      date: object2.date,
      deep: object2.deep,
      untouched: object2.untouched,
    });
  });

  it('should merge the objects if both objects are objects and is deep merge', () => {
    const object1: { date: { willBe: string }; deep: { key: string } } = {
      date: { willBe: 'overwritten' },
      deep: { key: 'value' },
    };
    const object2: {
      date: Date;
      deep: { otherKey: string };
      untouched: string;
    } = {
      date: new Date(),
      deep: { otherKey: 'otherValue' },
      untouched: 'value',
    };
    const isDeep: boolean = true;

    const result = getMergedObject(object1, object2, isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual({
      date: object2.date,
      deep: {
        ...object1.deep,
        ...object2.deep,
      },
      untouched: object2.untouched,
    });
  });

  it('should merge the objects if the objects are custom objects and is not deep merge', () => {
    class Foo {
      value: any;
      [key: string]: any;

      constructor(value: any) {
        if (value && value.constructor === Object) {
          return Object.keys(value).reduce((reduced: Foo, key) => {
            const deepValue =
              value[key] && value[key].constructor === Object ? new Foo(value[key]) : value[key];

            if (reduced[key]) {
              reduced[key].value = deepValue;
            } else {
              reduced[key] = {
                value: deepValue,
              };
            }

            return reduced;
          },                               this);
        }

        this.value = value;

        return this;
      }
    }

    const object1: { date: { willBe: string }; deep: { key: string } } = {
      date: { willBe: 'overwritten' },
      deep: { key: 'value' },
    };
    const object2: {
      date: Date;
      deep: { otherKey: string };
      untouched: string;
    } = {
      date: new Date(),
      deep: { otherKey: 'otherValue' },
      untouched: 'value',
    };
    const isDeep: boolean = false;

    const result = getMergedObject(new Foo(object1), new Foo(object2), isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(
      new Foo({
        date: object2.date,
        deep: object2.deep,
        untouched: object2.untouched,
      }),
    );
  });

  it('should merge the objects if the objects are custom objects and is deep merge', () => {
    class Foo {
      value: any;
      [key: string]: any;

      constructor(value: any) {
        if (value && value.constructor === Object) {
          return Object.keys(value).reduce((reduced: Foo, key) => {
            const deepValue =
              value[key] && value[key].constructor === Object ? new Foo(value[key]) : value[key];

            if (reduced[key]) {
              reduced[key].value = deepValue;
            } else {
              reduced[key] = {
                value: deepValue,
              };
            }

            return reduced;
          },                               this);
        }

        this.value = value;

        return this;
      }
    }
    const object1: { date: { willBe: string }; deep: { key: string } } = {
      date: { willBe: 'overwritten' },
      deep: { key: 'value' },
    };
    const object2: {
      date: Date;
      deep: { otherKey: string };
      untouched: string;
    } = {
      date: new Date(),
      deep: { otherKey: 'otherValue' },
      untouched: 'value',
    };
    const isDeep: boolean = true;

    const result = getMergedObject(new Foo(object1), new Foo(object2), isDeep);

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(
      new Foo({
        date: object2.date,
        deep: {
          ...object1.deep,
          ...object2.deep,
        },
        untouched: object2.untouched,
      }),
    );
  });
});

describe('getValueAtPath', () => {
  it('should return the matching value when there is a simple path', () => {
    const path = 'path';
    const object = {
      [path]: 'value',
    };
    const fallbackValue: undefined = undefined;

    const result = getValueAtPath(path, object, fallbackValue);

    expect(result).toEqual(object[path]);
  });

  it('should return the matching value when there is a nested path', () => {
    const path = 'deeply.nested';
    const object = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue: undefined = undefined;

    const result = getValueAtPath(path, object, fallbackValue);

    expect(result).toEqual(object.deeply.nested);
  });

  it('should return undefined when the object does not exist', () => {
    const path = 'path';
    const object: any = null;
    const fallbackValue: undefined = undefined;

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(undefined);
  });

  it('should return the fallback when the object does not exist and a fallback is provided', () => {
    const path = 'path';
    const object: any = null;
    const fallbackValue = 'fallback';

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback when the object does not have a simple path match', () => {
    const path = 'nonexistent.nested';
    const object = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue = 'fallback';

    const result = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback when the object does not have a nested path match', () => {
    const path = 'deeply.nonexistent';
    const object = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue = 'fallback';

    const result = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });
});

describe('getCloneOrEmptyObject', () => {
  it('should get a shallow clone of the object if it is cloneable', () => {
    const object = { foo: 'bar' };
    const nextKey = 0;

    const result = getCloneOrEmptyObject(object, nextKey);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should get an empty object based on the next key if the object is not cloneable', () => {
    const object: RegExp = /foo/;
    const nextKey = 0;

    const result = getCloneOrEmptyObject(object, nextKey);

    expect(result).not.toBe(object);
    expect(result).toEqual([]);
  });
});

describe('getNewEmptyChild', () => {
  it('should return an array when the key is a number', () => {
    const key = 0;

    const result = getNewEmptyChild(key);

    expect(result).toEqual([]);
  });

  it('should return an object when the key is not a number', () => {
    const key = 'foo';

    const result = getNewEmptyChild(key);

    expect(result).toEqual({});
  });
});

describe('getNewEmptyObject', () => {
  it('should return an empty array if the object passed is an array', () => {
    const object: any[] = ['foo', 123];

    const result = getNewEmptyObject(object);

    expect(result).toEqual([]);
  });

  it('should return an empty object if the object passed is an object', () => {
    const object = { foo: 'bar' };

    const result = getNewEmptyObject(object);

    expect(result).toEqual({});
  });
});

describe('getParsedPath', () => {
  it('should return the path passed if an array', () => {
    const path = ['foo', (Symbol('bar') as unknown) as string];

    const result = getParsedPath(path);

    expect(result).toBe(path);
  });

  it('should return the path parsed as an array', () => {
    const path = 'foo[0]';

    const result = getParsedPath(path);

    expect(result).not.toBe(path);

    expect(result).toEqual(parse(path));
  });
});

describe('getShallowClone', () => {
  it('should return a shallow clone of the object if a plain object', () => {
    const object = { foo: 'bar' };

    const result = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return a shallow clone of the array if an array', () => {
    const object: any[] = ['foo', 123, Symbol('bar')];

    const result = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return an empty object if the object is a global constructor', () => {
    const object = RegExp;

    const result = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual({});
  });

  it('should return a shallow clone of the custom object when a custom object', () => {
    class Foo {
      value: any;

      constructor(value: any) {
        this.value = value;
      }
    }

    const object = new Foo('bar');

    const result = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return a shallow clone of the object if a pure object', () => {
    const object = Object.create(null);

    object.foo = 'bar';

    const result = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });
});

describe('isCloneable', () => {
  it('should return false if the object passed is falsy', () => {
    const object: null = null;

    const result = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is not of type object', () => {
    const object = true;

    const result = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a React element', () => {
    const object = React.createElement('div', {});

    const result = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a Date object', () => {
    const object: Date = new Date();

    const result = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a RegExp object', () => {
    const object: RegExp = /foo/;

    const result = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is cloneable', () => {
    const object = { foo: 'bar' };

    const result = isCloneable(object);

    expect(result).toBe(true);
  });
});

describe('isEmptyPath', () => {
  it('should return true if the object is undefined', () => {
    const object: undefined = undefined;

    const result = isEmptyPath(object);

    expect(result).toBe(true);
  });

  it('should return true if the object is null', () => {
    const object: null = null;

    const result = isEmptyPath(object);

    expect(result).toBe(true);
  });

  it('should return true if the object is an empty array', () => {
    const object: any[] = [];

    const result = isEmptyPath(object);

    expect(result).toBe(true);
  });

  it('should return true if the object is a populated array', () => {
    const object = ['foo'];

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is a string', () => {
    const object = 'foo';

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is a number', () => {
    const object = 0;

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });
});

describe('isGlobalConstructor', () => {
  it('should return false if the object passed is not a funtion', () => {
    const object = { foo: 'bar' };

    const result = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  it('should return false if the object passed is not a global funtion based on given name', () => {
    const object = function foo() {};

    expect(object.name).toBe('foo');

    const result = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  // tslint:disable-next-line max-line-length
  it('should return false if the object passed is not a global funtion based on derived name', () => {
    const object = function foo() {};

    // @ts-ignore
    delete object.name;

    expect(object.name).toBe('');

    const result = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  it('should return true if the object passed is a global funtion based on its given name', () => {
    const object = RegExp;

    expect(object.name).toBe('RegExp');

    const result = isGlobalConstructor(object);

    expect(result).toBe(true);
  });

  it('should return true if the object passed is a global funtion based on derived name', () => {
    const object = RegExp;

    // @ts-ignore
    delete object.name;

    expect(object.name).toBe('');

    const result = isGlobalConstructor(object);

    expect(result).toBe(true);
  });
});

describe('isSameValueZero', () => {
  it('will return true if values are strictly equal', () => {
    const value1 = { foo: 'bar' };
    const value2 = value1;

    const result = isSameValueZero(value1, value2);

    expect(result).toBe(true);
  });

  it('will return true if values are both NaN', () => {
    const value1 = NaN;
    const value2 = NaN;

    const result = isSameValueZero(value1, value2);

    expect(result).toBe(true);
  });

  it('will return false if values are not NaN and not strictly equal', () => {
    const value1 = { foo: 'bar' };
    const value2 = { foo: 'bar' };

    const result = isSameValueZero(value1, value2);

    expect(result).toBe(false);
  });
});

describe('getCloneAtPath', () => {
  it('should call onMatch and return the object based on a simple path', () => {
    const path = ['key'];
    const object = {
      [path[0]]: 'value',
      untouched: true,
    };
    const onMatch = jest.fn().mockImplementation((a, b) => {
      a[b] = 'new value';
    });

    const result = getCloneAtPath(path, object, onMatch, 0);

    expect(onMatch).toBeCalledTimes(1);
    expect(onMatch).toBeCalledWith(object, path[0]);

    expect(result).toEqual({
      ...object,
      [path[0]]: 'new value',
    });
  });

  it('should call onMatch and return the object based on a nested path', () => {
    const path = ['deeply', 'nested', 'key'];
    const object: unchanged.Unchangeable = {
      [path[0]]: {
        [path[1]]: {
          [path[2]]: 'value',
        },
      },
      untouched: true,
    };
    const onMatch = jest.fn().mockImplementation((a, b) => {
      a[b] = 'new value';
    });

    const result = getCloneAtPath(path, object, onMatch, 0);

    expect(onMatch).toBeCalledTimes(1);
    expect(onMatch).toBeCalledWith(object[path[0]][path[1]], path[2]);

    expect(result).toEqual({
      ...object,
      [path[0]]: {
        ...object[path[0]],
        [path[1]]: {
          ...object[path[1]],
          [path[2]]: 'new value',
        },
      },
    });
  });
});

describe('reduce', () => {
  it('should reduce the array to a new value', () => {
    const array: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const fn = (total: number, value: number) => total + value;
    const initialValue = 0;

    const result = reduce(array, fn, initialValue);

    expect(result).toEqual(55);
  });
});

describe('splice', () => {
  it('should mutatively remove the index specified from the array', () => {
    const array: any[] = ['foo', 123, {}, []];
    const splicedIndex = 1;

    const result: void = splice(array, splicedIndex);

    expect(result).toBe(undefined);
    expect(array).toEqual(['foo', {}, []]);
  });

  it('should do nothing when the array is empty', () => {
    const array: any[] = [];
    const splicedIndex = 1;

    const result: void = splice(array, splicedIndex);

    expect(result).toBe(undefined);
    expect(array).toEqual([]);
  });
});

describe('throwInvalidFnError', () => {
  it('should throw an error', () => {
    expect(() => throwInvalidFnError()).toThrowError();
  });
});
