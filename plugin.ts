import { type NodePath, types } from "@babel/core";
import type {
  CallExpression,
  Expression,
  Function,
  Identifier,
} from "@babel/types";

type t = typeof types;

interface State {
  // true if we should apply the transformation for this function
  recursion: boolean;
  // loop label
  labelIdentifier: Identifier;
  // identifier of this function
  functionIdentifier: Identifier;
  // identifier of loop condition
  conditionIdentifier: Identifier;
  // path of this function
  functionPath: NodePath<Function>;
  // name and default value of function argument
  arguments: { identifier: Identifier; defaultValue: Expression }[];
}

export default function ({ types: t }: { types: t }) {
  const callExpVisitor = {
    CallExpression(this: State, path: NodePath<CallExpression>) {
      const callsItself =
        t.isIdentifier(path.node.callee) &&
        path.scope.bindingIdentifierEquals(
          path.node.callee.name,
          this.functionIdentifier,
        );
      const isLast = t.isReturnStatement(path.parent);
      const shouldOptimize = callsItself && isLast;

      if (!shouldOptimize) return;

      this.recursion = true;

      const args = this.arguments.map(({ identifier, defaultValue }, index) => {
        return {
          identifier,
          value: path.node.arguments[index] ?? defaultValue,
        };
      });

      const updateExpression = t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.arrayPattern(args.map(({ identifier }) => identifier)),
          t.arrayExpression(args.map(({ value }) => value as Expression)),
        ),
      );

      // the parent is ReturnStatement
      path.parentPath.insertBefore(updateExpression);
      path.parentPath.insertBefore(
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            this.conditionIdentifier,
            t.booleanLiteral(true),
          ),
        ),
      );
      path.parentPath.insertBefore(t.continueStatement(this.labelIdentifier));
      path.parentPath.remove();
    },

    Function(path: NodePath<Function>) {
      // skip nested functions
      path.skip();
    },
  };

  return {
    visitor: {
      Function(path: NodePath<Function>) {
        const functionIdentifier = getFunctionIdentifier(path, t);
        if (!functionIdentifier) return;

        const functionBody = path.get("body");
        // until we support ternary, we can't have expression body
        if (!functionBody.isBlockStatement()) return;

        const labelIdentifier =
          path.scope.generateUidIdentifier("tail-call-loop");

        const conditionIdentifier =
          path.scope.generateUidIdentifier("continue-recursion");

        let args: State["arguments"];

        try {
          args = path.node.params.map(
            (param: (typeof path.node.params)[number]) => {
              if (t.isIdentifier(param)) {
                return {
                  identifier: param,
                  defaultValue: t.identifier("undefined"),
                };
              } else if (
                t.isAssignmentPattern(param) &&
                t.isIdentifier(param.left)
              ) {
                return { identifier: param.left, defaultValue: param.right };
              }
              throw new Error("Unsupported param expression");
            },
          );
        } catch (e: unknown) {
          return;
        }

        const state: State = {
          recursion: false,
          labelIdentifier,
          functionIdentifier,
          conditionIdentifier,
          functionPath: path,
          arguments: args,
        };

        path.traverse(callExpVisitor, state);

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

function getFunctionIdentifier(functionPath: NodePath<Function>, t: t) {
  if (t.isFunctionDeclaration(functionPath.node)) {
    return functionPath.node.id;
  } else if (t.isArrowFunctionExpression(functionPath.node)) {
    if (
      t.isVariableDeclarator(functionPath.parent) &&
      t.isIdentifier(functionPath.parent.id) &&
      functionPath.scope.getBinding(functionPath.parent.id.name)?.constant
    ) {
      return functionPath.parent.id;
    }
  }
}
