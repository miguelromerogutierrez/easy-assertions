import {
  pipe,
  expectationsFP,
  mapErrorsFP,
  not,
  createAssert,
  trace
} from "./Assertions";
import { validateForm, toBeGreaterThat } from "./examples";

describe("Assertions", () => {
  describe("test create assert function", () => {
    test("should return a curried function", () => {
      const curryFn = createAssert((a, b, c) => [a, b, c], "SOME_CODE_ERROR");
      expect(typeof curryFn).toBe("function");
      expect(typeof curryFn(1)).toBe("function");
      expect(typeof curryFn(1)(2)).toBe("function");
      expect(Array.isArray(curryFn(1)(2)(3))).toBe(true);
      expect(curryFn(1)(2)(3)).toEqual([1, 2, 3]);
    });
    test("should be inmutable curry", () => {
      const curryAdd = createAssert((a, b) => a + b, "SOME_CODE_ERROR");
      const add2 = curryAdd(2);
      expect(add2(3)).toEqual(5);
      expect(add2(2)).toEqual(4);
      expect(add2(1)).toEqual(3);
    });
    test("should return the value with a unary fn", () => {
      const toBe0 = createAssert(value => value === 0, "");
      expect(toBe0(0)).toEqual(true);
    });
    test("should create a custom message error", () => {
      const toBe = createAssert(
        (expectedValue, value) => value === expectedValue,
        expectedValue => `TO_BE_${expectedValue}`
      );
      const toBe0 = toBe(0);
      toBe0(1);
      expect(toBe0.errorCode).toEqual('TO_BE_0');
      const toBe1 = toBe(1);
      toBe1(1);
      expect(toBe1.errorCode).toEqual('TO_BE_1');
    });
  });
  describe("test expectationsFP function", () => {
    test("should return an array of errors", () => {
      const toBe = createAssert(
        (expectValue, value) => expectValue === value,
        "TO_BE"
      );
      const result = expectationsFP([toBe(0)])(1);
      expect(result).toEqual(["TO_BE"]);
    });
    test("should return an empty array", () => {
      const toBe = createAssert(
        (expectValue, value) => expectValue === value,
        "TO_BE"
      );
      const result = expectationsFP([toBe(0)])(0);
      expect(result).toEqual([]);
    });
  });
  describe('test mapErrorsFP function', () => {
    test('should return an array of errors decoded', () => {
      const toBeGreaterThan = createAssert(
        (maxValue, value) => parseInt(value, 10) > maxValue,
        (maxValue) => `BE_GREATER_THAN_${maxValue}`,
      )
      const validation = pipe(
        expectationsFP([toBeGreaterThan(15), not(toBeGreaterThan(22))]),
        mapErrorsFP({
          'BE_GREATER_THAN_15': 'Should be major than 15',
          'NOT_BE_GREATER_THAN_22': 'Should be less than 22',
        }),
      );
      expect(validation(14)).toEqual(['Should be major than 15']);
      expect(validation(23)).toEqual(['Should be less than 22']);
      expect(validation(20)).toEqual([]);
    })
    
  });
  describe("test not curry function", () => {
    test("should negate an assert function", () => {
      const result = pipe(
        expectationsFP([not(toBeGreaterThat(18))]),
        mapErrorsFP({
          NOT_IS_GRATHER_THAT: "Age should be less to 18"
        })
      )("20");
      expect(result).toEqual(["Age should be less to 18"]);
    });
    test("should negate an curry assert function", () => {
      const notBeGreaterThan = not(toBeGreaterThat);
      const result = pipe(
        expectationsFP([notBeGreaterThan(18)]),
        mapErrorsFP({
          NOT_IS_GRATHER_THAT: "Age should be less to 18"
        })
      )("20");
      expect(result).toEqual(["Age should be less to 18"]);
    });
  });
  describe('test trace function', () => {
    test('should print in console the value, result and code error for the fn that is tracing', () => {
      const toBeGreaterThan = createAssert(
        (maxValue, value) => parseInt(value, 10) > maxValue,
        (maxValue) => `BE_GREATER_THAN_${maxValue}`,
      );
      console.log = jest.fn();
      const validate = expectationsFP([trace(toBeGreaterThan(15)), trace(not(toBeGreaterThan(22)))]);
      const result = validate(10);
      expect(console.log.mock.calls[0][0]).toEqual({ value: 10, result: false, errorCode: 'BE_GREATER_THAN_15' })
      expect(console.log.mock.calls[1][0]).toEqual({ value: 10, result: true, errorCode: 'NOT_BE_GREATER_THAN_22' })
      expect(result).toEqual(['BE_GREATER_THAN_15'])
      console.log.mockRestore();
    });
    
  })
  
  test("Quick example", () => {
    const result = validateForm({ name: "", age: "" });
    expect(result).toEqual({
      age: {
        error: true,
        errors: [
          "Age should not be empty",
          "Age should be a number",
          "Age should be major to 18"
        ]
      },
      name: { error: true, errors: ["Name should not be empty"] }
    });
  });
});
