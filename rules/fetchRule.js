"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var ts = require("typescript");
var tslint_1 = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var failures = this.applyWithWalker(new FetchWarning(sourceFile, this.getOptions()));
        return failures.splice(failures.length - 1, 1);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var FetchReplace = /** @class */ (function (_super) {
    __extends(FetchReplace, _super);
    function FetchReplace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FetchReplace;
}(tslint_1.Replacement));
// The walker takes care of all the work.
var FetchWarning = /** @class */ (function (_super) {
    __extends(FetchWarning, _super);
    function FetchWarning() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.root = null;
        _this.urlThen = new Set();
        _this.urlCatch = new Set();
        _this.reachedFetch = false;
        return _this;
    }
    FetchWarning.prototype.visitCallExpression = function (n) {
        var _this = this;
        if (ts.isExpressionStatement(n.parent) && n.parent.getText().startsWith('fetch') && this.root === null) {
            this.root = n.parent;
            var url = n.getText().match('fetch\\(.*\\)')[0];
            this.urlThen.add(url);
        }
        _super.prototype.visitCallExpression.call(this, n);
        if (n.getText().startsWith('fetch')) {
            if (ts.isPropertyAccessExpression(n.expression)) {
                n.arguments.forEach(function (arg) {
                    if (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) {
                        if (ts.isBlock(arg.body)) {
                            arg.body.statements.forEach(function (stmt) {
                                stmt.forEachChild(function (innerFetch) {
                                    if (ts.isCallExpression(innerFetch)) {
                                        if (ts.isIdentifier(innerFetch.expression) && innerFetch.expression.text === 'fetch') {
                                            if (ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'catch') {
                                                _this.urlCatch.add(innerFetch.getText());
                                            }
                                            else if (ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'then') {
                                                _this.urlThen.add(innerFetch.getText());
                                            }
                                            var repstr = "Promise.all([\n\t\t" +
                                                Array.from(_this.urlThen).toString() +
                                                "\n\t\t])" +
                                                "\n\t\t.then(function (responses) {" +
                                                "\n\t\t\treturn responses.map(function (response) {" +
                                                "\n\t\t\t\treturn response.json();" +
                                                "\n\t\t\t});" +
                                                "\n\t\t}).then(function (data) {" +
                                                "\n\t\t\tconsole.log(data);" +
                                                "\n\t\t}).catch(function (error) {" +
                                                "\n\t\t\tconsole.log(error);";
                                            if (_this.urlCatch.size === 0) {
                                                repstr = repstr.concat("\n\t});");
                                            }
                                            else {
                                                repstr = repstr.concat("\n\t\t\tPromise.all([\n\t\t\t\t" +
                                                    Array.from(_this.urlCatch).toString() +
                                                    "\n\t\t\t])" +
                                                    "\n\t\t});");
                                            }
                                            _this.addFailureAtNode(n, 'use parallel fetch', new FetchReplace(_this.root.getStart(), _this.root.getEnd() - _this.root.getStart(), repstr));
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    };
    return FetchWarning;
}(Lint.RuleWalker));
