// test
import test from 'ava';
import * as pathington from 'pathington';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if cloneIfPossible will shallowly clone the object if it is cloneable', (t) => {
  const object = {
    key: 'value'
  };

  const result = utils.cloneIfPossible(object);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if cloneIfPossible will return the object if it is not cloneable', (t) => {
  const object = new Date();

  const result = utils.cloneIfPossible(object);

  t.is(result, object);
});

test('if getShallowClone shallowly clones the object when it is an array', (t) => {
  const object = ['array'];

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getShallowClone shallowly clones the object when it is a plain object', (t) => {
  const object = {array: true};

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getShallowClone shallowly clones the object into a plain object when it is a standard object type', (t) => {
  const object = function someFunction() {};

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.deepEqual(result, {...object});
});

test('if getShallowClone shallowly clones the object with its prototype when it is not a standard object type', (t) => {
  const Foo = function Foo(value) {
    this.value = value;
  };

  const object = new Foo('foo');

  const result = utils.getShallowClone(object);

  t.not(result, object);
  t.true(result instanceof Foo);
  t.deepEqual(result, new Foo('foo'));
});

test('if getNewEmptyChild will return an array when the key should produce an array type', (t) => {
  const key = 1;

  const result = utils.getNewEmptyChild(key);

  t.deepEqual(result, []);
});

test('if getNewEmptyChild will return an object when the key should not produce an array type', (t) => {
  const key = 'foo';

  const result = utils.getNewEmptyChild(key);

  t.deepEqual(result, {});
});

test('if getNewEmptyObject will return an array when the object passed is an array', (t) => {
  const object = ['some', 'array'];

  const result = utils.getNewEmptyObject(object);

  t.deepEqual(result, []);
});

test('if getNewEmptyObject will return an object when the object passed is not an array', (t) => {
  const object = 'foo';

  const result = utils.getNewEmptyObject(object);

  t.deepEqual(result, {});
});

test('if getNewChildClone will get a shallow clone of the object when it is an array and the key type should be an array', (t) => {
  const object = ['array'];
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getNewChildClone will assign the numeric key to the object when the object is not an array (even though the key says it should be)', (t) => {
  const object = {array: false};
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {...object});
});

test('if getNewChildClone will get a shallow clone of the object when it is an object and the key type should be an object', (t) => {
  const object = {array: true};
  const nextKey = 'key';

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, object);
});

test('if getNewChildClone will get a new array when the key type should be an array', (t) => {
  const object = undefined;
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test('if getNewChildClone will get a new object when the object doe not exist and the key type should be an object', (t) => {
  const object = undefined;
  const nextKey = 'key';

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if getNewChildClone will get a new array when the object doe not exist and the key type should be an array', (t) => {
  const object = undefined;
  const nextKey = 0;

  const result = utils.getNewChildClone(object, nextKey);

  t.not(result, object);
  t.deepEqual(result, []);
});

test('if onMatchAtPath calls onMatch and returns its result if the object exists and returns the result', (t) => {
  const path = ['key'];
  const object = {
    [path[0]]: 'value'
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object, path[0]));

  t.is(result, path[0]);
});

test('if onMatchAtPath calls onMatch and returns the original object if the object exists and returns the object if it should be cloned', (t) => {
  const path = ['key'];
  const object = {
    [path[0]]: 'value'
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = true;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object, path[0]));

  t.is(result, object);
});

test('if onMatchAtPath returns noMatchValue if the object does not exist and it should not be cloned', (t) => {
  const path = ['key'];
  const object = null;
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath calls itself if the path has more than one value and the next key exists', (t) => {
  const path = ['key', 'otherKey'];
  const object = {
    [path[0]]: {
      [path[1]]: 'value'
    }
  };
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object[path[0]], path[1]));

  t.is(result, path[1]);
});

test('if onMatchAtPath does not call itself if the path has more than one value but the next object does not exist', (t) => {
  const path = ['key', 'otherKey'];
  const object = null;
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath does not call itself if the path has more than one value but the next key does not exist', (t) => {
  const path = ['key', 'otherKey'];
  const object = {};
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = false;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.notCalled);

  t.is(result, noMatchValue);
});

test('if onMatchAtPath calls itself with a new clone if the path has more than one value and returns the object', (t) => {
  const path = ['key', 'otherKey'];
  const object = {};
  const onMatch = sinon.stub().returnsArg(1);
  const shouldClone = true;
  const noMatchValue = 'no match';

  const result = utils.onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue);

  t.true(onMatch.calledOnce);
  t.true(onMatch.calledWith(object[path[0]], path[1]));

  t.is(result, object);
});

test('if getNestedProperty will get the nested value in the object', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };
  const path = 'deeply.nested';

  const result = utils.getNestedProperty(path, object);

  t.is(result, object.deeply.nested);
});

test('if getNestedProperty will return the top-level value when the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = {
    [path]: 'value'
  };

  const result = utils.getNestedProperty(path, object);

  t.is(result, object[path]);
});

test('if getNestedProperty will return undefined when the object does not exist and the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = null;

  const result = utils.getNestedProperty(path, object);

  t.is(result, undefined);
});

test('if getNestedProperty with a fallback will return the fallback when the object does not exist and the length of the path is 1', (t) => {
  const path = 'path';
  const object = null;
  const fallback = 'fallback';

  const result = utils.getNestedProperty(path, object, fallback);

  t.is(result, fallback);
});

test('if getNestedProperty with a fallback will return the fallback when the deeply nested value does not exist', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };
  const path = 'deeply.nonexistent';
  const fallback = 'fallback';

  const result = utils.getNestedProperty(path, object, fallback);

  t.is(result, fallback);
});

test('if getDeepClone will create a deep clone on the object at the path specified', (t) => {
  const value = 'value';

  const object = {
    untouched: {
      existing: 'values'
    }
  };
  const path = 'deeply[0].nested';
  const callback = (ref, key) => {
    t.deepEqual(ref, {});
    t.is(key, path.split('.')[1]);

    ref[key] = value;
  };

  const result = utils.getDeepClone(path, object, callback);

  t.deepEqual(result, {
    ...object,
    deeply: [
      {
        nested: value
      }
    ]
  });
});

test('if getDeepClone will create a deep clone on a new object if it does not exist at the path specified', (t) => {
  const value = 'value';

  const object = null;
  const path = 'deeply[0].nested';
  const callback = (ref, key) => {
    t.deepEqual(ref, {});
    t.is(key, path.split('.')[1]);

    ref[key] = value;
  };

  const result = utils.getDeepClone(path, object, callback);

  t.deepEqual(result, {
    deeply: [
      {
        nested: value
      }
    ]
  });
});

test('if getDeeplyMergedObject will clone object2 if the objects are different types', (t) => {
  const object1 = {key: 'value'};
  const object2 = ['key', 'value'];

  const result = utils.getDeeplyMergedObject(object1, object2);

  t.not(result, object1);
  t.not(result, object2);

  t.deepEqual(result, object2);
});

test('if getDeeplyMergedObject will merge the arrays if the objects are both array types', (t) => {
  const object1 = ['one'];
  const object2 = ['two'];

  const result = utils.getDeeplyMergedObject(object1, object2);

  t.not(result, object1);
  t.not(result, object2);

  t.deepEqual(result, [...object1, ...object2]);
});

test('if getDeeplyMergedObject will merge the objects if the objects are both object types', (t) => {
  const object1 = {date: {willBe: 'overwritten'}, deep: {key: 'value'}};
  const object2 = {date: new Date(), deep: {otherKey: 'otherValue'}, untouched: 'value'};

  const result = utils.getDeeplyMergedObject(object1, object2);

  t.not(result, object1);
  t.not(result, object2);

  t.deepEqual(result, {
    date: object2.date,
    deep: {
      ...object1.deep,
      ...object2.deep
    },
    untouched: object2.untouched
  });
});

test('if getDeeplyMergedObject will merge the objects retaining the prototype', (t) => {
  class Foo {
    constructor(value) {
      if (value && value.constructor === Object) {
        return Object.keys(value).reduce((reduced, key) => {
          const deepValue = value[key] && value[key].constructor === Object ? new Foo(value[key]) : value[key];

          if (reduced[key]) {
            reduced[key].value = deepValue;
          } else {
            reduced[key] = {
              value: deepValue
            };
          }

          return reduced;
        }, this);
      }

      this.value = value;

      return this;
    }
  }

  const object1 = {date: {willBe: 'overwritten'}, deep: {key: 'value'}};
  const object2 = {date: new Date(), deep: {otherKey: 'otherValue'}, untouched: 'value'};

  const result = utils.getDeeplyMergedObject(new Foo(object1), new Foo(object2));

  t.not(result, object1);
  t.not(result, object2);

  t.deepEqual(
    result,
    new Foo({
      date: object2.date,
      deep: {
        ...object1.deep,
        ...object2.deep
      },
      untouched: object2.untouched
    })
  );
});

test('if hasNestedProperty will return true if the nested property exists on the object', (t) => {
  const object = {
    deeply: [
      {
        nested: 'value'
      }
    ]
  };
  const path = 'deeply[0].nested';

  t.true(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return false if the nested property does not exist on the object', (t) => {
  const object = {
    deeply: [
      {
        nested: 'value'
      }
    ]
  };
  const path = 'deeply[1].nested';

  t.false(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return false if the object does not exist', (t) => {
  const object = null;
  const path = 'deeply[1].nested';

  t.false(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return the top-level value when the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = {
    [path]: 'value'
  };

  t.true(utils.hasNestedProperty(path, object));
});

test('if hasNestedProperty will return undefined when the object does not exist and the length ofthe path is 1', (t) => {
  const path = 'path';
  const object = null;

  t.false(utils.hasNestedProperty(path, object));
});

test('if isCloneable returns false if null', (t) => {
  const object = null;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if not an object', (t) => {
  const object = 123;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if a date', (t) => {
  const object = new Date();

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if a regexp', (t) => {
  const object = /foo/;

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns false if a react element', (t) => {
  const object = {
    $$typeof: Symbol.for('react.element')
  };

  t.false(utils.isCloneable(object));
});

test('if isCloneable returns true otherwise', (t) => {
  const object = {
    valid: true
  };

  t.true(utils.isCloneable(object));
});

test('if isEmptyKey will return true when undefined', (t) => {
  const object = undefined;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return true when null', (t) => {
  const object = null;

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when an empty string', (t) => {
  const object = '';

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will true false when an empty array', (t) => {
  const object = [];

  t.true(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a populated string', (t) => {
  const object = 'populated';

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a populated array', (t) => {
  const object = ['populated'];

  t.false(utils.isEmptyKey(object));
});

test('if isEmptyKey will return false when a number', (t) => {
  const object = 0;

  t.false(utils.isEmptyKey(object));
});

test('if isGlobalConstructor returns false if the fn passed is not a function', (t) => {
  const fn = {};

  t.false(utils.isGlobalConstructor(fn));
});

test('if isGlobalConstructor returns based on if the fn passed with a name property exists on the global object', (t) => {
  const trueFn = RegExp;
  const falseFn = function Foo() {};

  t.true(utils.isGlobalConstructor(trueFn));
  t.false(utils.isGlobalConstructor(falseFn));
});

test.serial(
  'if isGlobalConstructor returns based on if the fn passed with a name property exists on the window object',
  (t) => {
    const currentWindow = global.window;

    global.window = {
      RegExp
    };

    const trueFn = RegExp;
    const falseFn = function Foo() {};

    t.true(utils.isGlobalConstructor(trueFn));
    t.false(utils.isGlobalConstructor(falseFn));

    global.window = currentWindow;
  }
);

test('if isGlobalConstructor returns false if the fn passed without a name property does not have a match', (t) => {
  const fn = () => {};

  delete fn.name;

  t.false(utils.isGlobalConstructor(fn));
});

test('if isGlobalConstructor returns false if the fn passed without a name property has a match but no name', (t) => {
  const fn = function() {};

  delete fn.name;

  t.false(utils.isGlobalConstructor(fn));
});

test('if isGlobalConstructor returns based on if the fn passed without a name property has a match that is a global function', (t) => {
  const trueFn = Promise;
  const falseFn = function Foo() {};

  delete trueFn.name;
  delete falseFn.name;

  t.true(utils.isGlobalConstructor(trueFn));
  t.false(utils.isGlobalConstructor(falseFn));
});

test('if getParsedPath will return the path if it is an array', (t) => {
  const path = ['path'];

  const result = utils.getParsedPath(path);

  t.is(result, path);
});

test('if getParsedPath will parse the path with pathington if not an array', (t) => {
  const path = 'path';

  const spy = sinon.spy(pathington, 'parse');

  const result = utils.getParsedPath(path);

  t.true(spy.calledOnce);
  t.true(spy.calledWith(path));

  t.deepEqual(result, [path]);
});

test('if splice performs the same operation as the native splice', (t) => {
  const indexToSpice = 1;

  let nativeArray = ['foo', 'bar'],
      customArray = [...nativeArray];

  nativeArray.splice(indexToSpice, 1);
  utils.splice(customArray, indexToSpice);

  t.deepEqual(nativeArray, customArray);
});

test('if splice returns immediately when an empty array is passed', (t) => {
  let array = [];

  const originalArrayLength = array.length;

  utils.splice(array, 0);

  t.is(array.length, originalArrayLength);
});
