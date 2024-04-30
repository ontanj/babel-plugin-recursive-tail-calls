// one argument
export function base(a) {
  while (true) {
    if (a <= 0) {
      return a;
    }
    a = a - 1;
  }
}

// multiple arguments
export function multipleArgs(a, b) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
  }
}

// default argument value that is not used
export function defaultArgInactive(a, b = 0) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
  }
}

// default argument value
export function defaultArgActive(a, b = 0) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = 0;
  }
}

// default undefined argument
export function undefinedArg(a, b) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = undefined;
  }
}

// arrow function
export const arrowFunction = a => {
  while (true) {
    if (a <= 0) return a;
    a = a - 1;
  }
};