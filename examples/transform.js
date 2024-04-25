export function base(a) {
  if (a <= 0) {
    return a;
  }
  return base(a - 1);
}

export function multipleArgs(a, b) {
  if (a < b) return a
  return multipleArgs(a - 1, b + 1)
}

export function defaultArgInactive(a, b = 0) {
  if (a < b) return a
  return defaultArgInactive(a - 1, b + 1)
}

export function defaultArgActive(a, b = 0) {
  if (a < b) return a
  return defaultArgActive(a - 1)
}

export function undefinedArg(a, b) {
  if (a < b) return a
  return undefinedArg(a - 1)
}

export const arrowFunction = (a) => {
  if (a <= 0) return a;
  return arrowFunction(a - 1)
}

