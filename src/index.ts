// external dependencies
import { __, curry } from 'curriable';

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

export const add = curry(createAdd(false), 3);

export const addWith = curry(createAdd(true), 3);

export const assign = curry(createMerge(false, false), 3);

export const assignWith = curry(createMerge(true, false), 3);

export const call = curry(createCall(false), 3);

export const callWith = curry(createCall(true), 4);

export const get = curry(createGet(false), 2);

export const getOr = curry(createGetOr(false), 3);

export const getWith = curry(createGet(true), 3);

export const getWithOr = curry(createGetOr(true), 4);

export const has = curry(createHas(false), 2);

export const hasWith = curry(createHas(true), 3);

export const is = curry(createIs(false), 3);

export const isWith = curry(createIs(true), 4);

export const merge = curry(createMerge(false, true), 3);

export const mergeWith = curry(createMerge(true, true), 3);

export const not = curry(createNot(false), 3);

export const notWith = curry(createNot(true), 4);

export const remove = curry(createRemove(false), 2);

export const removeWith = curry(createRemove(true), 3);

export const set = curry(createSet(false), 3);

export const setWith = curry(createSet(true), 3);
