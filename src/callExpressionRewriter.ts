import { type NodePath, template } from "@babel/core";
import { type Scope } from "@babel/traverse";
import {
  type CallExpression,
  type Expression,
  type Function,
  type Identifier,
  type LogicalExpression,
  type Statement,
  type ReturnStatement,
  expressionStatement,
  assignmentExpression,
  arrayPattern,
  arrayExpression,
  booleanLiteral,
  continueStatement,
  variableDeclaration,
  variableDeclarator,
  logicalExpression,
  binaryExpression,
  nullLiteral,
  identifier,
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
  /** name and default value of function argument */
  arguments: { identifier: Identifier; defaultValue: Expression }[];
}

/**
 * Rewrite complex `ReturnStatement`s to be explicit and update recursive
 * `CallExpression`s to be loop based.
 */
export const callExpressionRewriter = {
  /**
   * If `CallExpression` is a recursive call in tail position, replace it with
   * an assignment for function parameters together with a `ContinueStatement`
   */
  CallExpression(this: State, path: NodePath<CallExpression>) {
    const callsItself = isRecCall(path, this.functionIdentifier);
    const parentPath = path.parentPath;
    const isLast = parentPath.isReturnStatement();
    const shouldOptimize = callsItself && isLast;

    if (!shouldOptimize) return;

    this.recursion = true;

    const numberOfArguments = Math.max(
      this.arguments.length,
      path.node.arguments.length,
    );

    const identifiers = this.arguments.map(({ identifier }) => identifier);
    const values = Array.from({ length: numberOfArguments }).map(
      (_, index) =>
        path.node.arguments[index] ?? this.arguments[index].defaultValue,
    );

    const updateExpression = expressionStatement(
      assignmentExpression(
        "=",
        arrayPattern(identifiers),
        arrayExpression(values as Expression[]),
      ),
    );

    parentPath.insertBefore(updateExpression);
    parentPath.insertBefore(
      expressionStatement(
        assignmentExpression(
          "=",
          this.conditionIdentifier,
          booleanLiteral(true),
        ),
      ),
    );
    parentPath.insertBefore(continueStatement(this.labelIdentifier));
    parentPath.remove();
  },

  /**
   * If `ReturnStatement` is a construct that contains a recursive call in
   * tail position, such as `&&` or `? :`, rewrite it to be explicit.
   */
  ReturnStatement(this: State, path: NodePath<ReturnStatement>) {
    const argument = path.get("argument");
    if (
      !argument.isExpression() ||
      !findRecursion(argument, this.functionIdentifier)
    )
      return;

    const returnExpression = path.get("argument");
    if (returnExpression.isLogicalExpression()) {
      path.replaceWithMultiple(
        logicalExprRewrite(returnExpression.node, path.scope),
      );
    } else if (returnExpression.isConditionalExpression()) {
      path.replaceWith(
        buildIfStatement(
          returnExpression.node.test,
          returnExpression.node.consequent,
          returnExpression.node.alternate,
        ),
      );
    }
  },

  Function(path: NodePath<Function>) {
    // skip nested functions
    path.skip();
  },
};

const ifTemplate = template.statement(`
  if (%%condition%%) {
    return %%caseTrue%%;
  } else {
    return %%caseFalse%%;
  }
`);

function buildIfStatement(
  condition: Expression,
  caseTrue: Expression,
  caseFalse: Expression,
) {
  return ifTemplate({ condition, caseTrue, caseFalse });
}

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
  const resultIdentifier = scope.generateUidIdentifier("left");
  // assign left to a variable so we don't evaluate it twice
  const resultDeclaration = variableDeclaration("const", [
    variableDeclarator(resultIdentifier, left),
  ]);

  let ifStatement: Statement;
  if (operator === "&&")
    ifStatement = buildIfStatement(resultIdentifier, right, resultIdentifier);
  else if (operator === "||")
    ifStatement = buildIfStatement(resultIdentifier, resultIdentifier, right);
  else if (operator === "??")
    ifStatement = buildIfStatement(
      logicalExpression(
        "||",
        binaryExpression("==", left, nullLiteral()),
        binaryExpression("==", left, identifier("undefined")),
      ),
      resultIdentifier,
      right,
    );
  else throw new Error("Unknown LogicalExpression operator: " + operator);

  return [resultDeclaration, ifStatement];
}
