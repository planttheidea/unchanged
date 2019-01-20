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
    const target: object = {};
    const source: null = null;

    const result: object = assignFallback(target, source);

    expect(result).toBe(target);
  });

  it('should shallowly merge the source into the target', () => {
    const symbol: symbol = Symbol('baz');
    const target: object = {
      foo: 'bar',
    };
    const source: object = {
      bar: 'baz',
      [symbol]: 'quz',
    };

    const result: object = assignFallback(target, source);

    expect(result).toEqual({
      ...target,
      ...source,
    });
  });
});

describe('callIfFunction', () => {
  it('should call the object if it is a function', () => {
    const object: Function = jest.fn().mockReturnValue('returned');
    const context: object = {};
    const parameters: any[] = ['foo', 123];

    const result: string = callIfFunction(object, context, parameters);

    expect(result).toBe('returned');
    expect(object).toBeCalledTimes(1);
    expect(object).toBeCalledWith(...parameters);
  });

  it('should do nothing if the object is not a function', () => {
    const object: string = 'foo';
    const context: object = {};
    const parameters: any[] = ['foo', 123];

    const result: void = callIfFunction(object, context, parameters);

    expect(result).toBe(undefined);
  });
});

describe('cloneArray', () => {
  it('should clone the contents of the array into a new array', () => {
    const array: any[] = ['foo', 123, Symbol('bar'), { baz: 'quz' }, []];

    const result: any[] = cloneArray(array);

    expect(result).not.toBe(array);
    expect(result).toEqual(array);
  });
});

describe('cloneIfPossible', () => {
  it('should clone the object if it is cloneable', () => {
    const object: object = { foo: 'bar' };

    const result: unchanged.Unchangeable = cloneIfPossible(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should not clone the object if it is not cloneable', () => {
    const object: object = React.createElement('div', {});

    const result: unchanged.Unchangeable = cloneIfPossible(object);

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

    const object: unchanged.Unchangeable = new Foo('bar');

    const result: unchanged.Unchangeable = createWithProto(object);

    expect(result instanceof Foo).toBe(true);
  });

  it('should clone the pure object with a null prototype', () => {
    const object: unchanged.Unchangeable = Object.create(null);

    const result: unchanged.Unchangeable = createWithProto(object);

    expect(result.__proto__).toBe(undefined);
    expect(Object.getPrototypeOf(result)).toBe(null);
  });
});

describe('getCoalescedValue', () => {
  it('should return the fallback value if undefined', () => {
    const value: void = undefined;
    const fallbackValue: number = 123;

    const result: number = getCoalescedValue(value, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the value if not undefined', () => {
    const value: null = null;
    const fallbackValue: number = 123;

    const result: null = getCoalescedValue(value, fallbackValue);

    expect(result).toBe(value);
  });
});

describe('getDeepClone', () => {
  it('should create a deep clone on the object at the simple path specified', () => {
    const value: string = 'value';

    const path: unchanged.Path = 'deeply';
    const object: unchanged.Unchangeable = {
      untouched: {
        existing: 'value',
      },
    };
    const callback = jest
      .fn()
      .mockImplementation((ref: unchanged.Unchangeable, key: string) => {
        expect(ref).toEqual(object);
        expect(key).toEqual(path);

        ref[key] = value;
      });

    const result: unchanged.Unchangeable = getDeepClone(path, object, callback);

    expect(callback).toBeCalledTimes(1);

    expect(result).toEqual({
      ...object,
      deeply: value,
    });
  });

  it('should create a deep clone on the object at the deep path specified', () => {
    const value: string = 'value';

    const path: unchanged.Path = 'deeply[0].nested';
    const object: unchanged.Unchangeable = {
      untouched: {
        existing: 'value',
      },
    };
    const callback = jest
      .fn()
      .mockImplementation((ref: unchanged.Unchangeable, key: string) => {
        expect(ref).toEqual({});
        expect(key).toEqual(path.split('.')[1]);

        ref[key] = value;
      });

    const result: unchanged.Unchangeable = getDeepClone(path, object, callback);

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
    const value: string = 'value';

    const path: unchanged.Path = 'deeply[0].nested';
    const object: null = null;
    const callback = jest
      .fn()
      .mockImplementation((ref: unchanged.Unchangeable, key: string) => {
        expect(ref).toEqual({});
        expect(key).toEqual(path.split('.')[1]);

        ref[key] = value;
      });

    const result: unchanged.Unchangeable = getDeepClone(path, object, callback);

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
    const path: unchanged.Path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: void = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(['foo', 0, 0]);
  });

  it('should return the added index if path is a string and value is an array', () => {
    const path: unchanged.Path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: void = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('foo[0][0]');
  });

  it('should return the added index if path is an array and value is not', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fn: void = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(path);
  });

  it('should return the added index if path is an empty string and value is an array', () => {
    const path: unchanged.Path = null;
    const object: unchanged.Unchangeable = [];
    const fn: void = undefined;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('[0]');
  });

  it('should return the added index if both path and value returned from fn are arrays', () => {
    const path: unchanged.Path = ['foo', 0];
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(['foo', 0, 0]);
  });

  it('should return the added index if path is a string and value returned from fn is an array', () => {
    const path: unchanged.Path = 'foo[0]';
    const object: unchanged.Unchangeable = {
      foo: [[]],
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('foo[0][0]');
  });

  it('should return the added index if path is an array and value returned from fn is not', () => {
    const path: unchanged.Path = ['foo', 'bar'];
    const object: unchanged.Unchangeable = {
      foo: {},
    };
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual(path);
  });

  it('should return the added index if path is an empty string and value returned from fn is an array', () => {
    const path: unchanged.Path = null;
    const object: unchanged.Unchangeable = [];
    const fn: any = (value: any): any => value;

    const result = getFullPath(path, object, fn);

    expect(result).toEqual('[0]');
  });
});

describe('getOwnProperties', () => {
  it('should get all keys and symbols in the object passed', () => {
    const symbol: symbol = Symbol('baz');
    const object: object = {
      foo: 'bar',
      bar: 'baz',
      [symbol]: 'quz',
    };

    const result: (string | Symbol)[] = getOwnProperties(object);

    expect(result).toEqual([].concat(Object.keys(object), [symbol]));
  });

  it('should get only keys if no symbols in the object passed exist', () => {
    const object: object = {
      foo: 'bar',
      bar: 'baz',
    };

    const result: (string | Symbol)[] = getOwnProperties(object);

    expect(result).toEqual(Object.keys(object));
  });

  it('should get only get enumerable symbols in the object passed', () => {
    const symbol: symbol = Symbol('baz');
    const object: object = {
      foo: 'bar',
      bar: 'baz',
      [symbol]: 'quz',
    };

    Object.defineProperty(object, Symbol('quz'), {
      value: 'blah',
    });

    const result: (string | Symbol)[] = getOwnProperties(object);

    expect(result).toEqual([].concat(Object.keys(object), [symbol]));
  });
});

describe('getMergedObject', () => {
  it('should shallowly clone the second object if the objects are different types', () => {
    const object1: object = { key: 'value' };
    const object2: string[] = ['key', 'value'];
    const isDeep: boolean = false;

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(object2);
  });

  it('should deeply clone the second object if the objects are different types', () => {
    const object1: object = { key: 'value' };
    const object2: string[] = ['key', 'value'];
    const isDeep: boolean = true;

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual(object2);
  });

  it('should merge the arrays if both objects are arrays and is not deep merge', () => {
    const object1: string[] = ['one'];
    const object2: string[] = ['two'];
    const isDeep: boolean = false;

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

    expect(result).not.toBe(object1);
    expect(result).not.toBe(object2);

    expect(result).toEqual([...object1, ...object2]);

    expect(result[0]).toStrictEqual(object1[0]);
    expect(result[1]).toStrictEqual(object2[0]);
  });

  it('should merge the arrays if both objects are arrays and is deep merge', () => {
    const object1: string[] = ['one'];
    const object2: string[] = ['two'];
    const isDeep: boolean = true;

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

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
    const isDeep: boolean = false;

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

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

    const result: unchanged.Unchangeable = getMergedObject(
      object1,
      object2,
      isDeep,
    );

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
          return Object.keys(value).reduce((reduced: Foo, key: string) => {
            const deepValue =
              value[key] && value[key].constructor === Object
                ? new Foo(value[key])
                : value[key];

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

    const result: unchanged.Unchangeable = getMergedObject(
      new Foo(object1),
      new Foo(object2),
      isDeep,
    );

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
          return Object.keys(value).reduce((reduced: Foo, key: string) => {
            const deepValue =
              value[key] && value[key].constructor === Object
                ? new Foo(value[key])
                : value[key];

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

    const result: unchanged.Unchangeable = getMergedObject(
      new Foo(object1),
      new Foo(object2),
      isDeep,
    );

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
    const path: unchanged.Path = 'path';
    const object: unchanged.Unchangeable = {
      [path]: 'value',
    };
    const fallbackValue: undefined = undefined;

    const result: string = getValueAtPath(path, object, fallbackValue);

    expect(result).toEqual(object[path]);
  });

  it('should return the matching value when there is a nested path', () => {
    const path: unchanged.Path = 'deeply.nested';
    const object: unchanged.Unchangeable = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue: undefined = undefined;

    const result: string = getValueAtPath(path, object, fallbackValue);

    expect(result).toEqual(object.deeply.nested);
  });

  it('should return undefined when the object does not exist', () => {
    const path: unchanged.Path = 'path';
    const object: null = null;
    const fallbackValue: undefined = undefined;

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(undefined);
  });

  it('should return the fallback when the object does not exist and a fallback is provided', () => {
    const path: unchanged.Path = 'path';
    const object: null = null;
    const fallbackValue: string = 'fallback';

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback when the object does not have a simple path match', () => {
    const path: unchanged.Path = 'nonexistent.nested';
    const object: unchanged.Unchangeable = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });

  it('should return the fallback when the object does not have a nested path match', () => {
    const path: unchanged.Path = 'deeply.nonexistent';
    const object: unchanged.Unchangeable = {
      deeply: {
        nested: 'value',
      },
    };
    const fallbackValue: string = 'fallback';

    const result: void = getValueAtPath(path, object, fallbackValue);

    expect(result).toBe(fallbackValue);
  });
});

describe('getCloneOrEmptyObject', () => {
  it('should get a shallow clone of the object if it is cloneable', () => {
    const object: object = { foo: 'bar' };
    const nextKey: number = 0;

    const result: unchanged.Unchangeable = getCloneOrEmptyObject(
      object,
      nextKey,
    );

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should get an empty object based on the next key if the object is not cloneable', () => {
    const object: RegExp = /foo/;
    const nextKey: number = 0;

    const result: unchanged.Unchangeable = getCloneOrEmptyObject(
      object,
      nextKey,
    );

    expect(result).not.toBe(object);
    expect(result).toEqual([]);
  });
});

describe('getNewEmptyChild', () => {
  it('should return an array when the key is a number', () => {
    const key: number = 0;

    const result: unchanged.Unchangeable = getNewEmptyChild(key);

    expect(result).toEqual([]);
  });

  it('should return an object when the key is not a number', () => {
    const key: string = 'foo';

    const result: unchanged.Unchangeable = getNewEmptyChild(key);

    expect(result).toEqual({});
  });
});

describe('getNewEmptyObject', () => {
  it('should return an empty array if the object passed is an array', () => {
    const object: any[] = ['foo', 123];

    const result: unchanged.Unchangeable = getNewEmptyObject(object);

    expect(result).toEqual([]);
  });

  it('should return an empty object if the object passed is an object', () => {
    const object: object = { foo: 'bar' };

    const result: unchanged.Unchangeable = getNewEmptyObject(object);

    expect(result).toEqual({});
  });
});

describe('getParsedPath', () => {
  it('should return the path passed if an array', () => {
    const path: unchanged.Path = ['foo', (Symbol('bar') as unknown) as string];

    const result: unchanged.ParsedPath = getParsedPath(path);

    expect(result).toBe(path);
  });

  it('should return the path parsed as an array', () => {
    const path: unchanged.Path = 'foo[0]';

    const result: unchanged.ParsedPath = getParsedPath(path);

    expect(result).not.toBe(path);

    expect(result).toEqual(parse(path));
  });
});

describe('getShallowClone', () => {
  it('should return a shallow clone of the object if a plain object', () => {
    const object: object = { foo: 'bar' };

    const result: unchanged.Unchangeable = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return a shallow clone of the array if an array', () => {
    const object: any[] = ['foo', 123, Symbol('bar')];

    const result: unchanged.Unchangeable = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return an empty object if the object is a global constructor', () => {
    const object: Function = RegExp;

    const result: unchanged.Unchangeable = getShallowClone(object);

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

    const object: Foo = new Foo('bar');

    const result: unchanged.Unchangeable = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });

  it('should return a shallow clone of the object if a pure object', () => {
    const object = Object.create(null);

    object.foo = 'bar';

    const result: unchanged.Unchangeable = getShallowClone(object);

    expect(result).not.toBe(object);
    expect(result).toEqual(object);
  });
});

describe('isCloneable', () => {
  it('should return false if the object passed is falsy', () => {
    const object: null = null;

    const result: boolean = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is not of type object', () => {
    const object: boolean = true;

    const result: boolean = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a React element', () => {
    const object: object = React.createElement('div', {});

    const result: boolean = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a Date object', () => {
    const object: Date = new Date();

    const result: boolean = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return false if the object is a RegExp object', () => {
    const object: RegExp = /foo/;

    const result: boolean = isCloneable(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is cloneable', () => {
    const object: object = { foo: 'bar' };

    const result: boolean = isCloneable(object);

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
    const object: unchanged.Path = [];

    const result = isEmptyPath(object);

    expect(result).toBe(true);
  });

  it('should return true if the object is a populated array', () => {
    const object: unchanged.Path = ['foo'];

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is a string', () => {
    const object: unchanged.PathItem = 'foo';

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });

  it('should return true if the object is a number', () => {
    const object: unchanged.PathItem = 0;

    const result = isEmptyPath(object);

    expect(result).toBe(false);
  });
});

describe('isGlobalConstructor', () => {
  it('should return false if the object passed is not a funtion', () => {
    const object: object = { foo: 'bar' };

    const result: boolean = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  it('should return false if the object passed is not a global funtion based on given name', () => {
    const object: Function = function foo() {};

    expect(object.name).toBe('foo');

    const result: boolean = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  it('should return false if the object passed is not a global funtion based on derived name', () => {
    const object: Function = function foo() {};

    // @ts-ignore
    delete object.name;

    expect(object.name).toBe('');

    const result: boolean = isGlobalConstructor(object);

    expect(result).toBe(false);
  });

  it('should return true if the object passed is a global funtion based on its given name', () => {
    const object: Function = RegExp;

    expect(object.name).toBe('RegExp');

    const result: boolean = isGlobalConstructor(object);

    expect(result).toBe(true);
  });

  it('should return true if the object passed is a global funtion based on derived name', () => {
    const object: Function = RegExp;

    // @ts-ignore
    delete object.name;

    expect(object.name).toBe('');

    const result: boolean = isGlobalConstructor(object);

    expect(result).toBe(true);
  });
});

describe('isSameValueZero', () => {
  it('will return true if values are strictly equal', () => {
    const value1: object = { foo: 'bar' };
    const value2: object = value1;

    const result: boolean = isSameValueZero(value1, value2);

    expect(result).toBe(true);
  });

  it('will return true if values are both NaN', () => {
    const value1: number = NaN;
    const value2: number = NaN;

    const result: boolean = isSameValueZero(value1, value2);

    expect(result).toBe(true);
  });

  it('will return false if values are not NaN and not strictly equal', () => {
    const value1: object = { foo: 'bar' };
    const value2: object = { foo: 'bar' };

    const result: boolean = isSameValueZero(value1, value2);

    expect(result).toBe(false);
  });
});

describe('getCloneAtPath', () => {
  it('should call onMatch and return the object based on a simple path', () => {
    const path: unchanged.ParsedPath = ['key'];
    const object: unchanged.Unchangeable = {
      [path[0]]: 'value',
      untouched: true,
    };
    const onMatch: Function = jest.fn().mockImplementation((a, b) => {
      a[b] = 'new value';
    });

    const result: string = getCloneAtPath(path, object, onMatch, 0);

    expect(onMatch).toBeCalledTimes(1);
    expect(onMatch).toBeCalledWith(object, path[0]);

    expect(result).toEqual({
      ...object,
      [path[0]]: 'new value',
    });
  });

  it('should call onMatch and return the object based on a nested path', () => {
    const path: unchanged.ParsedPath = ['deeply', 'nested', 'key'];
    const object: unchanged.Unchangeable = {
      [path[0]]: {
        [path[1]]: {
          [path[2]]: 'value',
        },
      },
      untouched: true,
    };
    const onMatch: Function = jest.fn().mockImplementation((a, b) => {
      a[b] = 'new value';
    });

    const result: string = getCloneAtPath(path, object, onMatch, 0);

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
    const fn: Function = (total: number, value: number): number =>
      total + value;
    const initialValue: number = 0;

    const result = reduce(array, fn, initialValue);

    expect(result).toEqual(55);
  });
});

describe('splice', () => {
  it('should mutatively remove the index specified from the array', () => {
    const array: any[] = ['foo', 123, {}, []];
    const splicedIndex: number = 1;

    const result: void = splice(array, splicedIndex);

    expect(result).toBe(undefined);
    expect(array).toEqual(['foo', {}, []]);
  });

  it('should do nothing when the array is empty', () => {
    const array: any[] = [];
    const splicedIndex: number = 1;

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
