export function noRecursion(a) {
  return func(a)
}

export function notTail(a) {
  const c = notTail(a);
  return c;
}

