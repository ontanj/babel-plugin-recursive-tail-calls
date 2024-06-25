import { type NodePath } from "@babel/core";
import { type Scope } from "@babel/traverse";
import {
  type ArrayPattern,
  type CallExpression,
  type Function,
  type Identifier,
  type LogicalExpression,
  type ReturnStatement,
  type Statement,
  expressionStatement,
  assignmentExpression,
  arrayExpression,
  booleanLiteral,
  continueStatement,
  variableDeclaration,
  variableDeclarator,
  logicalExpression,
  binaryExpression,
  identifier,
  isArgumentPlaceholder,
  isJSXNamespacedName,
  callExpression,
  ifStatement,
  returnStatement,
  blockStatement,
} from "@babel/types";
import { findRecursion } from "./tailRecursionFinder.js";
import { isRecCall } from "./utils.js";

export interface State {
  /** true if we should apply the transformation for this function */
  recursion: boolean;
  /** loop label */
  labelIdentifier: Identifier;
  /** identifier of this function */
  functionIdentifier: Identifier;
  /** identifier of loop condition */
  conditionIdentifier: Identifier;
  /** path of this function */
  functionPath: NodePath<Function>;
  /** parameters of this function */
  parameters: ArrayPattern;
}

/**
 * Rewrite complex `ReturnStatement`s to be explicit and update recursive
 * `CallExpression`s to be loop based.
 */
export const callExpressionRewriter = {
  ReturnStatement(this: State, path: NodePath<ReturnStatement>) {
    const argument = path.get("argument");
    if (
      !argument.isExpression() ||
      !findRecursion(argument, this.functionIdentifier)
    )
      return;
    this.recursion = true;

    const returnExpression = path.get("argument");
    if (returnExpression.isLogicalExpression()) {
      path.replaceWithMultiple(
        logicalExprRewrite(returnExpression.node, path.scope),
      );
    } else if (returnExpression.isConditionalExpression()) {
      path.replaceWith(
        ifStatement(
          returnExpression.node.test,
          blockStatement([returnStatement(returnExpression.node.consequent)]),
          blockStatement([returnStatement(returnExpression.node.alternate)]),
        ),
      );
    } else if (returnExpression.isCallExpression()) {
      path.replaceWithMultiple(
        callExprRewrite(this, returnExpression)
      );
    }
  },

  Function(path: NodePath<Function>) {
    // skip nested functions
    path.skip();
  },
};

/**
 * Rewrite a logical expression to an explicit `IfStatement`
 */
function logicalExprRewrite(
  {
    left,
    right,
    operator,
  }: Pick<LogicalExpression, "left" | "right" | "operator">,
  scope: Scope,
) {
  const symbolIdentifier = scope.generateUidIdentifier("symbol");
  const logicalResultIdentifier = scope.generateUidIdentifier("evaluation");
  return [
    // declare symbol
    variableDeclaration("const", [
      variableDeclarator(
        symbolIdentifier,
        callExpression(identifier("Symbol"), []),
      ),
    ]),
    // evaluate logical expression with symbol and store result
    variableDeclaration("const", [
      variableDeclarator(
        logicalResultIdentifier,
        logicalExpression(operator, left, symbolIdentifier),
      ),
    ]),
    ifStatement(
      binaryExpression("===", logicalResultIdentifier, symbolIdentifier),
      blockStatement([returnStatement(right)]),
      blockStatement([returnStatement(logicalResultIdentifier)])),
  ];
}

/**
 * If `CallExpression` is a recursive call in tail position, replace it with
 * an assignment for function parameters together with a `ContinueStatement`
 */
function callExprRewrite(state: State, path: NodePath<CallExpression>): Statement[] {
  const args = path.node.arguments.map((arg) => {
    if (isArgumentPlaceholder(arg) || isJSXNamespacedName(arg))
      throw new Error("Invalid argument type");
    return arg;
  });

  return [
    // update arguments
    expressionStatement(
      assignmentExpression("=", state.parameters, arrayExpression(args)),
    ),
    // set loop condition
    expressionStatement(
      assignmentExpression(
        "=",
        state.conditionIdentifier,
        booleanLiteral(true),
      ),
    ),
    continueStatement(state.labelIdentifier)
  ];
}

