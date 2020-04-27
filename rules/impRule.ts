import * as Lint from "tslint";
import * as ts from "typescript";
import { Replacement } from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FunctorWarning(sourceFile, this.getOptions()));
    }
}

class FunctorReplace extends Replacement {

}

// The walker takes care of all the work.
class FunctorWarning extends Lint.RuleWalker {
    public visitPropertyAccessExpression(n: any) {
        if (n.name.text === 'map' && n.expression.expression.name.text === 'map') {
            let f1: string = '(' + n.expression.arguments[0].body.getText() + ')';
            let f2: string = n.parent.arguments[0].body.getText();
            let f3: string = f2.replace('x', f1);
            let start: number = n.expression.arguments[0].body.pos+1;
            let width: number = n.parent.end-start-1;
            this.addFailureAtNode(n, 'Use composition instead', new FunctorReplace(start, width, f3))
        }
    }
}
