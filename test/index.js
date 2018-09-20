/* eslint-disable no-magic-numbers */

// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as index from 'src/index';

// --- exports --- //

test('if all methods are present', (t) => {
  const {__esModule: ignored, ...values} = index;

  t.deepEqual(Object.keys(values).sort(), [
    '__',
    'add',
    'assign',
    'call',
    'get',
    'getOr',
    'has',
    'merge',
    'remove',
    'set',
    'transform',
  ]);
});

// --- add --- //

test('if add will add the top-level value to the object', (t) => {
  const object = {top: 'level'};

  const result = index.add('key', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    key: 'value',
  });
});

test('if add will add the top-level value to the nested array', (t) => {
  const object = {
    nested: ['top', 'level'],
  };

  const result = index.add('nested', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    nested: [...object.nested, 'value'],
  });
});

test('if add will add the deeply-nested value to the object when the key is a string', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.add('some.other', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: {
      other: 'value',
    },
  });
});

test('if add will add the deeply-nested value to the object when the key is an array', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.add(['some', 'other'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: {
      other: 'value',
    },
  });
});

test('if add will add the deeply-nested value to the array when the key is a string', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.add('[0].some[0].other', 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      some: [
        {
          other: 'value',
        },
      ],
    },
  ]);
});

test('if add will add the deeply-nested value to the array when the key is an array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.add([0, 'some', 0, 'other'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      some: [
        {
          other: 'value',
        },
      ],
    },
  ]);
});

test('if add will append the deeply-nested value to the array when the key is a string', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.add('[0]deeply', 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [object[0].deeply[0], 'value'],
    },
  ]);
});

test('if add will append the deeply-nested value to the array when the key is an array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.add([0, 'deeply'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [object[0].deeply[0], 'value'],
    },
  ]);
});

test('if add will return the value itself if an empty key is used for "add" to an array', (t) => {
  const object = {top: 'level'};

  const result = index.add(null, 'value', object);

  t.not(result, object);
  t.is(result, 'value');
});

test('if add will append the value to the array if an empty key is used for "add" on an array', (t) => {
  const object = ['top', 'level'];

  const result = index.add(null, 'value', object);

  t.not(result, object);
  t.deepEqual(result, [...object, 'value']);
});

test('if add will handle a ridiculous entry', (t) => {
  const object = {};
  const key = 'some[1].deeply[0]["nested key"]';
  const value = {crazy: 'value'};

  const result = index.add(key, value, object);

  t.not(result, object);
  t.deepEqual(result, {
    some: [
      undefined,
      {
        deeply: [
          {
            'nested key': value,
          },
        ],
      },
    ],
  });
});

// --- assign --- //

test('if assign will return the object to assign if the object is not cloneable', (t) => {
  const path = null;
  const objectToAssign = {
    object: 'to merge',
  };
  const object = null;

  const result = index.assign(path, objectToAssign, object);

  t.not(result, object);
  t.is(result, objectToAssign);
});

test('if assign will shallowly merge the complete objects if the key is empty', (t) => {
  const path = null;
  const objectToAssign = {
    object: 'to merge',
  };
  const object = {
    existing: 'object',
  };

  const result = index.assign(path, objectToAssign, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    ...objectToAssign,
  });
});

test('if assign will shallowly merge the objects at the path specified when the key is not empty', (t) => {
  const path = 'path';
  const objectToAssign = {
    deeply: {
      nested: {
        value: 'final value',
      },
    },
  };
  const object = {
    existing: 'object',
    [path]: {
      deeply: {
        nested: {
          untouched: true,
          value: 'overwritten value',
        },
      },
    },
  };

  const result = index.assign(path, objectToAssign, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: objectToAssign,
  });
});

// --- call -- //

test('if call will call the top-level method from the object', (t) => {
  const object = {
    topLevel: sinon.stub().returnsThis(),
  };
  const parameters = ['foo', 'bar'];
  const path = 'topLevel';

  const result = index.call(path, parameters, object);

  t.true(object.topLevel.calledOnce);
  t.true(object.topLevel.calledWith(...parameters));

  t.is(result, object);
});

test('if call will call the deeply-nested method from the object', (t) => {
  const object = {
    deeply: {
      nested: {
        method: sinon.stub().returnsThis(),
      },
    },
  };
  const parameters = ['foo', 'bar'];
  const path = 'deeply.nested.method';

  const result = index.call(path, parameters, object);

  t.true(object.deeply.nested.method.calledOnce);
  t.true(object.deeply.nested.method.calledWith(...parameters));

  t.is(result, object);
});

test('if call will call the method from the object with a custom context', (t) => {
  const object = {
    topLevel: sinon.stub().returnsThis(),
  };
  const parameters = ['foo', 'bar'];
  const path = 'topLevel';
  const context = {};

  const result = index.call(path, parameters, object, context);

  t.true(object.topLevel.calledOnce);
  t.true(object.topLevel.calledWith(...parameters));

  t.is(result, context);
});

test('if call will call the object itself if the key is empty', (t) => {
  const object = sinon.stub().returnsThis();
  const parameters = ['foo', 'bar'];
  const path = null;

  const result = index.call(path, parameters, object);

  t.true(object.calledOnce);
  t.true(object.calledWith(...parameters));

  t.is(result, object);
});

// --- get --- //

test('if get will return the top-level value from the object', (t) => {
  const object = {top: 'level'};

  const result = index.get('top', object);

  t.is(result, object.top);
});

test('if get will return the top-level value from the array', (t) => {
  const object = ['top', 'level'];

  const result = index.get(0, object);

  t.is(result, object[0]);
});

test('if get will return the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.get('deeply.nested', object);

  t.is(result, object.deeply.nested);
});

test('if get will return the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.get('[0]deeply[0].nested', object);

  t.is(result, object[0].deeply[0].nested);
});

test('if get will return the object itself when the key is empty', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.get(null, object);

  t.is(result, object);
});

test('if get will return the array itself when the key is empty', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.get(null, object);

  t.is(result, object);
});

test('if get will return undefined for a non-match on the top-level value from the object', (t) => {
  const object = {top: 'level'};

  const result = index.get('invalid', object);

  t.is(result, undefined);
});

test('if get will return undefined for a non-match on the top-level value from the array', (t) => {
  const object = ['top', 'level'];

  const result = index.get(2, object);

  t.is(result, undefined);
});

test('if get will return undefined for a non-match on the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.get('deeply.invalid', object);

  t.is(result, undefined);
});

test('if get will return undefined for a non-match on the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.get('[0]deeply[1].invalid', object);

  t.is(result, undefined);
});

test('if get will return the object itself for a non-match on the object itself when the key is empty', (t) => {
  const object = null;

  const result = index.get(null, object);

  t.is(result, object);
});

// --- getOr --- //

test('if getOr will return the top-level value from the object', (t) => {
  const object = {top: 'level'};
  const fallback = 'fallback';

  const result = index.getOr(fallback, 'top', object);

  t.is(result, object.top);
});

test('if getOr will return the top-level value from the array', (t) => {
  const object = ['top', 'level'];
  const fallback = 'fallback';

  const result = index.getOr(fallback, 0, object);

  t.is(result, object[0]);
});

test('if getOr will return the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };
  const fallback = 'fallback';

  const result = index.getOr(fallback, 'deeply.nested', object);

  t.is(result, object.deeply.nested);
});

test('if getOr will return the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];
  const fallback = 'fallback';

  const result = index.getOr(fallback, '[0]deeply[0].nested', object);

  t.is(result, object[0].deeply[0].nested);
});

test('if getOr will return the object itself when the key is empty', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };
  const fallback = 'fallback';

  const result = index.getOr(fallback, null, object);

  t.is(result, object);
});

test('if getOr will return the array itself when the key is empty', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];
  const fallback = 'fallback';

  const result = index.getOr(fallback, null, object);

  t.is(result, object);
});

test('if getOr will return the fallback for a non-match on the top-level value from the object', (t) => {
  const object = {top: 'level'};
  const fallback = 'fallback';

  const result = index.getOr(fallback, 'invalid', object);

  t.is(result, fallback);
});

test('if getOr will return the fallback for a non-match on the top-level value from the array', (t) => {
  const object = ['top', 'level'];
  const fallback = 'fallback';

  const result = index.getOr(fallback, 2, object);

  t.is(result, fallback);
});

test('if getOr will return the fallback for a non-match on the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };
  const fallback = 'fallback';

  const result = index.getOr(fallback, 'deeply.invalid', object);

  t.is(result, fallback);
});

test('if getOr will return the fallback for a non-match on the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];
  const fallback = 'fallback';

  const result = index.getOr(fallback, '[0]deeply[1].invalid', object);

  t.is(result, fallback);
});

test('if getOr will return the object itself for a non-match on the object itself when the key is empty', (t) => {
  const object = null;
  const fallback = 'fallback';

  const result = index.getOr(fallback, null, object);

  t.is(result, object);
});

// --- has --- //

test('if has will return true for the top-level value from the object', (t) => {
  const object = {top: 'level'};

  t.true(index.has('top', object));
});

test('if has will return true for the top-level value from the array', (t) => {
  const object = ['top', 'level'];

  t.true(index.has(0, object));
});

test('if has will return true for the deeply-nested value from the object', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  t.true(index.has('[0]deeply[0].nested', object));
});

test('if has will return true for the object itself when the key is empy', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  t.true(index.has(null, object));
});

test('if has will return true for the array itself when the key is empy', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  t.true(index.has(null, object));
});

test('if has will return false for a non-matching key on the top-level value from the object', (t) => {
  const object = {top: 'level'};

  t.false(index.has('invalid', object));
});

test('if has will return false for a non-matching key on the top-level value from the array', (t) => {
  const object = ['top', 'level'];

  t.false(index.has(2, object));
});

test('if has will return false   for a non-matching key on the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  t.false(index.has('deeply.invalid', object));
});

test('if has will return false for a non-matching key on the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  t.false(index.has('[0]deeply[1].invalid', object));
});

test('if has will return false for an empty object the key is empy', (t) => {
  const object = null;

  t.false(index.has(null, object));
});

// --- merge --- //

test('if merge will return the object to merge if the object is not cloneable', (t) => {
  const path = null;
  const objectToMerge = {
    object: 'to merge',
  };
  const object = null;

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.is(result, objectToMerge);
});

test('if merge will deeply merge the complete objects if the key is empty', (t) => {
  const path = null;
  const objectToMerge = {
    object: 'to merge',
  };
  const object = {
    existing: 'object',
  };

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    ...objectToMerge,
  });
});

test('if merge will deeply merge the objects at the path specified when the key is not empty', (t) => {
  const path = 'path';
  const objectToMerge = {
    deeply: {
      nested: {
        value: 'final value',
      },
    },
  };
  const object = {
    existing: 'object',
    [path]: {
      deeply: {
        nested: {
          untouched: true,
          value: 'overwritten value',
        },
      },
    },
  };

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: {
      deeply: {
        nested: {
          ...object[path].deeply.nested,
          ...objectToMerge.deeply.nested,
        },
      },
    },
  });
});

// --- remove --- //

test('if remove will return an empty version of the object when the key is empty', (t) => {
  const path = null;
  const object = {
    existing: 'object',
  };

  const result = index.remove(path, object);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if remove will remove the top-level value from the object', (t) => {
  const object = {key: 'value'};

  const result = index.remove('key', object);

  t.not(result, object);
  t.deepEqual(result, {});
});

test('if remove will remove the top-level value from the array', (t) => {
  const object = ['top', 'level'];

  const result = index.remove(0, object);

  t.not(result, object);
  t.deepEqual(result, object.slice(1));
});

test('if remove will remove the deeply-nested value from the object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.remove('deeply.nested', object);

  t.not(result, object);
  t.deepEqual(result, {
    deeply: {},
  });
});

test('if remove will remove the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.remove('[0].deeply[0].nested', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [{}],
    },
  ]);
});

test('if remove will return the object itself when there is no matching key', (t) => {
  const object = {key: 'value'};

  const result = index.remove('otherKey', object);

  t.is(result, object);
});

test('if remove will handle a ridiculous entry', (t) => {
  const object = {
    some: [
      undefined,
      {
        deeply: [
          [
            {
              nested: 'value',
            },
          ],
        ],
      },
    ],
    something: {
      totally: [
        {
          different: {
            that: [
              [
                {
                  should: {
                    be: 'untouched',
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  };
  const path = 'some[1].deeply[0][0].nested';

  const result = index.remove(path, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: [
      undefined,
      {
        deeply: [[{}]],
      },
    ],
  });
});

// --- set --- //

test('if set will set the value on the top-level object', (t) => {
  const object = {key: 'value'};

  const path = 'otherKey';
  const value = 'otherValue';

  const result = index.set(path, value, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: value,
  });
});

test('if set will set the value on the top-level array', (t) => {
  const object = ['top', 'level'];

  const path = 1;
  const value = 'otherValue';

  const result = index.set(path, value, object);

  t.not(result, object);
  t.deepEqual(result, object.map((objectValue, index) => (index === path ? value : objectValue)));
});

test('if set will set the value on the deeply-nested object', (t) => {
  const object = {
    deeply: {
      nested: 'value',
    },
  };

  const result = index.set('deeply.ensconsed', 'otherValue', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    deeply: {
      ...object.deeply,
      ensconsed: 'otherValue',
    },
  });
});

test('if set will set the value on the deeply-nested array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const result = index.set('[0].deeply[0].ensconsed', 'otherValue', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      deeply: [
        {
          ...object[0].deeply[0],
          ensconsed: 'otherValue',
        },
      ],
    },
  ]);
});

test('if set will handle a ridiculous entry', (t) => {
  const object = {
    some: [
      undefined,
      {
        deeply: [
          [
            {
              nested: 'value',
            },
          ],
        ],
      },
    ],
    something: {
      totally: [
        {
          different: {
            that: [
              [
                {
                  should: {
                    be: 'untouched',
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  };
  const path = 'some[1].deeply[0][0].nested';
  const value = 'new value';

  const result = index.set(path, value, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: [
      undefined,
      {
        deeply: [
          [
            {
              nested: value,
            },
          ],
        ],
      },
    ],
  });
});

// --- transform --- //

test('if transform will set the value on the top-level object', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = {key: 'value'};

  const path = 'otherKey';
  const value = 'otherValue';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: value,
  });
});

test('if transform will set the value on the top-level array', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = ['top', 'level'];

  const path = 1;
  const value = 'otherValue';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, object.map((objectValue, index) => (index === path ? value : objectValue)));
});

test('if transform will set the value on the deeply-nested object', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = {
    deeply: {
      nested: 'value',
    },
  };
  const path = 'deeply.ensconsed';
  const value = 'otherValue';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    deeply: {
      ...object.deeply,
      ensconsed: 'otherValue',
    },
  });
});

test('if transform will set the value on the deeply-nested array', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = [
    {
      deeply: [
        {
          nested: 'value',
        },
      ],
    },
  ];

  const path = '[0].deeply[0].ensconsed';
  const value = 'otherValue';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      deeply: [
        {
          ...object[0].deeply[0],
          ensconsed: 'otherValue',
        },
      ],
    },
  ]);
});

test('if transform will handle a ridiculous entry', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = {
    some: [
      undefined,
      {
        deeply: [
          [
            {
              nested: 'value',
            },
          ],
        ],
      },
    ],
    something: {
      totally: [
        {
          different: {
            that: [
              [
                {
                  should: {
                    be: 'untouched',
                  },
                },
              ],
            ],
          },
        },
      ],
    },
  };
  const path = 'some[1].deeply[0][0].nested';
  const value = 'new value';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: [
      undefined,
      {
        deeply: [
          [
            {
              nested: value,
            },
          ],
        ],
      },
    ],
  });
});

test('if transform will handle an empty path', (t) => {
  const additionalParams = ['foo', {}, ['bar']];

  const object = {key: 'value'};

  const path = null;
  const value = 'otherValue';

  const fn = (originalValue, ...extraParams) => {
    t.is(originalValue, index.get(path, object));
    t.deepEqual(extraParams, additionalParams);

    return value;
  };

  const result = index.transform(path, fn, object, ...additionalParams);

  t.not(result, object);
  t.deepEqual(result, value);
});

test('if transform specifically handles the redux use-case', (t) => {
  const state = {
    foo: {
      error: null,
      isLoading: true,
      values: [],
    },
  };

  const type = 'ACTION_TYPE';

  const action = {
    payload: ['some', 'stuff'],
    type,
  };

  const otherAction = {
    payload: {some: 'stuff'},
    type: 'OTHER_ACTION_TYPE',
  };

  const transformer = index.transform('foo', (foo, {payload: values}) => ({
    ...foo,
    isLoading: false,
    values,
  }));

  const reducer = (currentState, dispatchedAction) => {
    switch (dispatchedAction.type) {
      case type:
        return transformer(currentState, dispatchedAction);

      default:
        return currentState;
    }
  };

  const updatedState = reducer(state, action);

  t.not(updatedState, state);
  t.deepEqual(updatedState, {
    foo: {
      error: null,
      isLoading: false,
      values: action.payload,
    },
  });

  const notUpdatedState = reducer(updatedState, otherAction);

  t.is(notUpdatedState, updatedState);
  t.deepEqual(notUpdatedState, {
    foo: {
      error: null,
      isLoading: false,
      values: action.payload,
    },
  });
});
