// call other function
export function noRecursion(a) {
  return func(a);
}

// call same function not in tail call position
export function notTail(a) {
  const c = notTail(a);
  return c;
}

// shadowing
export function shadowing(a, b) {
  function shadowing(a) {
    return a + 2;
  }
  {
    if (a < b) return a;
    return shadowing(b);
  }
}

// not constant
export function notConstant() {
  let f = (a, b, c) => {
    if (a > 10) {
      return a + b + c;
    } else {
      return f(a + 1, b + 1, c + 1);
    }
  };
  f = () => console.log("NOTHING");
}
