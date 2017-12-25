import * as src from '../src';
import {assoc} from 'ramda';

// import '../benchmarks';

class Foo {
  constructor(value) {
    if (value && value.constructor === Object) {
      return Object.keys(value).reduce((reduced, key) => {
        if (reduced[key]) {
          reduced[key].value = new Foo(value[key]);
        } else {
          reduced[key] = {
            value: new Foo(value[key])
          };
        }

        return reduced;
      }, this);
    }

    this.value = value;

    return this;
  }
}

const object1 = new Foo({date: {willBe: 'overwritten'}, deep: {key: 'value'}});
const object2 = new Foo({date: new Date(), deep: {otherKey: 'otherValue'}, untouched: 'value'});

const result = src.merge(null, object1, object2);

console.log(object1);
console.log(object2);
console.log(result);

// const foo = (() => {
//   const Foo = function(value) {
//     this.value = value;
//   };
//
//   Foo.prototype.getValue = function() {
//     return this.value;
//   };
//
//   return new Foo('foo');
// })();
//
// console.log(assoc(0, 'value', foo));
// console.log(src.set(0, 'value', foo));
//
// const simpleObject = {
//   foo,
//   regexp: /regexp/,
//   simple: 'value'
// };
//
// const simpleArray = ['simple', 'value'];
//
// const deepObject = {
//   deeply: [
//     {
//       nested: {
//         'object with quoted keys': 'value'
//       },
//       untouched: true
//     },
//     'untouched'
//   ],
//   untouched: true
// };
//
// const deepArray = {
//   deeply: {
//     nested: ['array'],
//     untouched: true
//   },
//   untouched: true
// };
//
// console.group('legend');
//
// console.log('title | updated object | original object | are objects equal');
//
// console.groupEnd('legend');
//
// console.group('add');
//
// const simpleAddObject = src.add('["other key"]', 'new value', simpleObject);
//
// console.log('simple object', simpleAddObject, simpleObject, simpleAddObject === simpleObject);
//
// console.log(simpleObject.regexp);
//
// const simpleFoo = src.add('regexp.something', 'else', simpleObject);
//
// console.log('custom prototype', simpleFoo, simpleObject, simpleFoo === simpleObject);
//
// const simpleAddArray = src.add(null, 'new value', simpleArray);
//
// console.log('simple array', simpleAddArray, simpleArray, simpleAddArray === simpleArray);
//
// const deepAddObject = src.add('deeply[0].nested["other key"]', 'new value', deepObject);
//
// console.log('deep object', deepAddObject, deepObject, deepAddObject === deepObject);
//
// const deepAddArray = src.add('deeply.nested', 'new value', deepArray);
//
// console.log('deep array', deepAddArray, deepArray, deepAddArray === deepArray);
//
// console.groupEnd('add');
//
// console.group('get');
//
// console.log('simple object', src.get('simple', simpleObject));
// console.log('simple array', src.get(1, simpleArray));
// console.log('deep object', src.get('deeply[0].nested["object with quoted keys"]', deepObject));
// console.log('deep array', src.get('[0].nested["object with quoted keys"]', deepObject.deeply));
//
// console.groupEnd('get');
//
// console.group('has');
//
// console.log('simple object true', src.has('simple', simpleObject));
// console.log('simple object false', src.has('complex', simpleObject));
// console.log('simple array true', src.has(1, simpleArray));
// console.log('simple array false', src.has(7, simpleArray));
// console.log('deep object true', src.has('deeply[0].nested["object with quoted keys"]', deepObject));
// console.log('deep object false', src.has('deeply[0].nested["non-existent object"]', deepObject));
// console.log('deep array true', src.has('[0].nested["object with quoted keys"]', deepObject.deeply));
// console.log('deep array false', src.has('[0].nested["non-existent object"]', deepObject.deeply));
//
// console.groupEnd('has');
//
// console.group('merge');
//
// const simpleMergeObject = src.merge(null, {simple: 'thing', different: 'value'}, simpleObject);
//
// console.log('simple object', simpleMergeObject, simpleObject, simpleMergeObject === simpleObject);
//
// const simpleMergeArray = src.merge(null, ['different', 'value'], simpleArray);
//
// console.log('simple array', simpleMergeArray, simpleArray, simpleMergeArray === simpleArray);
//
// const deepMergeObject = src.merge(
//   'deeply[0].nested',
//   {'object with quoted keys': 'thing', different: 'value'},
//   deepObject
// );
//
// console.log('deep object', deepMergeObject, deepObject, deepMergeObject === deepObject);
//
// const deepMergeArray = src.merge('deeply.nested', ['different', 'value'], deepArray);
//
// console.log('deep array', deepMergeArray, deepArray, deepMergeArray === deepArray);
//
// console.groupEnd('merge');
//
// console.group('remove');
//
// const simpleRemoveObject = src.remove('simple', simpleObject);
//
// console.log('simple object', simpleRemoveObject, simpleObject, simpleRemoveObject === simpleObject);
//
// const simpleRemoveArray = src.remove(0, simpleArray);
//
// console.log('simple array', simpleRemoveArray, simpleArray, simpleRemoveArray === simpleArray);
//
// const deepRemoveObject = src.remove('deeply[0].nested["object with quoted keys"]', deepObject);
//
// console.log('deep object', deepRemoveObject, deepObject, deepRemoveObject === deepObject);
//
// const deepRemoveArray = src.remove('deeply.nested[0]', deepArray);
//
// console.log('deep array', deepRemoveArray, deepArray, deepRemoveArray === deepArray);
//
// const deepRemoveArrayInvalid = src.remove('foo.bar.baz', deepArray);
//
// console.log('deep array invalid', deepRemoveArrayInvalid, deepArray, deepRemoveArrayInvalid === deepArray);
//
// console.groupEnd('remove');
//
// console.group('set');
//
// const simpleSetObject = src.set('simple', 'new value', simpleObject);
//
// console.log('simple object', simpleSetObject, simpleObject, simpleSetObject === simpleObject);
//
// const simpleSetArray = src.set(1, 'new value', simpleArray);
//
// console.log('simple array', simpleSetArray, simpleArray, simpleSetArray === simpleArray);
//
// const deepSetObject = src.set('deeply[0].nested["object with quoted keys"]', 'new value', deepObject);
//
// console.log('deep object', deepSetObject, deepObject, deepSetObject === deepObject);
//
// const deepSetArray = src.set('deeply.nested[0]', 'new value', deepArray);
//
// console.log('deep array', deepSetArray, deepArray, deepSetArray === deepArray);
//
// console.groupEnd('set');

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
