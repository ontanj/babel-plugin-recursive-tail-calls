import { NodePath } from "@babel/core";
import { CallExpression, isIdentifier } from "@babel/types";
import { Identifier } from "@babel/types";

export function isRecCall(
  path: NodePath<CallExpression>,
  identifier: Identifier,
) {
  return (
    isIdentifier(path.node.callee) &&
    path.scope.bindingIdentifierEquals(path.node.callee.name, identifier)
  );
}
