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

// nested statements
export function nestedStatements(a, b) {
  if (a > b) {
    if (a > 0) {
      return nestedStatements(a - 1, b);
    }
    return a - b;
  }
  return a + b;
}

// multiple returns
export function multipleReturns(a, b, c) {
  if (a < 0) return a;
  if (b < 0) {
    const n = b + c;
    return multipleReturns(n, b, c + 1);
  }
  return multipleReturns(a + 1, b + 1, c);
}

// fibonacci
export function fibonacci(n, a = 0, b = 1) {
  if (n === 1) {
    return a;
  } else if (n === 2) {
    return b;
  } else {
    return fibonacci(n - 1, b, a + b);
  }
}

// prime number
export function isPrime(n, d = 2) {
  if (n % d === 0) {
    return false;
  } else if (d ** 2 > n) {
    return true;
  } else {
    return isPrime(n, d + 1);
  }
}
