/**
 * @constant {Symbol} __
 */
export const __ = typeof Symbol === 'function' ? Symbol('placeholder') : 0xedd1;

/**
 * @function getPassedArgs
 *
 * @description
 * get the complete args with previous placeholders being filled in
 *
 * @param {Array<*>} originalArgs the arguments from the previous run
 * @param {Array<*>} nextArgs the arguments from the next run
 * @returns {Array<*>} the complete list of args
 */
export const getPassedArgs = (originalArgs, nextArgs) => {
  const argsToPass = new Array(originalArgs.length);

  for (let index = 0; index < originalArgs.length; index++) {
    argsToPass[index] = originalArgs[index] === __ && nextArgs.length ? nextArgs.shift() : originalArgs[index];
  }

  return nextArgs.length ? argsToPass.concat(nextArgs) : argsToPass;
};

/**
 * @function isAnyPlaceholder
 *
 * @description
 * determine if any of the arguments are placeholders
 *
 * @param {Array<*>} args the args passed to the function
 * @param {number} arity the arity of the function
 * @returns {boolean} are any of the args placeholders
 */
export const isAnyPlaceholder = (args, arity) => {
  for (let index = 0; index < arity; index++) {
    if (args[index] === __) {
      return true;
    }
  }

  return false;
};

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param {function} fn the method to make curriable
 * @returns {function(*): *} the fn passed as a curriable method
 */
export const curry = (fn) => {
  const arity = fn.length;

  const curried = (...args) => {
    return args.length >= arity && !isAnyPlaceholder(args, arity)
      ? fn(...args)
      : (...nextArgs) => {
        return curried(...getPassedArgs(args, nextArgs));
      };
  };

  return curried;
};
