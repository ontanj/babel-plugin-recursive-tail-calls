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

function pqr(a, b = 2) {
  if (a < b) return a
  return pqr(a - 1, b + 1)
}

function stu(a, b = 2) {
  if (a < b) return a
  return stu(a - 1)
}

