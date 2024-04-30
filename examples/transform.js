// one argument
export function base(a) {
  if (a <= 0) {
    return a;
  }
  return base(a - 1);
}

// multiple arguments
export function multipleArgs(a, b) {
  if (a < b) return a;
  return multipleArgs(a - 1, b + 1);
}

// default argument value that is not used
export function defaultArgInactive(a, b = 0) {
  if (a < b) return a;
  return defaultArgInactive(a - 1, b + 1);
}

// default argument value
export function defaultArgActive(a, b = 0) {
  if (a < b) return a;
  return defaultArgActive(a - 1);
}

// default undefined argument
export function undefinedArg(a, b) {
  if (a < b) return a;
  return undefinedArg(a - 1);
}

// arrow function
export const arrowFunction = (a) => {
  if (a <= 0) return a;
  return arrowFunction(a - 1);
};
