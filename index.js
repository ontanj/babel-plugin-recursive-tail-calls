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

				const argExp = path.node.arguments[0];
				const argIdentifier = f.node.params[0];

				const assignment = t.assignmentExpression("=", argIdentifier, argExp);
				const expression = t.expressionStatement(assignment);

				const trueLiteral = t.booleanLiteral(true)
				const whileStatement = t.whileStatement(trueLiteral, path.parentPath.parent);
				const blockStatement = t.blockStatement([whileStatement]);

				path.parentPath.remove();
				path.parentPath.parentPath.pushContainer('body', expression);
				path.parentPath.parentPath.replaceWith(blockStatement);
			}
		}
	}
}
