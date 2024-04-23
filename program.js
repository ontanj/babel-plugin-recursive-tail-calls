function abc(a) {
  if (a > 10) {
    return a
  }
  return abc(a + 1)
}

// const def = (a) => {
//  return def(a-1)
// }

function ghi(a) {
  return abc(a)
}

function jkl(a) {
  const c = jkl(a);
  return c;
}

function mno(a, b) {
  if (a < b) return a
  return mno(a - 1, b + 1)
}
