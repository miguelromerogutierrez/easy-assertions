import { expectations, mapErrors, toBeDefined, toBeNumber, not } from '../Assertions/Assertions';
import * as constants from '../Assertions/constants';

function validateForm(form) {
  const nameErrors = mapErrors(expectations(form.name, [toBeDefined, not.isEmpty]), {
    [constants.TO_BE_DEFINED]: 'Name should be defined',
    [constants.NOT_IS_EMPTY]: 'Name should not be empty',
  });
  const ageErrors = mapErrors(expectations(form.age, [not.isEmpty, toBeNumber]), {
    [constants.NOT_IS_EMPTY]: 'Age should not be empty',
    [constants.IS_A_NUMBER]: 'Age should be a number',
  });
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

validateForm({ age: '' })
/* => {
    name: { error: true, errors: ['Name should be defined', 'Name should not be empty'] },
    age: { error: true, errors: ['Age should not be empty', 'Age should be a number'] },
  }
*/

validateForm({ name: 'Jhon', age: '27' })
/* => {
    name: { error: false, errors: [] },
    age: { error: false, errors: [] },
  }
*/