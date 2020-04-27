
import * as Lint from "tslint";
import * as ts from "typescript";
import { Replacement } from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MapFilterReduction(sourceFile, this.getOptions()));
    }
}

class FunctorReplace extends Replacement {
    
}

// The walker takes care of all the work.
class MapFilterReduction extends Lint.RuleWalker {
    public visitPropertyAccessExpression(n: any) {
        if (n.name.text === 'filter' && n.expression.expression.name.text === 'map') {
            this.addFailureAtNode(n, 'Make sure you apply filter before map for performance', new FunctorReplace(n.name.pos, -10, 'Test string'))
        }
    }
}
