export const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x);
export const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x);

export const createAssert = (assertFn, codeError) => {
  function wrapper() {
    wrapper.errorCode = getCodeError(codeError, arguments);
    if (arguments.length === assertFn.length)
      return assertFn.apply(null, arguments);
    return createCurry(assertFn, arguments, codeError);
  }
  return wrapper;
};

function getCodeError(codeError, args) {
  if (typeof codeError === "function") {
    return codeError(...args);
  }
  return codeError;
}

function createCurry(fn, args, codeError) {
  function wrapper() {
    const __args = concat(args, arguments);
    wrapper.errorCode = getCodeError(codeError, __args);
    if (__args.length === fn.length) return fn.apply(null, __args);
    return createCurry(fn, __args, codeError);
  }
  return wrapper;
}

const toArray = obj => Object.keys(obj).map(key => obj[key]);
const concat = (obj1, obj2) => {
  const arr1 = toArray(obj1);
  const arr2 = toArray(obj2);
  return arr1.concat(arr2);
};

export const expectations = (value, asserts) => {
  return asserts.reduce((errors, assert) => {
    if (assert(value)) return errors;
    return [...errors, assert.errorCode];
  }, []);
};

export const mapErrors = (errors, map = {}) => {
  if (Object.keys(map).length > 0) return errors;
  return errors.map(errorCode => map[errorCode]);
};

export const expectationsFP = asserts => value => {
  return asserts.reduce((errors, assert) => {
    if (assert(value)) return errors;
    return [...errors, assert.errorCode];
  }, []);
};

export const mapErrorsFP = map => errors =>
  errors.map(errorCode => map[errorCode]);

export const not = assertFn => {
  function __not(value) {
    const result = assertFn(value);
    __not.errorCode = `NOT_${assertFn.errorCode}`;
    if (typeof result === "function") return not(result);
    return !result;
  }
  return __not;
};

export const trace = fn =>  {
  function __trace (value) {
    const result = fn(value);
    console.log({ value, result, errorCode: fn.errorCode });
    __trace.errorCode = fn.errorCode;
    return result;
  }
  return __trace;
};
