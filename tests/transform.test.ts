import babel from "@babel/core";
import plugin from "../src/plugin.js";
import {
  recursion,
  nestedStatements,
  multipleReturns,
  noReturn,
  defaultParameter,
  spread,
  exceedingArgs,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternary,
  combinedLogicalTernary,
  wrapAnonymous1,
  wrapAnonymous2,
  wrapAnonymous3,
} from "../examples/transform.before.js";
import { mapToTestCases } from "./utils.js";

const cases = mapToTestCases({
  recursion,
  nestedStatements,
  multipleReturns,
  noReturn,
  defaultParameter,
  spread,
  exceedingArgs,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternary,
  combinedLogicalTernary,
  wrapAnonymous1,
  wrapAnonymous2,
  wrapAnonymous3,
});

describe("transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const t = babel.transform(testCase, { plugins: [plugin] });
    expect(t?.code).toMatchSnapshot();
  });
});
