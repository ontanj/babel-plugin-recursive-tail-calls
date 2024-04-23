const babel = require('@babel/core');
const plugin = require("..");

const base = `
function base(a) {
  if (a <= 0) {
    return a;
  }
  return base(a - 1);
}
`;

const multipleArgs = `
function multipleArgs(a, b) {
  if (a < b) return a
  return multipleArgs(a - 1, b + 1)
}
`;

const defaultArgInactive = `
function defaultArgInactive(a, b = 0) {
  if (a < b) return a
  return defaultArgInactive(a - 1, b + 1)
}
`;

const defaultArgActive = `
function defaultArgActive(a, b = 0) {
  if (a < b) return a
  return defaultArgActive(a - 1)
}
`;

const undefinedArg = `
function undefinedArg(a, b) {
  if (a < b) return a
  return undefinedArg(a - 1)
}
`;

const arrowFunction = `
const arrowFunction = (a) => {
  if (a <= 0) return a;
  return arrowFunction(a - 1)
}
`;

const cases = Object.entries({
  base,
  multipleArgs,
  defaultArgInactive,
  defaultArgActive,
  undefinedArg,
  arrowFunction
})

describe("transform", () => {
  it.each(cases)('%s', (_, testCase) => {
    const { code } = babel.transform(testCase, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
  });
});

