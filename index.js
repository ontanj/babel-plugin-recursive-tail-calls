export default function({ types: t }) {
  const callExpVisitor = {
    CallExpression(path) {
      const funcPath = path.getFunctionParent();
      const callsItself = path.node.callee.name === this.functionName;
      const isLast = t.isReturnStatement(path.parent);
      const shouldOptimize = callsItself && isLast;

      if (!shouldOptimize) return;

      this.recursion = true;

      const args = funcPath.node.params.map((param, index) => {
        let argExp = path.node.arguments[index];

        let identifier;

        if (t.isIdentifier(param)) {
          identifier = param;
        } else if (t.isAssignmentPattern(param)) {
          identifier = param.left;
          if (argExp === undefined) {
            argExp = param.right;
          }
        }

        if (argExp === undefined) {
          argExp = t.identifier("undefined");
        }

        const assignment = t.assignmentExpression("=", identifier, argExp);
        return t.expressionStatement(assignment);
      });

      // remove return
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
        const state = {
          recursion: false,
          labelIdentifier,
          functionName,
          functionPath: path
        }

        path.traverse(callExpVisitor, state);

        if (!state.recursion) {
          return;
        }

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
