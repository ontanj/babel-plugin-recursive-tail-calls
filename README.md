# Recursive tail calls

A [babel](https://babeljs.io/) plugin for performing tail call optimization in
recursive functions.

## Background

Tail call optimization was included in the ECMAScript 2015 language
specification. However, some teams raised concerns about this feature, and
therefore it is so far only supported by Safari.

## Implementation

This plugin does not implement the feature as mentioned in the language
specification. Rather, it aims to find all locations where a function calls
itself in tail position, and rewrites those function using a loop. See
`examples` directory for examples.
