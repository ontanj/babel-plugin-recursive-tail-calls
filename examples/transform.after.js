// one argument
export function base(a) {
  let _continueRecursion = true;
  _tailCallLoop: while (_continueRecursion) {
    _continueRecursion = false;
    if (a <= 0) {
      return a;
    }
    [a] = [a - 1];
    _continueRecursion = true;
    continue _tailCallLoop;
  }
}

// multiple arguments
export function multipleArgs(a, b) {
  let _continueRecursion2 = true;
  _tailCallLoop2: while (_continueRecursion2) {
    _continueRecursion2 = false;
    if (a < b) return a;
    [a, b] = [a - 1, b + 1];
    _continueRecursion2 = true;
    continue _tailCallLoop2;
  }
}

// default argument value that is not used
export function defaultArgInactive(a, b = 0) {
  let _continueRecursion3 = true;
  _tailCallLoop3: while (_continueRecursion3) {
    _continueRecursion3 = false;
    if (a < b) return a;
    [a, b] = [a - 1, b + 1];
    _continueRecursion3 = true;
    continue _tailCallLoop3;
  }
}

// default argument value
export function defaultArgActive(a, b = 0) {
  let _continueRecursion4 = true;
  _tailCallLoop4: while (_continueRecursion4) {
    _continueRecursion4 = false;
    if (a < b) return a;
    [a, b] = [a - 1, 0];
    _continueRecursion4 = true;
    continue _tailCallLoop4;
  }
}

// default undefined argument
export function undefinedArg(a, b) {
  let _continueRecursion5 = true;
  _tailCallLoop5: while (_continueRecursion5) {
    _continueRecursion5 = false;
    if (a < b) return a;
    [a, b] = [a - 1, undefined];
    _continueRecursion5 = true;
    continue _tailCallLoop5;
  }
}

// arrow function
export const arrowFunction = a => {
  let _continueRecursion6 = true;
  _tailCallLoop6: while (_continueRecursion6) {
    _continueRecursion6 = false;
    if (a <= 0) return a;
    [a] = [a - 1];
    _continueRecursion6 = true;
    continue _tailCallLoop6;
  }
};

// nested statements
export function nestedStatements(a, b) {
  let _continueRecursion7 = true;
  _tailCallLoop7: while (_continueRecursion7) {
    _continueRecursion7 = false;
    if (a > b) {
      if (a > 0) {
        [a, b] = [a - 1, b];
        _continueRecursion7 = true;
        continue _tailCallLoop7;
      }
      return a - b;
    }
    return a + b;
  }
}

// multiple returns
export function multipleReturns(a, b, c) {
  let _continueRecursion8 = true;
  _tailCallLoop8: while (_continueRecursion8) {
    _continueRecursion8 = false;
    if (a < 0) return a;
    if (b < 0) {
      const n = b + c;
      [a, b, c] = [n, b, c + 1];
      _continueRecursion8 = true;
      continue _tailCallLoop8;
    }
    [a, b, c] = [a + 1, b + 1, c];
    _continueRecursion8 = true;
    continue _tailCallLoop8;
  }
}

// fibonacci
export function fibonacci(n, a = 0, b = 1) {
  let _continueRecursion9 = true;
  _tailCallLoop9: while (_continueRecursion9) {
    _continueRecursion9 = false;
    if (n === 1) {
      return a;
    } else if (n === 2) {
      return b;
    } else {
      [n, a, b] = [n - 1, b, a + b];
      _continueRecursion9 = true;
      continue _tailCallLoop9;
    }
  }
}

// prime number
export function isPrime(n, d = 2) {
  let _continueRecursion10 = true;
  _tailCallLoop10: while (_continueRecursion10) {
    _continueRecursion10 = false;
    if (n % d === 0) {
      return false;
    } else if (d ** 2 > n) {
      return true;
    } else {
      [n, d] = [n, d + 1];
      _continueRecursion10 = true;
      continue _tailCallLoop10;
    }
  }
}

// no return
export function noReturn(a, b) {
  let _continueRecursion11 = true;
  _tailCallLoop11: while (_continueRecursion11) {
    _continueRecursion11 = false;
    if (a < 10) {
      [a, b] = [a + b, b];
      _continueRecursion11 = true;
      continue _tailCallLoop11;
    } else if (a % 2 === 0) {
      return a;
    }
  }
}
