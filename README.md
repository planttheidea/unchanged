# unchanged

A tiny (~2.1kB minified+gzipped), [fast](https://github.com/planttheidea/unchanged/blob/master/benchmark_results.csv), unopinionated handler for updating JS objects and arrays immutably.

Supports nested key paths via path arrays or [dotty syntax](https://github.com/planttheidea/pathington), and all methods are curriable (with placeholder support) for composability. Can be a drop-in replacement for the `lodash/fp` methods `get`, `set`, `merge`, and `omit` with a 90% smaller footprint.

## Table of contents

- [unchanged](#unchanged)
  - [Table of contents](#Table-of-contents)
  - [Usage](#Usage)
  - [Types](#Types)
  - [Standard methods](#Standard-methods)
    - [get](#get)
    - [getOr](#getOr)
    - [set](#set)
    - [remove](#remove)
    - [has](#has)
    - [is](#is)
    - [not](#not)
    - [add](#add)
    - [merge](#merge)
    - [assign](#assign)
    - [call](#call)
  - [Transform methods](#Transform-methods)
    - [getWith](#getWith)
    - [getWithOr](#getWithOr)
    - [setWith](#setWith)
    - [removeWith](#removeWith)
    - [hasWith](#hasWith)
    - [isWith](#isWith)
    - [notWith](#notWith)
    - [addWith](#addWith)
    - [mergeWith](#mergeWith)
    - [assignWith](#assignWith)
    - [callWith](#callWith)
  - [Additional objects](#Additional-objects)
    - [\_\_](#)
  - [Differences from other libraries](#Differences-from-other-libraries)
    - [lodash](#lodash)
    - [ramda](#ramda)
    - [Other immutability libraries](#Other-immutability-libraries)
  - [Browser support](#Browser-support)
  - [Development](#Development)

## Usage

```typescript
import {
  __,
  add,
  addWith,
  assign,
  assignWith,
  call,
  callWith,
  get,
  getWith,
  getOr,
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
  setWith
} from "unchanged";

const object: unchanged.Unchangeable = {
  foo: "foo",
  bar: [
    {
      baz: "quz"
    }
  ]
};

// handle standard properties
const foo = get("foo", object);

// or nested properties
const baz = set("bar[0].baz", "not quz", object);

// all methods are curriable
const removeBaz = remove("bar[0].baz");
const sansBaz = removeBaz(object);
```

**NOTE**: There is no `default` export, so if you want to import all methods to a single namespace you should use the `import *` syntax:

```typescript
import * as uc from "unchanged";
```

## Types

This library is both written in, and provided with, types by TypeScript. The internal types used for specific parameters are scoped to the `unchanged` namespace.

```typescript
// the path used to compute nested locations
type Path = (number | string)[] | number | string;
// the callback used in transform methods
type WithHandler = (value: any, ...extraParams: any[]) => any;
// the generic object that is computed upon, either an array or object
interface Unchangeable {
  [key: string]: any;
  [index: number]: any;
}
```

Notice in the `Unchangeable` interface, there is no reference to symbols. That is because to date, TypeScript does not support Symbols as an index type. If you need to use symbols as object keys, the best workaround I've found is to typecast when it complains:

```typescript
const symbolKey = (Symbol("key") as unknown) as string;

const object: { [symbolKey]: string } = {
  [symbolKey]: "bar"
};
```

If there is a better alternative for having dynamic Symbol indices, let me know! Happy to accept any PRs from those more experienced in TypeScript than myself.

## Standard methods

### get

```typescript
function get(path: unchanged.Path, object: unchanged.Unchangeable): any;
```

Get the value at the `path` requested on the `object` passed.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(get("foo[0].bar", object)); // baz
console.log(get(["foo", 0, "bar"], object)); // baz
```

### getOr

```typescript
function getOr(
  fallbackValue: any,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): any;
```

Get the value at the `path` requested on the `object` passed, with a fallback value if that path does not exist.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(getOr("blah", "foo[0].bar", object)); // baz
console.log(getOr("blah", ["foo", 0, "bar"], object)); // baz
console.log(getOr("blah", "foo[0].nonexistent", object)); // blah
```

### set

```typescript
function set(
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the `value` assigned to the final key on the `path` specified.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(set("foo[0].bar", "quz", object)); // {foo: [{bar: 'quz'}]}
console.log(set(["foo", 0, "bar"], "quz", object)); // {foo: [{bar: 'quz'}]}
```

### remove

```typescript
function remove(
  path: unchanged.Path,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the final key on the `path` removed if it exists.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(remove("foo[0].bar", object)); // {foo: [{}]}
console.log(remove(["foo", 0, "bar"], object)); // {foo: [{}]}
```

### has

```typescript
function has(path: unchanged.Path, object: unchanged.Unchangeable): boolean;
```

Returns `true` if the object has the path provided, `false` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(has("foo[0].bar", object)); // true
console.log(has(["foo", 0, "bar"], object)); // true
console.log(has("bar", object)); // false
```

### is

```typescript
function is(
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable
): boolean;
```

Returns `true` if the value at the `path` in `object` is equal to `value` based on [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality) equality, `false` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(is("foo[0].bar", "baz", object)); // true
console.log(is(["foo", 0, "bar"], "baz", object)); // true
console.log(is("foo[0].bar", "quz", object)); // false
```

### not

```typescript
function not(
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable
): boolean;
```

Returns `false` if the value at the `path` in `object` is equal to `value` based on [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality) equality, `true` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};

console.log(not("foo[0].bar", "baz", object)); // false
console.log(not(["foo", 0, "bar"], "baz", object)); // false
console.log(not("foo[0].bar", "quz", object)); // true
```

### add

```typescript
function add(
  path: unchanged.Path,
  value: any,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the `value` added at the `path` specified. This can have different behavior depending on whether the item is an object or an array; objects will simply add / set the key provided, whereas arrays will add a new value to the end.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: 'baz'
    }
  ]
};

// object
console.log(add('foo', 'added value' object)); // {foo: [{bar: 'baz'}, 'added value']}
console.log(add(['foo'], 'added value', object)); // {foo: [{bar: 'baz'}, 'added value']}

// array
console.log(add('foo[0].quz', 'added value' object)); // {foo: [{bar: 'baz', quz: 'added value'}]}
console.log(add(['foo', 0, 'quz'], 'added value', object)); // {foo: [{bar: 'baz', quz: 'added value'}]}
```

Notice that the `Object` usage is idential to the `set` method, where a key needs to be specified for assignment. In the case of an `Array`, however, the value is pushed to the array at that key.

**NOTE**: If you want to add an item to a top-level array, pass `null` as the key:

```typescript
const object = ["foo"];

console.log(add(null, "bar", object)); // ['foo', 'bar']
```

### merge

```typescript
function merge(
  path: unchanged.Path,
  value: unchanged.Unchangeable,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object that is a deep merge of `value` into `object` at the `path` specified. If you want to perform a shallow merge, see [`assign`](#assign).

```typescript
const object1: unchanged.Unchangeable = {
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  }
};
const object2: unchanged.Unchangeable = {
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
};

console.log(merge("baz", object2, object1));
/*
{
  foo: 'bar',
  baz: {
    one: 'new value',
    deeply: {
      nested: 'other value',
      untouched: true,
    },
    two: 'value2',
    three: 'value3
  }
}
```

**NOTE**: If you want to `merge` the entirety of both objects, pass `null` as the key:

```typescript
console.log(merge(null, object2, object1));
/*
{
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  },
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
}
*/
```

### assign

```typescript
function assign(
  path: unchanged.Path,
  value: unchanged.Unchangeable,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object that is a shallow merge of `value` into `object` at the `path` specified. If you want to perform a deep merge, see [`merge`](#merge).

```typescript
const object1: unchanged.Unchangeable = {
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  }
};
const object2: unchanged.Unchangeable = {
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
};

console.log(assign("baz", object2, object1));
/*
{
  foo: 'bar',
  baz: {
    one: 'new value',
    deeply: {
      nested: 'other value',
    },
    two: 'value2',
    three: 'value3
  }
}
```

**NOTE**: If you want to `assign` the entirety of both objects, pass `null` as the key:

```typescript
console.log(assign(null, object2, object1));
/*
{
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  },
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
}
*/
```

### call

```typescript
function call(
  path: unchanged.Path,
  parameters: any[],
  object: unchanged.Unchangeable,
  context?: any = object
): any;
```

Call the method at the `path` requested on the `object` passed, and return what it's call returns.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar(a, b) {
        return a + b;
      }
    }
  ]
};

console.log(call("foo[0].bar", [1, 2], object)); // 3
console.log(call(["foo", 0, "bar"], [1, 2], object)); // 3
```

You can also provide an optional fourth parameter of `context`, which will be the `this` value in the method call. This will default to the `object` itself.

```typescript
const object: unchanged.Unchangeable = {
  calculate: true,
  foo: [
    {
      bar(a, b) {
        return this.calculate ? a + b : 0;
      }
    }
  ]
};

console.log(call("foo[0].bar", [1, 2], object)); // 3
console.log(call("foo[0].bar", [1, 2], object, {})); // 0
```

**NOTE**: Because `context` is optional, it cannot be independently curried; you must apply it in the call when the `object` is passed.

## Transform methods

Each standard method has it's own related `With` method, which accepts a callback `fn` as the first curried parameter. In most cases this callback serves as a transformer for the value retrieved, set, merged, etc.; the exception is `removeWith`, where the callback serves as a validator as to whether to remove or not.

The signature of all callbacks is the `withHandler` specified in [`Types`](#types). Because `extraParams` are optional parameters, they cannot be independently curried; you must apply them in the call when the `object` is passed.

### getWith

```typescript
function getWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  ...extraParams?: any[]
): any;
```

Get the return value of `fn` based on the value at the `path` requested on the `object` passed. `fn` is called with the current value at the `path` as the first parameter, and any additional parameters passed as `extraParams` following that.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any, nullValue: any): any =>
  currentValue === nullValue ? null : currentValue;

console.log(getWith(fn, "foo[0].bar", object)); // 'baz'
console.log(getWith(fn, "foo[0].bar", object, "baz")); // null
console.log(getWith(fn, ["foo", 0, "bar"], object)); // 'baz'
console.log(getWith(fn, ["foo", 0, "bar"], object, "baz")); // null
```

### getWithOr

```typescript
function getWithOr(
  fn: unchanged.withHandler,
  fallbackValue: any,
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  ...extraParams?: any[]
): any;
```

Get the return value of `fn` based on the value at the `path` requested on the `object` passed, falling back to `fallbackValue` when no match is found at `path`. When a match is found, `fn` is called with the current value at the `path` as the first parameter, and any additional parameters passed as `extraParams` following that.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any, nullValue: any): any =>
  currentValue === nullValue ? null : currentValue;

console.log(getWithOr(fn, "quz", "foo[0].bar", object)); // 'baz'
console.log(getWithOr(fn, "quz", "foo[0].bar", object, "baz")); // null
console.log(getWithOr(fn, "quz", "foo[0].notFound", object, "baz")); // 'quz'
console.log(getWithOr(fn, "quz", ["foo", 0, "bar"], object)); // 'baz'
console.log(getWithOr(fn, "quz", ["foo", 0, "bar"], object, "baz")); // null
console.log(getWithOr(fn, "quz", ["foo", 0, "notFound"], object, "baz")); // 'quz'
```

### setWith

```typescript
function setWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  ...extraParams?: any[]
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the return value of `fn` assigned to the final key on the `path` specified. `fn` is called with the current value at the `path` as the first parameter, and any additional parameters passed as `extraParams` following that.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any, preventUpdate: boolean): any =>
  preventUpdate ? currentValue : "quz";

console.log(setWith(fn, "foo[0].bar", object)); // {foo: [{bar: 'quz'}]}
console.log(setWith(fn, "foo[0].bar", object, true)); // {foo: [{bar: 'baz'}]}
console.log(setWith(fn, ["foo", 0, "bar"], object)); // {foo: [{bar: 'quz'}]}
console.log(setWith(fn, ["foo", 0, "bar"], object, true)); // {foo: [{bar: 'baz'}]}
```

### removeWith

```typescript
function removeWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  ...extraParams?: any[]
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the final key on the `path` removed if it exists and the return from `fn` is truthy.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (
  value: any,
  shouldNotRemove: boolean
): boolean => !shouldNotRemove && value === "baz";

console.log(removeWith(fn, "foo[0].bar", object)); // {foo: [{}]}
console.log(removeWith(fn, "foo[0].bar", object, true)); // {foo: [{bar: 'baz'}]}
console.log(removeWith([fn, "foo", 0, "bar"], object)); // {foo: [{}]}
console.log(removeWith([fn, "foo", 0, "bar"], object, true)); // {foo: [{bar: 'baz'}]}
```

### hasWith

```typescript
function hasWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  ...extraParams?: any[]
): boolean;
```

Returns `true` if the return value of `fn` based on the value returned from `path` in the `object` returns truthy, `false` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (
  value: any,
  shouldBeNull: boolean
): boolean => (shouldBeNull ? value === null : value === "baz");

console.log(hasWith(fn, "foo[0].bar", object)); // true
console.log(hasWith(fn, "foo[0].bar", object, true)); // false
console.log(hasWith(fn, ["foo", 0, "bar"], object)); // true
console.log(hasWith(fn, ["foo", 0, "bar"], object, true)); // false
console.log(hasWith(fn, "bar", object)); // false
```

### isWith

```typescript
function isWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): boolean;
```

Returns `true` if the return value of `fn` based on the value returned from `path` in the `object` is equal to `value` based on [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality) equality, `false` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz",
      quz: "not baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any): number =>
  value && value.length === 3;

console.log(isWith(fn, "foo[0].bar", object)); // true
console.log(isWith(fn, ["foo", 0, "bar"], object)); // true
console.log(isWith(fn, "foo[0].quz", object)); // false
```

### notWith

```typescript
function notWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): boolean;
```

Returns `false` if the return value of `fn` based on the value returned from `path` in the `object` is equal to `value` based on [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality) equality, `true` otherwise.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz",
      quz: "not baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any): number =>
  value && value.length === 3;

console.log(notWith(fn, "foo[0].bar", object)); // false
console.log(notWith(fn, ["foo", 0, "bar"], object)); // false
console.log(notWith(fn, "foo[0].quz", object)); // true
```

### addWith

```typescript
function addWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object based on the `object` passed, with the return value of `fn` added at the `path` specified. This can have different behavior depending on whether the item is an object or an array; objects will simply add / set the key provided, whereas arrays will add a new value to the end.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar: "baz"
    }
  ]
};
const fn: unchanged.withHandler = (value: any) =>
  value
    ? value
        .split("")
        .reverse()
        .join("")
    : "new value";

// object
console.log(addWith(fn, "foo", object)); // {foo: [{bar: 'baz'}, 'new value']}
console.log(addWith(fn, ["foo"], object)); // {foo: [{bar: 'baz'}, 'new value']}

// array
console.log(addWith(fn, "foo[0].bar", object)); // {foo: [{bar: 'zab'}]}
console.log(addWith(fn, ["foo", 0, "bar"], object)); // {foo: [{bar: 'zab''}]}
```

### mergeWith

```typescript
function mergeWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object that is a deep merge of the return value of `fn` into `object` at the `path` specified if a valid mergeable object, else returns the original object. If you want to perform a shallow merge, see [`assignWith`](#assignwith).

```typescript
const object1: unchanged.Unchangeable = {
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  }
};
const object2: unchanged.Unchangeable = {
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
};
const fn: unchanged.withHandler = (value: any) =>
  value && value.one === "value1" ? object2 : null;

console.log(mergeWith(fn, "baz", object1));
/*
{
  foo: 'bar',
  baz: {
    one: 'new value',
    deeply: {
      nested: 'other value',
      untouched: true,
    },
    two: 'value2',
    three: 'value3
  }
}
*/
console.log(mergeWith(fn, "baz.deeply", object1));
/*
// untouched object1
{
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: 'value',
      untouched: true,
    },
    two: "value2"
  }
}
*/
```

**NOTE**: If you want to `merge` the entirety of both objects, pass `null` as the key:

```typescript
console.log(mergeWith(fn, null, object1));
/*
{
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  },
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
}
*/
```

### assignWith

```typescript
function assignWith(
  fn: unchanged.withHandler,
  path: unchanged.Path,
  object: unchanged.Unchangeable
): unchanged.Unchangeable;
```

Returns a new object that is a shallow merge of the return value of `fn` into `object` at the `path` specified if a valid mergeable object, else returns the original object. If you want to perform a deep merge, see [`mergeWith`](#mergeWith).

```typescript
const object1: unchanged.Unchangeable = {
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: "value",
      untouched: true
    },
    two: "value2"
  }
};
const object2: unchanged.Unchangeable = {
  one: "new value",
  deeply: {
    nested: "other value"
  },
  three: "value3"
};
const fn: unchanged.withHandler = (value: any) =>
  value && value.one === "value1" ? object2 : null;

console.log(assignWith(fn, "baz", object1));
/*
{
  foo: 'bar',
  baz: {
    one: 'new value',
    deeply: {
      nested: 'other value',
    },
    two: 'value2',
    three: 'value3
  }
}
*/
console.log(assignWith(fn, "baz.deeply", object1));
/*
// untouched object1
{
  foo: "bar",
  baz: {
    one: "value1",
    deeply: {
      nested: 'value',
      untouched: true,
    },
    two: "value2"
  }
}
*/
```

### callWith

```typescript
function callWith(
  path: unchanged.Path,
  parameters: any[],
  object: unchanged.Unchangeable,
  context?: any = object
): any;
```

Call the method returned from `fn` based on the `path` specified on the `object`, and if a function return what it's call returns.

```typescript
const object: unchanged.Unchangeable = {
  foo: [
    {
      bar(a, b) {
        return a + b;
      }
    }
  ]
};
const fn: unchanged.withHandler = (value: any): any =>
  typeof value === fn
    ? fn
    : () =>
        console.error("Error: Requested call of a method that does not exist.");

console.log(callWith(fn, "foo[0].bar", [1, 2], object)); // 3
console.log(callWith(fn, ["foo", 0, "bar"], [1, 2], object)); // 3
callWith(fn, "foo[1].nope", object); // Error: Requested call of a method that does not exist.
```

You can also provide an optional fourth parameter of `context`, which will be the `this` value in the method call. This will default to the `object` itself.

```typescript
const object: unchanged.Unchangeable = {
  calculate: true,
  foo: [
    {
      bar(a, b) {
        return this.calculate ? a + b : 0;
      }
    }
  ]
};
const fn: unchanged.withHandler = (value: any): any =>
  typeof value === fn
    ? fn
    : () =>
        console.error("Error: Requested call of a method that does not exist.");

console.log(callWith(fn, "foo[0].bar", [1, 2], object)); // 3
console.log(callWith(fn, "foo[0].bar", [1, 2], object, {})); // 0
```

**NOTE**: Because `context` is optional, it cannot be independently curried; you must apply it in the call when the `object` is passed.

## Additional objects

### \_\_

A placeholder value used to identify "gaps" in a curried function, allowing for earlier application of arguments later in the argument order.

```typescript
import {__, set} from 'unchanged';

const thing = {
  foo: 'foo';
};

const setFoo = set('foo', __, thing);

setFooOnThing('bar');
```

## Differences from other libraries

### lodash

[`lodash/fp`](https://lodash.com/) (the functional programming implementation of `lodash`) is identical in implementation to `unchanged`'s methods, just with a _10.5x_ larger footprint. These methods should map directly:

- _lodash/fp_ => _unchanged_
- `curry.placeholder` => `__`
- `get` => `get`
- `getOr` => `getOr`
- `merge` => `merge`
- `omit` => `remove`
- `set` => `set`

### ramda

[`ramda`](http://ramdajs.com/) is similar in its implementation, however the first big difference is that dot-bracket syntax is not supported by `ramda`, only path arrays. The related methods are:

- _ramda_ => _unchanged_
- `__` => `__`
- `path` => `get`
- `pathOr` => `getOr`
- `merge` => `merge`
- `omit` => `remove`
- `assocPath` => `set`

Another difference is that the `ramda` methods that clone (`assocPath`, for example) only work with objects; arrays are implicitly converted into objects, which can make updating collections challenging.

The last main difference is the way that objects are copied, example:

```typescript
function Foo(value) {
  this.value = value;
}

Foo.prototype.getValue = function() {
  return this.value;
};

const foo = new Foo("foo");

// in ramda, both own properties and prototypical methods are copied to the new object as own properties
const ramdaResult = assoc("bar", "baz", foo);

console.log(ramdaResult); // {value: 'foo', bar: 'baz', getValue: function getValue() { return this.value; }}
console.log(ramdaResult instanceof Foo); // false

// in unchanged, the prototype of the original object is maintained, and only own properties are copied as own properties
const unchangedResult = set("bar", "baz", foo);

console.log(unchangedResult); // {value: 'foo', bar: 'baz'}
console.log(unchangedResult instanceof Foo); // true
```

This can make `ramda` more performant in certain scenarios, but at the cost of having potentially unexpected behavior.

### Other immutability libraries

This includes popular solutions like [Immutable.js](https://facebook.github.io/immutable-js/), [seamless-immutable](https://github.com/rtfeldman/seamless-immutable), [mori](http://swannodette.github.io/mori/), etc. These solutions all work well, but with one caveat: _you need to buy completely into their system_. Each of these libraries redefines how the objects are stored internally, and require that you learn a new, highly specific API to use these custom objects. `unchanged` is unopinionated, accepting standard JS objects and returning standard JS objects, no transformation or learning curve required.

## Browser support

- Chrome (all versions)
- Firefox (all versions)
- Edge (all versions)
- Opera 15+
- IE 9+
- Safari 6+
- iOS 8+
- Android 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `benchmark` => run benchmark suite comparing top-level and deeply-nested `get` and `set` operations with `lodash` and `ramda`
- `build` => run `rollup` to build `dist` files for CommonJS, ESM, and UMD consumers
- `clean` => run `rimraf` on the `dist` folder
- `dev` => run webpack dev server to run example app / playground
- `dist` => runs `clean` and `build`
- `lint` => run ESLint against all files in the `src` folder
- `lint:fix` => run `lint` with autofixing applied
- `prepublish` => runs `prepublish:compile` when publishing
- `prepublish:compile` => run `lint`, `test:coverage`, `dist`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
