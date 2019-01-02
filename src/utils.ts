// external dependencies
import { parse } from 'pathington';

const O = Object;
const { create, getOwnPropertySymbols, keys, propertyIsEnumerable } = O;
const { toString: toStringObject } = O.prototype;

const { toString: toStringFunction } = Function.prototype;

const FUNCTION_NAME = /^\s*function\s*([^\(]*)/i;

const REACT_ELEMENT: symbol | number =
  typeof Symbol === 'function' && typeof Symbol.for === 'function'
    ? Symbol.for('react.element')
    : 0xeac7;

const { isArray } = Array;

export const cloneArray: Function = (array: any[]): any[] => {
  // @ts-ignore
  const cloned = new array.constructor();

  for (let index = 0; index < array.length; index++) {
    cloned[index] = array[index];
  }

  return cloned;
};

export const reduce = (array: any[], fn: Function, initialValue: any): any => {
  let value: any = initialValue;

  for (let index: number = 0; index < array.length; index++) {
    value = fn(value, array[index]);
  }

  return value;
};

export const getOwnProperties: Function = (
  object: unchanged.Unchangeable,
): (string | symbol)[] => {
  const ownSymbols: symbol[] = getOwnPropertySymbols(object);

  if (!ownSymbols.length) {
    return keys(object);
  }

  return keys(object).concat(
    reduce(
      ownSymbols,
      (enumerableSymbols: symbol[], symbol: symbol): symbol[] => {
        if (propertyIsEnumerable.call(object, symbol)) {
          enumerableSymbols.push(symbol);
        }

        return enumerableSymbols;
      },
      [],
    ),
  );
};

export const assignFallback: Function = (
  target: unchanged.Unchangeable,
  source: unchanged.Unchangeable,
): unchanged.Unchangeable => {
  if (!source) {
    return target;
  }

  return reduce(
    getOwnProperties(source),
    (
      clonedObject: unchanged.Unchangeable,
      property: string,
    ): unchanged.Unchangeable => {
      clonedObject[property] = source[property];

      return clonedObject;
    },
    Object(target),
  );
};

const assign: Function =
  typeof O.assign === 'function' ? O.assign : assignFallback;

export const isCloneable: Function = (object: any): boolean => {
  if (
    !object ||
    typeof object !== 'object' ||
    object.$$typeof === REACT_ELEMENT
  ) {
    return false;
  }

  const type: string = toStringObject.call(object);

  return type !== '[object Date]' && type !== '[object RegExp]';
};

export const isEmptyPath: Function = (object: any): boolean =>
  object == null || (isArray(object) && !object.length);

export const isGlobalConstructor: Function = (fn: any): boolean =>
  typeof fn === 'function' &&
  // @ts-ignore
  global[fn.name || toStringFunction.call(fn).split(FUNCTION_NAME)[1]] === fn;

export const callIfFunction = (
  object: any,
  context: any,
  parameters: any[],
): any =>
  typeof object === 'function' ? object.apply(context, parameters) : void 0;

export const getNewEmptyChild: Function = (key: any): unchanged.Unchangeable =>
  typeof key === 'number' ? [] : {};

export const getNewEmptyObject: Function = (
  object: unchanged.Unchangeable,
): unchanged.Unchangeable => (isArray(object) ? [] : {});

export const getShallowClone = (
  object: unchanged.Unchangeable,
): unchanged.Unchangeable => {
  if (object.constructor === O) {
    return assign({}, object);
  }

  if (isArray(object)) {
    return cloneArray(object);
  }

  return isGlobalConstructor(object.constructor)
    ? {}
    : assign(create(object.__proto__), object);
};

export const isSameValueZero: Function = (value1: any, value2: any): boolean =>
  value1 === value2 || (value1 !== value1 && value2 !== value2);

export const cloneIfPossible: Function = (object: any): any =>
  isCloneable(object) ? getShallowClone(object) : object;

export const getCloneOrEmptyObject: Function = (
  object: unchanged.Unchangeable,
  nextKey: any,
): unchanged.Unchangeable =>
  isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);

export const getCoalescedValue: Function = (
  value: any,
  fallbackValue: any,
): any => (value === void 0 ? fallbackValue : value);

export const getParsedPath: Function = (
  path: unchanged.Path,
): unchanged.ParsedPath => (isArray(path) ? path : parse(path));

export const getCloneAtPath: Function = (
  path: unchanged.ParsedPath,
  object: unchanged.Unchangeable,
  onMatch: Function,
  index: number,
): any => {
  const key: unchanged.PathItem = path[index];
  const nextIndex: number = index + 1;

  if (nextIndex === path.length) {
    onMatch(object, key);
  } else {
    object[key] = getCloneAtPath(
      path,
      getCloneOrEmptyObject(object[key], path[nextIndex]),
      onMatch,
      nextIndex,
    );
  }

  return object;
};

export const getDeepClone: Function = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  onMatch: Function,
): unchanged.Unchangeable => {
  const parsedPath: unchanged.ParsedPath = getParsedPath(path);
  const topLevelClone: unchanged.Unchangeable = getCloneOrEmptyObject(
    object,
    parsedPath[0],
  );

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]);

    return topLevelClone;
  }

  return getCloneAtPath(parsedPath, topLevelClone, onMatch, 0);
};

export const getMergedObject: Function = (
  object1: unchanged.Unchangeable,
  object2: unchanged.Unchangeable,
  isDeep: boolean,
): unchanged.Unchangeable => {
  const isObject1Array: boolean = isArray(object1);

  if (isObject1Array !== isArray(object2) || !isCloneable(object1)) {
    return cloneIfPossible(object2);
  }

  if (isObject1Array) {
    return object1.concat(object2);
  }

  const target: unchanged.Unchangeable =
    object1.constructor === O || isGlobalConstructor(object1.constructor)
      ? {}
      : create(object1.__proto__);

  return reduce(
    getOwnProperties(object2),
    (clone: unchanged.Unchangeable, key: string): unchanged.Unchangeable => {
      clone[key] =
        isDeep && isCloneable(object2[key])
          ? getMergedObject(object1[key], object2[key], isDeep)
          : object2[key];

      return clone;
    },
    assign(target, object1),
  );
};

export const getNestedProperty: Function = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  noMatchValue?: any,
) => {
  const parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object
      ? getCoalescedValue(object[parsedPath[0]], noMatchValue)
      : noMatchValue;
  }

  let ref: any = object;
  let key: number | string = parsedPath[0];

  for (let index: number = 0; index < parsedPath.length - 1; index++) {
    if (!ref || !ref[key]) {
      return noMatchValue;
    }

    ref = ref[key];
    key = parsedPath[index + 1];
  }

  return ref ? getCoalescedValue(ref[key], noMatchValue) : noMatchValue;
};

export const getFullPath: Function = (
  path: unchanged.Path,
  object: unchanged.Unchangeable,
  fn?: Function,
): unchanged.Path => {
  const isPathEmpty: boolean = isEmptyPath(path);
  const valueAtPath: any = isPathEmpty
    ? object
    : fn
    ? fn(getNestedProperty(path, object))
    : getNestedProperty(path, object);

  return isArray(valueAtPath)
    ? isArray(path)
      ? path.concat([valueAtPath.length])
      : `${isPathEmpty ? '' : path}[${valueAtPath.length}]`
    : path;
};

export const splice: Function = (array: any[], splicedIndex: number): void => {
  if (array.length) {
    const { length } = array;

    let index: number = splicedIndex;

    while (index < length - 1) {
      array[index] = array[index + 1];

      ++index;
    }

    --array.length;
  }
};

export const throwInvalidFnError: Function = (): never => {
  throw new TypeError('handler passed is not of type "function".');
};
