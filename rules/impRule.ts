import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "inga daw!!!! damo da";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}


// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));  
        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }

    public visitDoStatement(n: ts.DoStatement) {
        if (n.expression.kind === ts.SyntaxKind.FalseKeyword) {
            this.addFailure(this.createFailure(n.getStart(), n.getWidth(), 'Damo hacked daw1'));
            super.visitDoStatement(n);
        }
        
    }

    public visitPropertyAccessExpression(n: ts.PropertyAccessExpression) {
        if (n.name.text === 'map') {
            this.addFailureAtNode(n, 'Functorial map - use composition instead')
        }
    }
}
