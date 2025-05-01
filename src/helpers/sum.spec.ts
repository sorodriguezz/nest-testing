import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  it('should sum two numbers', () => {
    // arrange
    const num1 = 5;
    const num2 = 10;
    const expectedSum = 15;

    // act
    const result = sum(num1, num2);

    //assert
    expect(result).toBe(expectedSum);
  });
});
