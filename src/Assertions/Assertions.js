import * as constants  from './constants';

export const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x);
export const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x);

export const expectations = (value, asserts) => {
  return asserts.reduce((errors, assert) => {
    if (assert(value)) return errors;
    return [...errors, assert.prototype.errorCode];
  }, []);
}

export const mapErrors = (errors, map = {}) => {
  if (Object.keys(map).length > 0) return errors;
  return errors.map(errorCode => map[errorCode]);
}

export const expectationsFP = asserts => value => {
  return asserts.reduce((errors, assert) => {
    if (assert(value)) return errors;
    return [...errors, assert.prototype.errorCode];
  }, []);
};

export const mapErrorsFP = map => errors =>
errors.map(errorCode => map[errorCode]);

export const toBeDefined = value => value !== undefined;
toBeDefined.prototype.errorCode = constants.TO_BE_DEFINED;

export const toBeNull = value => value !== null;
toBeNull.prototype.errorCode = constants.TO_BE_NULL;

export const toBeGreaterThat = maxValue => value =>
  _.parseInt(value, 10) > maxValue;
toBeGreaterThat.prototype.errorCode = constants.IS_GRATHER_THAT;

export const toBeNumber = value => /^[0-9]+$/.test(value);
toBeNumber.prototype.errorCode = constants.IS_A_NUMBER;

export const isEmpty = value => {
  const condition = toBeGreaterThat(0);
  if(Array.isArray(value) || typeof value === 'string') return condition(value.length);
  if(typeof value === 'object' && value !== null)
    return condition(Object.keys(value).length);
  return false;
};
isEmpty.prototype.errorCode = constants.IS_EMPTY;

export const not = {
  toBeDefined: value => !toBeDefined(value),
  toBeNull: value => !toBeNull(value),
  isEmpty: value => !isEmpty(value),
};

not.toBeDefined.prototype.errorCode = constants.NOT_TO_BE_DEFINED;
not.toBeNull.prototype.errorCode = constants.NOT_TO_BE_NULL;
not.toBeNull.prototype.errorCode = constants.NOT_TO_BE_NULL;
not.isEmpty.prototype.errorCode = constants.NOT_IS_EMPTY;
