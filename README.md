# Recursive tail calls

A [babel](https://babeljs.io/) plugin for performing tail call optimization in
recursive functions.

## Usage

Download the
[plugin](https://www.npmjs.com/package/babel-plugin-recursive-tail-calls) from
npm, using e.g. npm or yarn.

```sh
npm i babel-plugin-recursive-tail-calls
```

[Add it to the plugins](https://babeljs.io/docs/plugins) in `babel.config.json`.

More information on using Babel [here](https://babeljs.io/docs/usage).

## Rationale

Tail call optimization was included in the ECMAScript 2015 language
specification. However, some teams raised concerns about this feature, and
therefore it is so far only supported by Safari.

In functional programming, recursion is the main way to simulate a loop. So for
those wanting to take a functional approach to JavaScript, some kind of tail call
optimization is needed to avoid exceeding the maximum stack size.

## Implementation

This plugin does not implement the feature as mentioned in the language
specification. Rather, it aims to find all locations where a function calls
itself in tail position, and rewrites those functions using a loop.

```js
// before transpilation
function f(a) {
  if (a <= 0) {
    return a;
  }
  return f(a - 1);
}

// after transpilation
function f(a) {
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
```

### Support

See [`examples`](examples) directory for complete examples and their transformations.

#### Tail call

A tail call is a call that is part of a return statement, such that the call is
the last thing evaluated before control is returned back to the calling
function.
This means that, in addition to being the only part of a return statement, a
tail call can occur in the following places:

- last operand of logical and (`&&`)
- last operand of logical or (`||`)
- last operand of the nullish coalescing operator (`??`)
- if or else-branch of the conditional opertor (`? :`)

When rewriting occurs in this cases, the evaluation of arguments is only done
once.

In case of multiple recursive tail calls, all are rewritten.
If function evaluation terminates without a return statement, the loop, to
which the code is transpiled, is terminated accordingly.

#### Shadowing

The scope of the recursive call are checked to see if the function name has
been shadowed by another function with the same. In this case optimization is
not performed.

#### Arguments & parameters

As array assignment, which is used in the transformation, exhibits much of the
same properties as parameter assignment, all features of parameter assignment
are supported.

- [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
- Excessive arguments
  - This is needed when the excessive argument is a function call with a side
    effect, in this case it must be evaluated.

#### Anonymous functions

Anonymous functions, e.g. arrow functions, are tricky in the context of
recursion since they are, well, anonymous, and identifying which identifier
corresponds to which function might not even be possible to do at compile time.
The only case where optimization with anonymous functions is done by this plugin
is when the function is directly assigned to a `const` at creation and the
label of the `const` declaration is used in the recursive call. This is
supported since it is a common pattern.

```js
const functionName = () => {
  // function body
  return functionName();
};
```
