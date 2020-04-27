import * as Lint from "tslint";
import * as ts from "typescript";
import { Replacement } from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        let failures = this.applyWithWalker(new FetchWarning(sourceFile, this.getOptions()));
        return failures.splice(failures.length-1, 1);
    }
}

class FetchReplace extends Replacement {

}

// The walker takes care of all the work.
class FetchWarning extends Lint.RuleWalker {
    root:ts.ExpressionStatement = null;
    urlThen = new Set<string>();
    urlCatch = new Set<String>();
    reachedFetch:boolean = false;
    public visitCallExpression(n: ts.CallExpression) 
    {
        if(ts.isExpressionStatement(n.parent) && n.parent.getText().startsWith('fetch') && this.root === null)
        {
            this.root = n.parent;
            let url = n.getText().match('fetch\\(.*\\)')[0];
            this.urlThen.add(url);
        }
        super.visitCallExpression(n);
        if(n.getText().startsWith('fetch'))
        { 
            if(ts.isPropertyAccessExpression(n.expression))
            {
                n.arguments.forEach((arg) => {
                    if(ts.isArrowFunction(arg) || ts.isFunctionExpression(arg))
                    {
                        if(ts.isBlock(arg.body))
                        {
                            arg.body.statements.forEach((stmt) => {
                                stmt.forEachChild((innerFetch) => {
                                    if(ts.isCallExpression(innerFetch))
                                    {
                                        if(ts.isIdentifier(innerFetch.expression) && innerFetch.expression.text === 'fetch')
                                        {
                                            if(ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'catch')
                                            {
                                                this.urlCatch.add(innerFetch.getText());
                                            }
                                            else if(ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'then')
                                            {
                                                this.urlThen.add(innerFetch.getText());
                                            }
                                            let repstr:string = `Promise.all([\n\t\t` + 
                                                                    Array.from(this.urlThen).toString() +
                                                                `\n\t\t])` +
                                                                `\n\t\t.then(function (responses) {` +
                                                                `\n\t\t\treturn responses.map(function (response) {` +
                                                                `\n\t\t\t\treturn response.json();` +
                                                                `\n\t\t\t});` +
                                                                `\n\t\t}).then(function (data) {` +
                                                                `\n\t\t\tconsole.log(data);` +
                                                                `\n\t\t}).catch(function (error) {` +
                                                                `\n\t\t\tconsole.log(error);`;
                                            if(this.urlCatch.size === 0)
                                            {
                                                repstr = repstr.concat(`\n\t});`);
                                            }
                                            else
                                            {
                                                repstr = repstr.concat(
                                                                        `\n\t\t\tPromise.all([\n\t\t\t\t` + 
                                                                            Array.from(this.urlCatch).toString() +
                                                                        `\n\t\t\t])` +
                                                                        `\n\t\t});`
                                                );
                                            }
                                            this.addFailureAtNode(n,'use parallel fetch',new FetchReplace(this.root.getStart(), this.root.getEnd()-this.root.getStart(), repstr));
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            }
        }
    }
}


