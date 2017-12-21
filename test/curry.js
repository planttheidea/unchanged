// test
import test from 'ava';

// src
import * as curry from 'src/curry';

test('if getPassedArgs determines the complete args to pass when there are no remaining args after the placeholder', (t) => {
  const originalArgs = [1, curry.__, 3];
  const futureArgs = [2];

  const result = curry.getPassedArgs(originalArgs, [...futureArgs]);
  const expectedResult = originalArgs.map((arg) => {
    return arg !== curry.__ ? arg : futureArgs.shift();
  });

  t.deepEqual(result, expectedResult);
});

test('if getPassedArgs determines the complete args to pass when there are remaining args after the placeholder', (t) => {
  const originalArgs = [1, curry.__, 3];
  const futureArgs = [2, 4];

  const result = curry.getPassedArgs(originalArgs, [...futureArgs]);
  const expectedResult = originalArgs
    .map((arg) => {
      return arg !== curry.__ ? arg : futureArgs.shift();
    })
    .concat(futureArgs);

  t.deepEqual(result, expectedResult);
});

test('if isAnyPlaceholder returns true if args has a placeholder in it', (t) => {
  const args = [1, curry.__, 2];
  const arity = 3;

  t.true(curry.isAnyPlaceholder(args, arity));
});

test('if isAnyPlaceholder returns false if no placeholders exist', (t) => {
  const args = [1, 2, 3];
  const arity = 3;

  t.false(curry.isAnyPlaceholder(args, arity));
});

test('if curry will make a function curriable', (t) => {
  const method = (a, b) => {
    return [a, b];
  };

  const curriedMethod = curry.curry(method);

  t.is(typeof curriedMethod, 'function');

  const a = 'a';
  const b = 'b';

  const curriedResult = curriedMethod(a);

  t.is(typeof curriedMethod, 'function');

  const result = curriedResult(b);

  t.deepEqual(result, [a, b]);
});
