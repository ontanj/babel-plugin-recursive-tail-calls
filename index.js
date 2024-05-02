export default function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        const funcPath = path.getFunctionParent();
        const fname = getFunctionName(funcPath, t);
        const callsItself = fname && path.node.callee.name === fname;
        const isLast = t.isReturnStatement(path.parent);
        const shouldOptimize = callsItself && isLast;

        if (!shouldOptimize) return;

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

        const labelIdentifier = funcPath.scope.generateUidIdentifier("tail-call-loop");
        const whileStatement = t.whileStatement(
          t.booleanLiteral(true),
          funcPath.node.body,
        );
        const labeledStatement = t.labeledStatement(labelIdentifier, whileStatement);
        const blockStatement = t.blockStatement([labeledStatement]);

        // remove return
        path.parentPath.remove();
        args.forEach((arg) => {
          path.parentPath.parentPath.pushContainer("body", arg);
        });
        path.parentPath.parentPath.pushContainer("body", t.continueStatement(labelIdentifier));
        funcPath.get("body").replaceWith(blockStatement);
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
