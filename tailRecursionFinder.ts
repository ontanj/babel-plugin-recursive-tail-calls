import { NodePath } from "@babel/core";
import { Identifier } from "@babel/types";
import { isRecCall } from "./utils.js";

export interface State {
  /** true if tail recursion is found */
  found: boolean
  /** identifier of function */
  functionIdentifier: Identifier;
}

/**
 * Babel visitor to find tail recursion in `ReturnStatement`s.
 * Descends down `LogicalExpression`s and `ConditionalExpression`s
 * to find recursive calls in tail position.
 * Sets `found` on state to `true` if recursion is found.
 */
export const tailRecursionFinder = {
  enter(this: State, path: NodePath) {
    if (path.isCallExpression()) {
      this.found = isRecCall(path, this.functionIdentifier);
      if (this.found) path.stop();
    } else if (path.isLogicalExpression())
      path.skipKey("left");
    else if (path.isConditionalExpression())
      path.skipKey("test");
    else
      path.skip();
  },
}
