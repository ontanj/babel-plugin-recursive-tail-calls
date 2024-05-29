import babel from "@babel/core";
import plugin from "../src/plugin.js";
import {
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  arrowFunction,
  nestedStatements,
  multipleReturns,
  noReturn,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternery,
  combinedLogicalTernery,
} from "../examples/transform.before.js";
import { mapToTestCases } from "./utils.js";

const cases = mapToTestCases({
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  arrowFunction,
  nestedStatements,
  multipleReturns,
  noReturn,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternery,
  combinedLogicalTernery
});

describe("transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const t = babel.transform(testCase, { plugins: [plugin] });
    expect(t?.code).toMatchSnapshot();
  });
});
