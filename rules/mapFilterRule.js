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
var tslint_1 = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MapFilterReduction(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var FunctorReplace = /** @class */ (function (_super) {
    __extends(FunctorReplace, _super);
    function FunctorReplace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FunctorReplace;
}(tslint_1.Replacement));
// The walker takes care of all the work.
var MapFilterReduction = /** @class */ (function (_super) {
    __extends(MapFilterReduction, _super);
    function MapFilterReduction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapFilterReduction.prototype.visitPropertyAccessExpression = function (n) {
        if (n.name.text === 'filter' && n.expression.expression.name.text === 'map') {
            this.addFailureAtNode(n, 'Make sure you apply filter before map for performance', new FunctorReplace(n.name.pos, -10, 'Test string'));
        }
    };
    return MapFilterReduction;
}(Lint.RuleWalker));
