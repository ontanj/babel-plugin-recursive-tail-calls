export default function({ types: t }) {
  const callExpVisitor = {
    CallExpression(path) {
      const callsItself = path.node.callee.name === this.functionName;
      const isLast = t.isReturnStatement(path.parent);
      const shouldOptimize = callsItself && isLast;

      if (!shouldOptimize) return;

      this.recursion = true;

      const args = this.arguments.map(({ identifier, defaultValue }, index) => {
        return t.expressionStatement(
          t.assignmentExpression(
            "=",
            identifier,
            path.node.arguments[index] ?? defaultValue
          )
        );
      });

      // remove return statement
      path.parentPath.remove();
      args.forEach((arg) => {
        path.parentPath.parentPath.pushContainer("body", arg);
      });
      path.parentPath.parentPath.pushContainer("body", t.continueStatement(this.labelIdentifier));
    },

    Function(path) {
      // skip nested functions
      path.skip();
    }
  };

  return {
    visitor: {
      Function(path) {
        const functionName = getFunctionName(path, t);
        const labelIdentifier = path.scope.generateUidIdentifier("tail-call-loop");

        const args = path.node.params.map((param) => {
          if (t.isIdentifier(param)) {
            return { identifier: param, defaultValue: t.identifier("undefined") };
          } else if (t.isAssignmentPattern(param)) {
            return { identifier: param.left, defaultValue: param.right };
          }
          throw new Error("Unsupported param expression");
        });

        const state = {
          // true if we should apply the transformation for this function
          recursion: false,
          // loop label
          labelIdentifier,
          // name of this function
          functionName,
          // path of this function
          functionPath: path,
          // name and default value of function argument
          arguments: args
        }

        path.traverse(callExpVisitor, state);

        // abort if there is no recursion
        if (!state.recursion) return;

        // wrap function body in while loop
        const whileStatement = t.whileStatement(
          t.booleanLiteral(true),
          path.node.body,
        );
        const labeledStatement = t.labeledStatement(labelIdentifier, whileStatement);
        const blockStatement = t.blockStatement([labeledStatement]);

        path.get("body").replaceWith(blockStatement);
      },
    },
  };
}

function getFunctionName(functionPath, t) {
  if (t.isFunctionDeclaration(functionPath.node)) {
    return functionPath.node.id.name;
  } else if (t.isArrowFunctionExpression(functionPath.node)) {
    return functionPath.parent.id.name;
  }
  return undefined;
}
