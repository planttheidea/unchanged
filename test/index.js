// test
import test from 'ava';

// src
import * as index from 'src/index';

test('if add will add the top-level value to the object', (t) => {
  const object = {top: 'level'};

  const result = index.add('key', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    key: 'value'
  });
});

test('if add will add the top-level value to the nested array', (t) => {
  const object = {
    nested: ['top', 'level']
  };

  const result = index.add('nested', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    nested: [...object.nested, 'value']
  });
});

test('if add will add the deeply-nested value to the object when the key is a string', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };

  const result = index.add('some.other', 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: {
      other: 'value'
    }
  });
});

test('if add will add the deeply-nested value to the object when the key is an array', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };

  const result = index.add(['some', 'other'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: {
      other: 'value'
    }
  });
});

test('if add will add the deeply-nested value to the array when the key is a string', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.add('[0].some[0].other', 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      some: [
        {
          other: 'value'
        }
      ]
    }
  ]);
});

test('if add will add the deeply-nested value to the array when the key is an array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.add([0, 'some', 0, 'other'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      some: [
        {
          other: 'value'
        }
      ]
    }
  ]);
});

test('if add will append the deeply-nested value to the array when the key is a string', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.add('[0]deeply', 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [object[0].deeply[0], 'value']
    }
  ]);
});

test('if add will append the deeply-nested value to the array when the key is an array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.add([0, 'deeply'], 'value', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [object[0].deeply[0], 'value']
    }
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
            'nested key': value
          }
        ]
      }
    ]
  });
});

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
      nested: 'value'
    }
  };

  const result = index.get('deeply.nested', object);

  t.is(result, object.deeply.nested);
});

test('if get will return the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.get('[0]deeply[0].nested', object);

  t.is(result, object[0].deeply[0].nested);
});

test('if get will return the object itself when the key is empty', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };

  const result = index.get(null, object);

  t.is(result, object);
});

test('if get will return the array itself when the key is empty', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
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
      nested: 'value'
    }
  };

  const result = index.get('deeply.invalid', object);

  t.is(result, undefined);
});

test('if get will return undefined for a non-match on the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.get('[0]deeply[1].invalid', object);

  t.is(result, undefined);
});

test('if get will return the object itself for a non-match on the object itself when the key is empty', (t) => {
  const object = null;

  const result = index.get(null, object);

  t.is(result, object);
});

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
          nested: 'value'
        }
      ]
    }
  ];

  t.true(index.has('[0]deeply[0].nested', object));
});

test('if has will return true for the object itself when the key is empy', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };

  t.true(index.has(null, object));
});

test('if has will return true for the array itself when the key is empy', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
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
      nested: 'value'
    }
  };

  t.false(index.has('deeply.invalid', object));
});

test('if has will return false for a non-matching key on the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  t.false(index.has('[0]deeply[1].invalid', object));
});

test('if has will return false for an empty object the key is empy', (t) => {
  const object = null;

  t.false(index.has(null, object));
});

test('if merge will return the object to merge if the object is not cloneable', (t) => {
  const path = null;
  const objectToMerge = {
    object: 'to merge'
  };
  const object = null;

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.is(result, objectToMerge);
});

test('if merge will merge the complete objects if the key is empty', (t) => {
  const path = null;
  const objectToMerge = {
    object: 'to merge'
  };
  const object = {
    existing: 'object'
  };

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    ...objectToMerge
  });
});

test('if merge will merge the objects at the path specified when the key is not empty', (t) => {
  const path = 'path';
  const objectToMerge = {
    object: 'to merge',
    [path]: 'final value'
  };
  const object = {
    existing: 'object',
    [path]: 'overwritten value'
  };

  const result = index.merge(path, objectToMerge, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: {
      ...objectToMerge
    }
  });
});

test('if remove will return an empty version of the object when the key is empty', (t) => {
  const path = null;
  const object = {
    existing: 'object'
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
      nested: 'value'
    }
  };

  const result = index.remove('deeply.nested', object);

  t.not(result, object);
  t.deepEqual(result, {
    deeply: {}
  });
});

test('if remove will remove the deeply-nested value from the array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.remove('[0].deeply[0].nested', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      deeply: [{}]
    }
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
              nested: 'value'
            }
          ]
        ]
      }
    ],
    something: {
      totally: [
        {
          different: {
            that: [
              [
                {
                  should: {
                    be: 'untouched'
                  }
                }
              ]
            ]
          }
        }
      ]
    }
  };
  const path = 'some[1].deeply[0][0].nested';

  const result = index.remove(path, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    some: [
      undefined,
      {
        deeply: [[{}]]
      }
    ]
  });
});

test('if set will set the value on the top-level object', (t) => {
  const object = {key: 'value'};

  const path = 'otherKey';
  const value = 'otherValue';

  const result = index.set(path, value, object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    [path]: value
  });
});

test('if set will set the value on the top-level array', (t) => {
  const object = ['top', 'level'];

  const path = 1;
  const value = 'otherValue';

  const result = index.set(path, value, object);

  t.not(result, object);
  t.deepEqual(
    result,
    object.map((objectValue, index) => {
      return index === path ? value : objectValue;
    })
  );
});

test('if set will set the value on the deeply-nested object', (t) => {
  const object = {
    deeply: {
      nested: 'value'
    }
  };

  const result = index.set('deeply.ensconsed', 'otherValue', object);

  t.not(result, object);
  t.deepEqual(result, {
    ...object,
    deeply: {
      ...object.deeply,
      ensconsed: 'otherValue'
    }
  });
});

test('if set will set the value on the deeply-nested array', (t) => {
  const object = [
    {
      deeply: [
        {
          nested: 'value'
        }
      ]
    }
  ];

  const result = index.set('[0].deeply[0].ensconsed', 'otherValue', object);

  t.not(result, object);
  t.deepEqual(result, [
    {
      ...object[0],
      deeply: [
        {
          ...object[0].deeply[0],
          ensconsed: 'otherValue'
        }
      ]
    }
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
              nested: 'value'
            }
          ]
        ]
      }
    ],
    something: {
      totally: [
        {
          different: {
            that: [
              [
                {
                  should: {
                    be: 'untouched'
                  }
                }
              ]
            ]
          }
        }
      ]
    }
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
              nested: value
            }
          ]
        ]
      }
    ]
  });
});
