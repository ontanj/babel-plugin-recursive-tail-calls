import babel from "@babel/core";
import plugin from "../src/plugin.js";
import { fibonacci, isPrime, spread } from "../examples/transform.before.js";

describe("execute", () => {
  it("fibonacci", () => {
    const t = babel.transform(fibonacci.toString(), { plugins: [plugin] });
    const fib = (n: number) => eval(t?.code + `fibonacci(${n});`);
    expect(fib(20)).toEqual(4181);
    expect(fib(100000)).toEqual(Infinity);
  });

  it("prime", () => {
    const t = babel.transform(isPrime.toString(), { plugins: [plugin] });
    const prime = (n: number) => eval(t?.code + `isPrime(${n});`);
    expect(prime(37)).toEqual(true);
    expect(prime(35)).toEqual(false);
  });

  it("spread", () => {
    const t = babel.transform(spread.toString(), { plugins: [plugin] });
    const spreadF = (...ns: number[]) => eval(t?.code + `spread(${ns.join()})`);
    expect(spreadF(0, 1, 2, 3)).toEqual(3);
  });
});
