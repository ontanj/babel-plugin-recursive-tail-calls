// trivial case
export function recursion(a, b) {
  let _continueRecursion = true;
  _tailCallLoop: while (_continueRecursion) {
    _continueRecursion = false;
    if (a < b) return a;
    [a, b] = [a - 1, b + 1];
    _continueRecursion = true;
    continue _tailCallLoop;
  }
}

// nested statements
export function nestedStatements(a, b) {
  let _continueRecursion2 = true;
  _tailCallLoop2: while (_continueRecursion2) {
    _continueRecursion2 = false;
    if (a > b) {
      if (a > 0) {
        [a, b] = [a - 1, b];
        _continueRecursion2 = true;
        continue _tailCallLoop2;
      }
      return a - b;
    }
    return a + b;
  }
}

// multiple returns
export function multipleReturns(a, b, c) {
  let _continueRecursion3 = true;
  _tailCallLoop3: while (_continueRecursion3) {
    _continueRecursion3 = false;
    if (a < 0) return a;
    if (b < 0) {
      const n = b + c;
      [a, b, c] = [n, b, c + 1];
      _continueRecursion3 = true;
      continue _tailCallLoop3;
    }
    [a, b, c] = [a + 1, b + 1, c];
    _continueRecursion3 = true;
    continue _tailCallLoop3;
  }
}

// no return
export function noReturn(a, b) {
  let _continueRecursion4 = true;
  _tailCallLoop4: while (_continueRecursion4) {
    _continueRecursion4 = false;
    if (a < 10) {
      [a, b] = [a + b, b];
      _continueRecursion4 = true;
      continue _tailCallLoop4;
    } else if (a % 2 === 0) {
      return a;
    }
  }
}

/* Arguments and parameters */

// default parameter value
export function defaultParameter(a, b = 0) {
  let _continueRecursion5 = true;
  _tailCallLoop5: while (_continueRecursion5) {
    _continueRecursion5 = false;
    if (a < b) return a;
    [a, b = 0] = [a - 1];
    _continueRecursion5 = true;
    continue _tailCallLoop5;
  }
}

// rest/spread
export function spread(a, b, ...c) {
  let _continueRecursion6 = true;
  _tailCallLoop6: while (_continueRecursion6) {
    _continueRecursion6 = false;
    if (a > b) return a;
    [a, b, ...c] = [b, ...c, a];
    _continueRecursion6 = true;
    continue _tailCallLoop6;
  }
}

// exeeding arguments
export function exceedingArgs(a, b) {
  let _continueRecursion7 = true;
  _tailCallLoop7: while (_continueRecursion7) {
    _continueRecursion7 = false;
    if (a > b) return a - b;
    [a, b] = [a + b, b, console.log("CALL")];
    _continueRecursion7 = true;
    continue _tailCallLoop7;
  }
}

/* Logical and conditional */

// logical and
export function logicalAnd(a, b) {
  let _continueRecursion8 = true;
  _tailCallLoop8: while (_continueRecursion8) {
    _continueRecursion8 = false;
    if (a > 100) {
      return b;
    }
    const _symbol = Symbol();
    const _evaluation = a && _symbol;
    if (_evaluation === _symbol) {
      [a, b] = [a + 1, b + 1];
      _continueRecursion8 = true;
      continue _tailCallLoop8;
    } else {
      return _evaluation;
    }
  }
}

// logical or
export function logicalOr(a, b) {
  let _continueRecursion9 = true;
  _tailCallLoop9: while (_continueRecursion9) {
    _continueRecursion9 = false;
    if (a > 100) {
      return b;
    }
    const _symbol2 = Symbol();
    const _evaluation2 = a || _symbol2;
    if (_evaluation2 === _symbol2) {
      [a, b] = [a + 1, b + 1];
      _continueRecursion9 = true;
      continue _tailCallLoop9;
    } else {
      return _evaluation2;
    }
  }
}

// nullish coalescing
export function nullishCoalescing(a, b) {
  let _continueRecursion10 = true;
  _tailCallLoop10: while (_continueRecursion10) {
    _continueRecursion10 = false;
    const _symbol3 = Symbol();
    const _evaluation3 = a ?? _symbol3;
    if (_evaluation3 === _symbol3) {
      [a, b] = [b > 100 ? b : null, b + 1];
      _continueRecursion10 = true;
      continue _tailCallLoop10;
    } else {
      return _evaluation3;
    }
  }
}

// ternary
export function ternary(a, b, c) {
  let _continueRecursion11 = true;
  _tailCallLoop11: while (_continueRecursion11) {
    _continueRecursion11 = false;
    if (a > 10) {
      return c;
    } else {
      [a, b, c] = [a + b, b, c + a];
      _continueRecursion11 = true;
      continue _tailCallLoop11;
    }
  }
}

// combined logical ternary
export function combinedLogicalTernary(a, b) {
  let _continueRecursion12 = true;
  _tailCallLoop12: while (_continueRecursion12) {
    _continueRecursion12 = false;
    const _symbol4 = Symbol();
    const _evaluation4 = a > 0 && _symbol4;
    if (_evaluation4 === _symbol4) {
      if (a > 10) {
        const _symbol5 = Symbol();
        const _evaluation5 = b || _symbol5;
        if (_evaluation5 === _symbol5) {
          [a, b] = [a + 1, (b + 1) % 5];
          _continueRecursion12 = true;
          continue _tailCallLoop12;
        } else {
          return _evaluation5;
        }
      } else {
        [a, b] = [a + 1, (b + 2) % 2];
        _continueRecursion12 = true;
        continue _tailCallLoop12;
      }
    } else {
      return _evaluation4;
    }
  }
}

/* Anonymous functions */

// arrow function
export function wrapAnonymous1() {
  const arrowFunction = a => {
    let _continueRecursion14 = true;
    _tailCallLoop14: while (_continueRecursion14) {
      _continueRecursion14 = false;
      if (a <= 0) return a;
      [a] = [a - 1];
      _continueRecursion14 = true;
      continue _tailCallLoop14;
    }
  };
}

// arrow function with no body
export function wrapAnonymous2() {
  const arrowFunctionNoBody = a => {
    let _continueRecursion16 = true;
    _tailCallLoop16: while (_continueRecursion16) {
      _continueRecursion16 = false;
      if (a <= 0) {
        return a;
      } else {
        [a] = [a - 1];
        _continueRecursion16 = true;
        continue _tailCallLoop16;
      }
    }
  };
}

// function expression
export function wrapAnonymous3() {
  const functionExpression = function (a) {
    let _continueRecursion18 = true;
    _tailCallLoop18: while (_continueRecursion18) {
      _continueRecursion18 = false;
      if (a <= 0) return a;
      [a] = [a - 1];
      _continueRecursion18 = true;
      continue _tailCallLoop18;
    }
  };
}

/* Real-world examples */

// fibonacci
export function fibonacci(n, a = 0, b = 1) {
  let _continueRecursion19 = true;
  _tailCallLoop19: while (_continueRecursion19) {
    _continueRecursion19 = false;
    if (n === 1) {
      return a;
    } else if (n === 2) {
      return b;
    } else {
      [n, a = 0, b = 1] = [n - 1, b, a + b];
      _continueRecursion19 = true;
      continue _tailCallLoop19;
    }
  }
}

// prime number
export function isPrime(n, d = 2) {
  let _continueRecursion20 = true;
  _tailCallLoop20: while (_continueRecursion20) {
    _continueRecursion20 = false;
    if (n % d === 0) {
      return false;
    } else if (d ** 2 > n) {
      return true;
    } else {
      [n, d = 2] = [n, d + 1];
      _continueRecursion20 = true;
      continue _tailCallLoop20;
    }
  }
}
