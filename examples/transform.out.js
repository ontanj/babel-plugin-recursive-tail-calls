export function base(a) {
  while (true) {
    if (a <= 0) {
      return a;
    }
    a = a - 1;
  }
}
export function multipleArgs(a, b) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
  }
}
export function defaultArgInactive(a, b = 0) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = b + 1;
  }
}
export function defaultArgActive(a, b = 0) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = 0;
  }
}
export function undefinedArg(a, b) {
  while (true) {
    if (a < b) return a;
    a = a - 1;
    b = undefined;
  }
}
export const arrowFunction = (a) => {
  while (true) {
    if (a <= 0) return a;
    a = a - 1;
  }
};
