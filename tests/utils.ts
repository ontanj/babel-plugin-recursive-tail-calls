export function mapToTestCases(cases: Record<string, Function>) {
  return Object.entries(cases)
    .map(([name, func]) => [name, func.toString()])
    .map(([name, func]) =>
      name.includes("arrowFunction")
        ? [name, "const arrowFunction = " + func]
        : [name, func],
    );
}
