import babel from "@babel/core";
import plugin from "..";
import { fibonacci, isPrime } from "../examples/transform";

describe("execute", () => {
  it("fibonacci", () => {
    const { code } = babel.transform(fibonacci, { plugins: [plugin] });
    const fib = (n) => eval(code + `fibonacci(${n});`);
    expect(fib(20)).toEqual(4181);
    expect(fib(100000)).toEqual(Infinity);
  });

  it("prime", () => {
    const { code } = babel.transform(isPrime, { plugins: [plugin] });
    const prime = (n) => eval(code + `isPrime(${n});`);
    expect(prime(37)).toEqual(true);
    expect(prime(35)).toEqual(false);
  });
});
