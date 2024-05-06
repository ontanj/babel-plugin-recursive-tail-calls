import babel from "@babel/core";
import plugin from "..";
import { mapToTestCases } from "./utils";
import { noRecursion, notTail, shadowing } from "../examples/no-transform";

const cases = mapToTestCases({
  noRecursion,
  notTail,
  shadowing,
});

describe("no-transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const { code } = babel.transform(testCase, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
  });
});
