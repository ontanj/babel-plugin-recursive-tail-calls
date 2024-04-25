export function mapToTestCases(cases) {
  return Object.entries(cases)
    .map(([name, func]) => [name, func.toString()])
    .map(([name, func]) =>
      name.includes("arrowFunction")
        ? [name, "const arrowFunction = " + func]
        : [name, func])
}

