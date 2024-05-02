import babel from "@babel/core";
import plugin from "..";
import {
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  arrowFunction,
  nestedStatements,
} from "../examples/transform";
import { mapToTestCases } from "./utils";

const cases = mapToTestCases({
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  arrowFunction,
  nestedStatements,
});

describe("transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const { code } = babel.transform(testCase, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
  });
});
