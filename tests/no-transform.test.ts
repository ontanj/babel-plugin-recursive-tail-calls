import babel from "@babel/core";
import plugin from "../plugin.js";
import { mapToTestCases } from "./utils.js";
import { noRecursion, notTail, shadowing } from "../examples/no-transform.before.js";

const cases = mapToTestCases({
  noRecursion,
  notTail,
  shadowing,
});

describe("no-transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const t = babel.transform(testCase, { plugins: [plugin] });
    expect(t?.code).toMatchSnapshot();
  });
});
