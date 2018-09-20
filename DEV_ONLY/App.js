import * as src from '../src';
import {assoc} from 'ramda';

console.log(src.add('d.f', 'df', {d: {f: []}}));
console.log(src.add(['d', 'f'], 'df', {d: {f: []}}));

// import '../benchmarks';

const object = {
  bar: 'baz',
  foo: [{bar: {baz: 'quz'}}],
};

const result = src.merge(
  ['foo', 0, 'bar'],
  {
    baz: 'nope',
    quz: 'blah',
  },
  object
);

console.log(result, object);

const foo = (() => {
  const Foo = function(value) {
    this.value = value;
  };

  Foo.prototype.getValue = function() {
    return this.value;
  };

  return new Foo('foo');
})();

console.log(assoc(0, 'value', foo));
console.log(src.set(0, 'value', foo));

const simpleObject = {
  foo,
  regexp: /regexp/,
  simple: 'value',
};

const simpleArray = ['simple', 'value'];

const deepObject = {
  deeply: [
    {
      nested: {
        'object with quoted keys': 'value',
      },
      untouched: true,
    },
    'untouched',
  ],
  untouched: true,
};

const deepArray = {
  deeply: {
    nested: ['array'],
    untouched: true,
  },
  untouched: true,
};

console.group('legend');

console.log('title | updated object | original object | are objects equal');

console.groupEnd('legend');

console.group('add');

const simpleAddObject = src.add('["other key"]', 'new value', simpleObject);

console.log('simple object', simpleAddObject, simpleObject, simpleAddObject === simpleObject);

console.log(simpleObject.regexp);

const simpleFoo = src.add('regexp.something', 'else', simpleObject);

console.log('custom prototype', simpleFoo, simpleObject, simpleFoo === simpleObject);

const simpleAddArray = src.add(null, 'new value', simpleArray);

console.log('simple array', simpleAddArray, simpleArray, simpleAddArray === simpleArray);

const deepAddObject = src.add('deeply[0].nested["other key"]', 'new value', deepObject);

console.log('deep object', deepAddObject, deepObject, deepAddObject === deepObject);

const deepAddArray = src.add('deeply.nested', 'new value', deepArray);

console.log('deep array', deepAddArray, deepArray, deepAddArray === deepArray);

console.groupEnd('add');

console.group('call');

const simpleCallObject = Object.assign({}, simpleObject, {
  method: (foo, bar) => {
    console.log('foo', 'bar');
    console.log('simple scope', this);

    return 'baz';
  },
});

const deepCallObject = Object.assign({}, deepObject, {
  deeply: {
    nested: [
      function method({quz}) {
        console.log('deep scope', this);

        return quz;
      },
    ],
  },
});

console.log(src.get('deeply.nested[0]', deepCallObject));

console.log('simple method found', src.call('method', ['foo', 'bar'], simpleCallObject));
console.log('simple method not method', src.call('simple', ['foo', 'bar'], simpleCallObject));
console.log('simple method not found', src.call('nope', ['foo', 'bar'], simpleCallObject));

console.log('native method', src.call('forEach', [(value) => console.log('value', value)], ['foo', 'bar']));

console.log('deep method found', src.call('deeply.nested[0]', [{quz: 'quz'}], deepCallObject));
console.log(
  'deep method found with custom scope',
  src.call('deeply.nested[0]', [{quz: 'quz'}], deepCallObject, {custom: 'scope'})
);
console.log('deep method not method', src.call('deeply.untouched', [{quz: 'quz'}], deepCallObject));
console.log('deep method not found', src.call('deeply.nope', [{quz: 'quz'}], deepCallObject));

console.log('window test', src.call(['addEventListener'], ['click', () => console.log('foo')], window));

class Foo {
  constructor(value) {
    this.value = value;
  }

  __getValue() {
    return this.value;
  }

  getValue() {
    return src.call(['__getValue'], [], this);
  }
}

console.log('class test', src.call(['getValue'], [], new Foo('bar')));

console.groupEnd('call');

console.group('get');

console.log('simple object', src.get('simple', simpleObject));
console.log('simple array', src.get(1, simpleArray));
console.log('deep object', src.get('deeply[0].nested["object with quoted keys"]', deepObject));
console.log('deep array', src.get('[0].nested["object with quoted keys"]', deepObject.deeply));

console.groupEnd('get');

console.group('has');

console.log('simple object true', src.has('simple', simpleObject));
console.log('simple object false', src.has('complex', simpleObject));
console.log('simple array true', src.has(1, simpleArray));
console.log('simple array false', src.has(7, simpleArray));
console.log('deep object true', src.has('deeply[0].nested["object with quoted keys"]', deepObject));
console.log('deep object false', src.has('deeply[0].nested["non-existent object"]', deepObject));
console.log('deep array true', src.has('[0].nested["object with quoted keys"]', deepObject.deeply));
console.log('deep array false', src.has('[0].nested["non-existent object"]', deepObject.deeply));

console.groupEnd('has');

console.group('assign');

const simpleAssignObject = src.assign(
  null,
  {
    different: 'value',
    simple: 'thing',
  },
  simpleObject
);

console.log('simple object', simpleAssignObject, simpleObject, simpleAssignObject === simpleObject);

const simpleAssignArray = src.assign(null, ['different', 'value'], simpleArray);

console.log('simple array', simpleAssignArray, simpleArray, simpleAssignArray === simpleArray);

const deepAssignObject = src.assign(
  'deeply[0].nested',
  {
    different: 'value',
    'object with quoted keys': 'thing',
  },
  deepObject
);

console.log('deep object', deepAssignObject, deepObject, deepAssignObject === deepObject);

const deepAssignArray = src.assign('deeply.nested', ['different', 'value'], deepArray);

console.log('deep array', deepAssignArray, deepArray, deepAssignArray === deepArray);

console.groupEnd('assign');

console.group('merge');

const simpleMergeObject = src.merge(
  null,
  {
    different: 'value',
    simple: 'thing',
  },
  simpleObject
);

console.log('simple object', simpleMergeObject, simpleObject, simpleMergeObject === simpleObject);

const simpleMergeArray = src.merge(null, ['different', 'value'], simpleArray);

console.log('simple array', simpleMergeArray, simpleArray, simpleMergeArray === simpleArray);

const deepMergeObject = src.merge(
  'deeply[0].nested',
  {
    different: 'value',
    'object with quoted keys': 'thing',
  },
  deepObject
);

console.log('deep object', deepMergeObject, deepObject, deepMergeObject === deepObject);

const deepMergeArray = src.merge('deeply.nested', ['different', 'value'], deepArray);

console.log('deep array', deepMergeArray, deepArray, deepMergeArray === deepArray);

console.groupEnd('merge');

console.group('remove');

const simpleRemoveObject = src.remove('simple', simpleObject);

console.log('simple object', simpleRemoveObject, simpleObject, simpleRemoveObject === simpleObject);

const simpleRemoveArray = src.remove(0, simpleArray);

console.log('simple array', simpleRemoveArray, simpleArray, simpleRemoveArray === simpleArray);

const deepRemoveObject = src.remove('deeply[0].nested["object with quoted keys"]', deepObject);

console.log('deep object', deepRemoveObject, deepObject, deepRemoveObject === deepObject);

const deepRemoveArray = src.remove('deeply.nested[0]', deepArray);

console.log('deep array', deepRemoveArray, deepArray, deepRemoveArray === deepArray);

const deepRemoveArrayInvalid = src.remove('foo.bar.baz', deepArray);

console.log('deep array invalid', deepRemoveArrayInvalid, deepArray, deepRemoveArrayInvalid === deepArray);

console.groupEnd('remove');

console.group('set');

const simpleSetObject = src.set('simple', 'new value', simpleObject);

console.log('simple object', simpleSetObject, simpleObject, simpleSetObject === simpleObject);

const simpleSetArray = src.set(1, 'new value', simpleArray);

console.log('simple array', simpleSetArray, simpleArray, simpleSetArray === simpleArray);

const deepSetObject = src.set('deeply[0].nested["object with quoted keys"]', 'new value', deepObject);

console.log('deep object', deepSetObject, deepObject, deepSetObject === deepObject);

const deepSetArray = src.set('deeply.nested[0]', 'new value', deepArray);

console.log('deep array', deepSetArray, deepArray, deepSetArray === deepArray);

console.groupEnd('set');

console.group('transform');

const additionalParam = 'additionalParam';

const simpleTransformObject = src.transform(
  'simple',
  (value, ...extra) => {
    console.log(value, extra);

    return 'new value';
  },
  simpleObject,
  additionalParam
);

console.log('simple object', simpleTransformObject, simpleObject, simpleTransformObject === simpleObject);

const simpleTransformArray = src.transform(
  1,
  (value, ...extra) => {
    console.log(value, extra);

    return 'new value';
  },
  simpleArray,
  additionalParam
);

console.log('simple array', simpleTransformArray, simpleArray, simpleTransformArray === simpleArray);

const deepTransformObject = src.transform(
  'deeply[0].nested["object with quoted keys"]',
  (value, ...extra) => {
    console.log(value, extra);

    return 'new value';
  },
  deepObject,
  additionalParam
);

console.log('deep object', deepTransformObject, deepObject, deepTransformObject === deepObject);

const deepTransformArray = src.transform(
  'deeply.nested[0]',
  (value, ...extra) => {
    console.log(value, extra);

    return 'new value';
  },
  deepArray,
  additionalParam
);

console.log('deep array', deepTransformArray, deepArray, deepTransformArray === deepArray);

console.groupEnd('transform');

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
