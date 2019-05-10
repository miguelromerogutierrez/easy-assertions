import { createAssert, not, pipe, expectationsFP, mapErrorsFP } from "./Assertions";
import * as constants from "./constants";

export const toBeDefined = createAssert(
  value => value !== undefined,
  constants.TO_BE_DEFINED
);

export const toBeNull = createAssert(
  value => value !== null,
  constants.TO_BE_NULL
);

export const toBeGreaterThat = createAssert(
  (maxValue, value) => !isNaN(parseInt(value, 10)) && parseInt(value, 10) > maxValue,
  constants.IS_GRATHER_THAT
);

export const toBeNumber = createAssert(
  value => /^[0-9]+$/.test(value),
  constants.IS_A_NUMBER
);

export const toBeEqual = createAssert(
  (condition, value) => value === condition,
  "TO_BE_EQUAL"
);

export const isEmpty = createAssert(value => {
  const condition = toBeEqual(0);
  if (Array.isArray(value) || typeof value === "string")
    return condition(value.length);
  if (typeof value === "object" && value !== null)
    return condition(Object.keys(value).length);
  return false;
}, constants.IS_EMPTY);

export const notIsEmpty =  not(isEmpty);

export const validateName = pipe(
  expectationsFP([toBeDefined, notIsEmpty]),
  mapErrorsFP({
    [constants.TO_BE_DEFINED]: "Name should be defined",
    [constants.NOT_IS_EMPTY]: "Name should not be empty"
  })
);

export const validateAge = pipe(
  expectationsFP([notIsEmpty, toBeNumber, toBeGreaterThat(18)]),
  mapErrorsFP({
    [constants.NOT_IS_EMPTY]: "Age should not be empty",
    [constants.IS_A_NUMBER]: "Age should be a number",
    [constants.IS_GRATHER_THAT]: "Age should be major to 18"
  })
);

export function validateForm(form) {
  const nameErrors = validateName(form.name);
  const ageErrors = validateAge(form.age);
  return {
    name: {
      error: nameErrors.length > 0,
      errors: nameErrors
    },
    age: {
      error: ageErrors.length > 0,
      errors: ageErrors
    }
  };
}