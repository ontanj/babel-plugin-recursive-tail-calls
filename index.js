export default function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        const f = path.getFunctionParent();
        const fname = f.node.id.name;
        const callsItself = path.node.callee.name === fname;
        const isLast = t.isReturnStatement(path.parent);
        const shouldOptimize = callsItself && isLast;

        if (!shouldOptimize) return;

        const args = f.node.params.map((identifier, index) => {
          const argExp = path.node.arguments[index];

          const assignment = t.assignmentExpression("=", identifier, argExp);
          return t.expressionStatement(assignment);
        });

        const trueLiteral = t.booleanLiteral(true)
        const whileStatement = t.whileStatement(trueLiteral, path.parentPath.parent);
        const blockStatement = t.blockStatement([whileStatement]);

        path.parentPath.remove();
        args.forEach(arg => {
          path.parentPath.parentPath.pushContainer('body', arg);
        });
        path.parentPath.parentPath.replaceWith(blockStatement);
      }
    }
  }
}
