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
