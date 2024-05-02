// one argument
export function base(a) {
  _tailCallLoop: while (true) {
    if (a <= 0) {
      return a;
    }
    a = a - 1;
    continue _tailCallLoop;
  }
}

// multiple arguments
export function multipleArgs(a, b) {
  _tailCallLoop2: while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
    continue _tailCallLoop2;
  }
}

// default argument value that is not used
export function defaultArgInactive(a, b = 0) {
  _tailCallLoop3: while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
    continue _tailCallLoop3;
  }
}

// default argument value
export function defaultArgActive(a, b = 0) {
  _tailCallLoop4: while (true) {
    if (a < b) return a;
    a = a - 1;
    b = 0;
    continue _tailCallLoop4;
  }
}

// default undefined argument
export function undefinedArg(a, b) {
  _tailCallLoop5: while (true) {
    if (a < b) return a;
    a = a - 1;
    b = undefined;
    continue _tailCallLoop5;
  }
}

// arrow function
export const arrowFunction = a => {
  _tailCallLoop6: while (true) {
    if (a <= 0) return a;
    a = a - 1;
    continue _tailCallLoop6;
  }
};

// nested statements
export function nestedStatements(a, b) {
  _tailCallLoop7: while (true) {
    if (a > b) {
      if (a > 0) {
        a = a - 1;
        b = b;
        continue _tailCallLoop7;
      }
      return a - b;
    }
    return a + b;
  }
}