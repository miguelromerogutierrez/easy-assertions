import { expectationsFP, mapErrorsFP, pipe, toBeDefined, toBeNumber, toBeGreaterThat, not } from '../Assertions/Assertions';
import * as constants from '../Assertions/constants';

const validateName = pipe(
  expectationsFP([toBeDefined, not.isEmpty]),
  mapErrorsFP({
    [constants.TO_BE_DEFINED]: 'Name should be defined',
    [constants.NOT_IS_EMPTY]: 'Name should not be empty',
  }),
);

const validateAge = pipe(
  expectationsFP([not.isEmpty, toBeNumber, toBeGreaterThat(18)]),
  mapErrorsFP({
    [constants.NOT_IS_EMPTY]: 'Age should not be empty',
    [constants.IS_A_NUMBER]: 'Age should be a number',
    [constants.IS_GRATHER_THAT]: 'Age should be major to 18',
  }),
);

function validateForm(form) {
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
  }
}

validateForm({ name: '', age: '' })
/* => {
    name: { error: true, errors: ['Name should not be empty'] },
    age: { error: true, errors: ['Age should not be empty', 'Age should be a number'] },
  }
*/

validateForm({ age: '10' })
/* => {
    name: { error: true, errors: ['Name should be defined', 'Name should not be empty'] },
    age: { error: true, errors: ['Age should be major to 18'] },
  }
*/

validateForm({ name: 'Jhon', age: '27' })
/* => {
    name: { error: false, errors: [] },
    age: { error: false, errors: [] },
  }
*/