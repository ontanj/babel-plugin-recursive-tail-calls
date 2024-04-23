const babel = require('@babel/core');
const plugin = require("..");

const noRecursion = `
function noRecursion(a) {
  return func(a)
}
`;

const notTail = `
function notTail(a) {
  const c = notTail(a);
  return c;
}
`;

const cases = Object.entries({
  noRecursion,
  notTail
});

describe("no-transform", () => {
  it.each(cases)('%s', (_, testCase) => {
    const { code } = babel.transform(testCase, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
  });
});
