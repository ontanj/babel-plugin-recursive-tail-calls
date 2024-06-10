import babel from "@babel/core";
import plugin from "../src/plugin.js";
import {
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  wrapAnonymous1,
  nestedStatements,
  multipleReturns,
  noReturn,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternary,
  combinedLogicalTernary,
  wrapAnonymous2,
  wrapAnonymous3,
  exceedingArgs,
  spread,
} from "../examples/transform.before.js";
import { mapToTestCases } from "./utils.js";

const cases = mapToTestCases({
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  wrapAnonymous1,
  nestedStatements,
  multipleReturns,
  noReturn,
  logicalAnd,
  logicalOr,
  nullishCoalescing,
  ternary,
  combinedLogicalTernary,
  wrapAnonymous2,
  wrapAnonymous3,
  exceedingArgs,
  spread,
});

describe("transform", () => {
  it.each(cases)("%s", (_, testCase) => {
    const t = babel.transform(testCase, { plugins: [plugin] });
    expect(t?.code).toMatchSnapshot();
  });
});
