# easy-assertions.js

Easy assertions is a tiny library just with three simple functions to make easier validate any data.

Feel free to fork/copy this project and use it to your own project.

----

## Principle
I'm based this project in functional programming, so i recommend to you have the basics knowledge about FP (compose and curry functions).

## Why
I want an easy way to validate my form values and using inmutable values.

## How
This library works in two sections.

The first is create an assertion that should validate a primitive value:

```javascript
import { createAssert } from 'easy-assertions';
const toBe = createAssert(
  (condition, value) => condition === value,
  condition => `TO_BE_${condition}`,
)
const toBe0 = toBe(0);
// => returns a function that will validate to be 0;
console.log(toBe0(0)) // => true
console.log(toBe0(1)) // => false
```
`createAssert` will receive a validator function and a custom message that could be a string or a function that will receive the same params that the validator function.

Once we have our assert functions we could use the `expectations` function.

```javascript
import { expectationsFP } from 'easy-assertions';
const validateToBe0 = expectationsFP([toBe(0)]);
console.log(validateToBe0(0)) // => [];
console.log(validateToBe0(1)) // => ['TO_BE_0'];
```

`expectationsFP` will receive an array of assert functions, then will receive the primitive value to validate by the assert functions and will return an empty array if there are any errors, or will return an array with the code errors of every assert function.

Addtional you can map this code errors to a more legible errors.

```javascript
import { pipe, expectationsFP, mapErrorsFP, createAssert } from 'easy-assertions';

const toBeGreaterThan = createAssert(
  (maxValue, value) => parseInt(value, 10) > maxValue,
  (maxValue) => `BE_GREATER_THAN_${maxValue}`,
);

const validate = pipe(
  expectationsFP([toBeGreaterThan(15), not(toBeGreaterThan(22))]),
  mapErrorsFP({
    'BE_GREATER_THAN_15': 'Should be major than 15',
    'NOT_BE_GREATER_THAN_22': 'Should be less than 22',
  }),
);

console.log(validate(14)) // => ["Should be major than 15"]
console.log(validate(23)) // => ["Should be less than 22"]
console.log(validate(20)) // => []
```

## Contributors
[Mike Romero](https://medium.com/@miguel.angel.romero.gtz)
