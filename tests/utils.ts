export function mapToTestCases(cases: Record<string, Function>) {
  return Object.entries(cases).map(([name, func]) => [name, func.toString()]);
}
