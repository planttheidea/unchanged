// external dependencies
import { Curried, __, curry } from 'curriable';

// handlers
import {
  createAdd,
  createCall,
  createGet,
  createGetOr,
  createHas,
  createIs,
  createMerge,
  createNot,
  createRemove,
  createSet,
} from './handlers';

export { __ };

export const add = curry(createAdd(false));

export const addWith = curry(createAdd(true));

export const assign = curry(createMerge(false, false));

export const assignWith = curry(createMerge(true, false));

export const call = curry(createCall(false), 3) as Curried<unchanged.Call>;

export const callWith = curry(createCall(true), 4) as Curried<unchanged.CallWith>;

export const get = curry(createGet(false));

export const getOr = curry(createGetOr(false));

export const getWith = curry(createGet(true));

export const getWithOr = curry(createGetOr(true));

export const has = curry(createHas(false));

export const hasWith = curry(createHas(true));

export const is = curry(createIs(false));

export const isWith = curry(createIs(true));

export const merge = curry(createMerge(false, true));

export const mergeWith = curry(createMerge(true, true));

export const not = curry(createNot(false));

export const notWith = curry(createNot(true));

export const remove = curry(createRemove(false));

export const removeWith = curry(createRemove(true));

export const set = curry(createSet(false));

export const setWith = curry(createSet(true));
