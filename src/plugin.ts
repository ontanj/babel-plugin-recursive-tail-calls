import { type NodePath, types } from "@babel/core";
import {
  arrayPattern,
  isIdentifier,
  isVariableDeclarator,
  type Function,
} from "@babel/types";
import {
  callExpressionRewriter,
  type State as CallExpressionState,
} from "./callExpressionRewriter.js";
import { findRecursion } from "./tailRecursionFinder.js";

type t = typeof types;

export default function ({ types: t }: { types: t }) {
  return {
    visitor: {
      Function(path: NodePath<Function>) {
        const functionIdentifier = getFunctionIdentifier(path);
        if (!functionIdentifier) return;

        const functionBody = path.get("body");

        const labelIdentifier =
          path.scope.generateUidIdentifier("tail-call-loop");

        const conditionIdentifier =
          path.scope.generateUidIdentifier("continue-recursion");

        if (functionBody.isExpression()) {
          if (!findRecursion(functionBody, functionIdentifier)) return;
          functionBody.replaceWith(
            t.blockStatement([t.returnStatement(functionBody.node)]),
          );
        }
        // this should never happen but is added for adequate type hints
        if (!functionBody.isBlockStatement())
          throw new Error("Body is not block statement");

        const state: CallExpressionState = {
          recursion: false,
          labelIdentifier,
          functionIdentifier,
          conditionIdentifier,
          functionPath: path,
          parameters: arrayPattern(path.node.params),
        };

        path.traverse(callExpressionRewriter, state);

        // abort if there is no recursion
        if (!state.recursion) return;

        const conditionDeclaration = t.variableDeclaration("let", [
          t.variableDeclarator(conditionIdentifier, t.booleanLiteral(true)),
        ]);

        // wrap function body in while loop
        const whileStatement = t.whileStatement(
          conditionIdentifier,
          functionBody.node,
        );
        // insert `condition = false` first in loop
        functionBody.unshiftContainer(
          "body",
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              conditionIdentifier,
              t.booleanLiteral(false),
            ),
          ),
        );
        const labeledStatement = t.labeledStatement(
          labelIdentifier,
          whileStatement,
        );
        const blockStatement = t.blockStatement([
          conditionDeclaration,
          labeledStatement,
        ]);

        functionBody.replaceWith(blockStatement);
      },
    },
  };
}

function getFunctionIdentifier(functionPath: NodePath<Function>) {
  if (functionPath.isFunctionDeclaration()) {
    return functionPath.node.id;
  } else if (
    functionPath.isArrowFunctionExpression() ||
    functionPath.isFunctionExpression()
  ) {
    if (
      isVariableDeclarator(functionPath.parent) &&
      isIdentifier(functionPath.parent.id) &&
      functionPath.scope.getBinding(functionPath.parent.id.name)?.constant
    ) {
      return functionPath.parent.id;
    }
  }
}
