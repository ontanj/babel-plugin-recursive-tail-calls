import babel from "@babel/core";
import plugin from "..";
import {
  fibonacci
} from "../examples/transform";

describe("execute", () => {
  it("fibonacci", () => {
    const { code } = babel.transform(fibonacci, { plugins: [plugin] });
    const fib = (n) => eval(code + `fibonacci(${n});`);
    expect(fib(20)).toEqual(4181);
    expect(fib(100000)).toEqual(Infinity);
  });
});
