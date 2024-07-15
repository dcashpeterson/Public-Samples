(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("adaptive-expressions"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ACData"] = factory(require("adaptive-expressions"));
	else
		root["ACData"] = factory(root["AEL"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_adaptive_expressions__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adaptivecards-templating.ts":
/*!*****************************************!*\
  !*** ./src/adaptivecards-templating.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
__exportStar(__webpack_require__(/*! ./template-engine */ "./src/template-engine.ts"), exports);
__exportStar(__webpack_require__(/*! ./json-schema-card */ "./src/json-schema-card.ts"), exports);


/***/ }),

/***/ "./src/json-schema-card.ts":
/*!*********************************!*\
  !*** ./src/json-schema-card.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports) {


// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONSchemaCard = void 0;
// JSON Schema Card
// generates an Adaptive Card given a JSON schema
function JSONSchemaCard(schema) {
    try {
        return {
            type: "AdaptiveCard",
            body: [
                JSONSchemaCardObject(schema, '', 0),
            ],
        };
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
}
exports.JSONSchemaCard = JSONSchemaCard;
// JSON Schema Elements
function JSONSchemaCardElement(schema, path, depth) {
    if (typeof (schema) === "boolean")
        return null;
    switch (schema.type) {
        case "array":
            if (Array.isArray(schema.items)) {
                return JSONSchemaCardTuple(schema, path, depth);
            }
            else {
                return JSONSchemaCardList(schema, path, depth);
            }
        case "object":
            return JSONSchemaCardObject(schema, path, depth);
        case "boolean":
            return JSONSchemaCardBoolean(schema, path);
        case "integer":
        case "number":
            return JSONSchemaCardNumber(schema, path);
        case "string":
            if (schema.enum) {
                return JSONSchemaCardChoiceSet(schema, path);
            }
            else {
                return JSONSchemaCardText(schema, path);
            }
        case "date-time":
        case "time":
        case "date":
            return JSONSchemaCardTime(schema, path);
        default:
            return null;
    }
}
function encodeProperty(property) {
    return encodeURIComponent(property).replace('.', '%2e');
}
function textSizeAtDepth(depth) {
    switch (depth) {
        case 0:
            "large";
        case 1:
            "medium";
        default:
            "small";
    }
}
function JSONSchemaFieldTitle(schema, path, depth) {
    return [
        schema.title ? {
            type: "TextBlock",
            size: textSizeAtDepth(depth),
            text: schema.title,
        } : null,
        schema.description ? {
            type: "TextBlock",
            size: textSizeAtDepth(depth + 1),
            isSubtle: true,
            wrap: true,
            text: schema.description,
        } : null,
    ];
}
function JSONSchemaCardTuple(schema, path, depth) {
    var _a, _b;
    if (!Array.isArray(schema.items))
        return null;
    return {
        type: "Container",
        items: __spreadArray(__spreadArray([], JSONSchemaFieldTitle(schema, path, depth), true), (_b = (_a = schema.items) === null || _a === void 0 ? void 0 : _a.map(function (item, idx) {
            return JSONSchemaCardElement(item, path + "[" + idx + "]", depth + 1);
        })) !== null && _b !== void 0 ? _b : [], true),
    };
}
function JSONSchemaCardList(schema, path, depth) {
    return {
        type: "Container",
        items: __spreadArray([], JSONSchemaFieldTitle(schema, path, depth), true),
    };
}
function JSONSchemaCardObject(schema, path, depth) {
    var _a, _b;
    return {
        type: "Container",
        items: __spreadArray(__spreadArray([], JSONSchemaFieldTitle(schema, path, depth), true), (_b = (_a = schema.required) === null || _a === void 0 ? void 0 : _a.map(function (property) {
            return JSONSchemaCardElement(schema.properties[property], path + "." + encodeProperty(property), depth + 1);
        })) !== null && _b !== void 0 ? _b : [], true),
    };
}
function JSONSchemaCardBoolean(schema, path) {
    return {
        type: "Input.Toggle",
        id: path,
        title: schema.title,
        label: schema.description,
        value: schema.default,
    };
}
function JSONSchemaCardNumber(schema, path) {
    var _a, _b;
    return {
        type: "Input.Number",
        id: path,
        title: schema.title,
        placeholder: schema.description,
        value: schema.default,
        min: (_a = schema.exclusiveMinimum) !== null && _a !== void 0 ? _a : schema.minimum,
        max: (_b = schema.exclusiveMaximum) !== null && _b !== void 0 ? _b : schema.maximum,
    };
}
function JSONSchemaCardChoiceSet(schema, path) {
    return {
        type: "Input.ChoiceSet",
        id: path,
        title: schema.title,
        choices: schema.enum.map(function (item) {
            return {
                title: item,
                value: item,
            };
        }),
        placeholder: schema.description,
        value: schema.default,
    };
}
function JSONSchemaCardText(schema, path) {
    return {
        type: "Input.Text",
        id: path,
        title: schema.title,
        placeholder: schema.description,
        value: schema.default,
        maxLength: schema.maxLength,
        regex: schema.pattern,
    };
}
function JSONSchemaCardTime(schema, path) {
    return {
        type: "Input.Time",
        id: path,
        title: schema.title,
        placeholder: schema.description,
        value: schema.default,
    };
}


/***/ }),

/***/ "./src/template-engine.ts":
/*!********************************!*\
  !*** ./src/template-engine.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Template = exports.GlobalSettings = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var AEL = __webpack_require__(/*! adaptive-expressions */ "adaptive-expressions");
var pkg = __webpack_require__(/*! ./../package.json */ "./package.json");
var EvaluationContext = /** @class */ (function () {
    function EvaluationContext(context) {
        this._stateStack = [];
        if (context !== undefined) {
            this.$_acTemplateVersion = this.generateVersionJson();
            this.$root = context.$root;
            this.$host = context.$host;
        }
    }
    EvaluationContext.prototype.isReservedField = function (name) {
        return EvaluationContext._reservedFields.indexOf(name) >= 0;
    };
    EvaluationContext.prototype.saveState = function () {
        this._stateStack.push({
            $data: this.$data,
            $index: this.$index
        });
    };
    EvaluationContext.prototype.restoreLastState = function () {
        if (this._stateStack.length === 0) {
            throw new Error("There is no evaluation context state to restore.");
        }
        var savedContext = this._stateStack.pop();
        this.$data = savedContext.$data;
        this.$index = savedContext.$index;
    };
    Object.defineProperty(EvaluationContext.prototype, "$data", {
        get: function () {
            return this._$data !== undefined ? this._$data : this.$root;
        },
        set: function (value) {
            this._$data = value;
        },
        enumerable: false,
        configurable: true
    });
    EvaluationContext.prototype.generateVersionJson = function () {
        // Example version: 2.3.0-alpha
        var version = pkg.version;
        var versionSplit = version.split('.');
        var patchSplit = [];
        var patchIndex = 2;
        if (versionSplit[patchIndex]) {
            patchSplit = versionSplit[patchIndex].split('-');
        }
        return {
            "major": parseInt(versionSplit[0]),
            "minor": parseInt(versionSplit[1]),
            "patch": parseInt(patchSplit[0]),
            "suffix": patchSplit[1] || "",
        };
    };
    EvaluationContext._reservedFields = ["$data", "$when", "$root", "$index", "$host", "$_acTemplateVersion"];
    return EvaluationContext;
}());
var TemplateObjectMemory = /** @class */ (function () {
    function TemplateObjectMemory() {
        this._memory = new AEL.SimpleObjectMemory(this);
    }
    TemplateObjectMemory.prototype.getValue = function (path) {
        var actualPath = (path.length > 0 && path[0] !== "$") ? "$data." + path : path;
        return this._memory.getValue(actualPath);
    };
    TemplateObjectMemory.prototype.setValue = function (path, input) {
        this._memory.setValue(path, input);
    };
    TemplateObjectMemory.prototype.version = function () {
        return this._memory.version();
    };
    return TemplateObjectMemory;
}());
/**
 * Holds global settings that can be used to customize the way templates are expanded.
 */
var GlobalSettings = /** @class */ (function () {
    function GlobalSettings() {
    }
    /**
     * Callback invoked when expression evaluation needs the value of a field in the source data object
     * and that field is undefined or null. By default, expression evaluation will substitute an undefined
     * field with its binding expression (e.g. `${field}`). This callback makes it possible to customize that
     * behavior.
     *
     * **Example**
     * Given this data object:
     *
     * ```json
     * {
     *     firstName: "David"
     * }
     * ```
     *
     * The expression `${firstName} ${lastName}` will evaluate to "David ${lastName}" because the `lastName`
     * field is undefined.
     *
     * Now let's set the callback:
     * ```typescript
     * GlobalSettings.getUndefinedFieldValueSubstitutionString = (path: string) => { return "<undefined value>"; }
     * ```
     *
     * With that, the above expression will evaluate to "David &lt;undefined value&gt;"
     */
    GlobalSettings.getUndefinedFieldValueSubstitutionString = undefined;
    return GlobalSettings;
}());
exports.GlobalSettings = GlobalSettings;
/**
 * Represents a template that can be bound to data.
 */
var Template = /** @class */ (function () {
    /**
     * Initializes a new Template instance based on the provided payload.
     * Once created, the instance can be bound to different data objects
     * in a loop.
     *
     * @param payload The template payload.
     */
    function Template(payload) {
        this._preparedPayload = Template.prepare(payload);
    }
    Template.prepare = function (node) {
        if (typeof node === "string") {
            return Template.parseInterpolatedString(node);
        }
        else if (typeof node === "object" && node !== null) {
            if (Array.isArray(node)) {
                var result = [];
                for (var _i = 0, node_1 = node; _i < node_1.length; _i++) {
                    var item = node_1[_i];
                    result.push(Template.prepare(item));
                }
                return result;
            }
            else {
                var keys = Object.keys(node);
                var result = {};
                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                    var key = keys_1[_a];
                    result[key] = Template.prepare(node[key]);
                }
                return result;
            }
        }
        else {
            return node;
        }
    };
    Template.internalTryEvaluateExpression = function (expression, context, allowSubstitutions) {
        var memory = new TemplateObjectMemory();
        memory.$root = context.$root;
        memory.$data = context.$data;
        memory.$index = context.$index;
        memory.$host = context.$host;
        memory.$_acTemplateVersion = context.$_acTemplateVersion;
        var options = undefined;
        if (allowSubstitutions) {
            options = new AEL.Options();
            options.nullSubstitution = function (path) {
                var substitutionValue = undefined;
                if (GlobalSettings.getUndefinedFieldValueSubstitutionString) {
                    substitutionValue = GlobalSettings.getUndefinedFieldValueSubstitutionString(path);
                }
                return substitutionValue ? substitutionValue : "${" + path + "}";
            };
        }
        // The root of an expression coming from an interpolated string is of type Concat.
        // In that case, and if the caller allows it, we're doing our own concatenation
        // in order to catch each individual expression evaluation error and substitute in
        // the final string
        if (expression.type === AEL.ExpressionType.Concat && allowSubstitutions) {
            var result = "";
            for (var _i = 0, _a = expression.children; _i < _a.length; _i++) {
                var childExpression = _a[_i];
                var evaluationResult = void 0;
                try {
                    evaluationResult = childExpression.tryEvaluate(memory, options);
                }
                catch (ex) {
                    // We'll swallow all exceptions here
                    evaluationResult = {
                        value: undefined,
                        error: ex
                    };
                }
                if (evaluationResult.error) {
                    evaluationResult.value = "${" + childExpression.toString() + "}";
                }
                result += evaluationResult.value.toString();
            }
            return { value: result, error: undefined };
        }
        return expression.tryEvaluate(memory, options);
    };
    /**
     * Parses an interpolated string into an Expression object ready to evaluate.
     *
     * @param interpolatedString The interpolated string to parse. Example: "Hello ${name}"
     * @returns An Expression object if the provided interpolated string contained at least one expression (e.g. "${expression}"); the original string otherwise.
     */
    Template.parseInterpolatedString = function (interpolatedString) {
        var lookup = function (type) {
            var standardFunction = AEL.ExpressionFunctions.standardFunctions.get(type);
            if (standardFunction) {
                return standardFunction;
            }
            else {
                return new AEL.ExpressionEvaluator(type, function (expression, state, options) { throw new Error("Unknown function " + type); }, AEL.ReturnType.String);
            }
        };
        // If there is at least one expression start marker, let's attempt to convert into an expression
        if (interpolatedString.indexOf("${") >= 0) {
            var parsedExpression = AEL.Expression.parse("`" + interpolatedString + "`", lookup);
            if (parsedExpression.type === "concat") {
                if (parsedExpression.children.length === 1 && !(parsedExpression.children[0] instanceof AEL.Constant)) {
                    // The concat contains a single child that isn't a constant, thus the original
                    // string was a single expression. When evaluated, we want it to produce the type
                    // of that single expression
                    return parsedExpression.children[0];
                }
                else if (parsedExpression.children.length === 2) {
                    var firstChild = parsedExpression.children[0];
                    if (firstChild instanceof AEL.Constant && firstChild.value === "" && !(parsedExpression.children[1] instanceof AEL.Constant)) {
                        // The concat contains 2 children, and the first one is an empty string constant and the second isn't a constant.
                        // From version 4.10.3, AEL always inserts an empty string constant in all concat expression. Thus the original
                        // string was a single expression in this case as well. When evaluated, we want it to produce the type
                        // of that single expression.
                        return parsedExpression.children[1];
                    }
                }
                // Otherwise, we want the expression to produce a string
                return parsedExpression;
            }
        }
        // If the original string didn't contain any expression, return i as is
        return interpolatedString;
    };
    /**
     * Tries to evaluate the provided expression using the provided context.
     *
     * @param expression The expression to evaluate.
     * @param context The context (data) used to evaluate the expression.
     * @param allowSubstitutions Indicates if the expression evaluator should substitute undefined value with a default
     *   string or the value returned by the GlobalSettings.getUndefinedFieldValueSubstitutionString callback.
     * @returns An object representing the result of the evaluation. If the evaluation succeeded, the value property
     *   contains the actual evaluation result, and the error property is undefined. If the evaluation fails, the error
     *   property contains a message detailing the error that occurred.
     */
    Template.tryEvaluateExpression = function (expression, context, allowSubstitutions) {
        return Template.internalTryEvaluateExpression(expression, new EvaluationContext(context), allowSubstitutions);
    };
    Template.prototype.expandSingleObject = function (node) {
        var result = {};
        var keys = Object.keys(node);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            if (!this._context.isReservedField(key)) {
                var value = this.internalExpand(node[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
        }
        return result;
    };
    Template.prototype.internalExpand = function (node) {
        var result;
        this._context.saveState();
        if (Array.isArray(node)) {
            var itemArray = [];
            for (var _i = 0, node_2 = node; _i < node_2.length; _i++) {
                var item = node_2[_i];
                var expandedItem = this.internalExpand(item);
                if (expandedItem !== null) {
                    if (Array.isArray(expandedItem)) {
                        itemArray = itemArray.concat(expandedItem);
                    }
                    else {
                        itemArray.push(expandedItem);
                    }
                }
            }
            result = itemArray;
        }
        else if (node instanceof AEL.Expression) {
            var evaluationResult = Template.internalTryEvaluateExpression(node, this._context, true);
            if (!evaluationResult.error) {
                result = evaluationResult.value;
            }
            else {
                throw new Error(evaluationResult.error);
            }
        }
        else if (typeof node === "object" && node !== null) {
            var when = node["$when"];
            var dataContext = node["$data"];
            var dataContextIsArray = false;
            var dataContexts = void 0;
            if (dataContext === undefined) {
                dataContexts = [undefined];
            }
            else {
                if (dataContext instanceof AEL.Expression) {
                    var evaluationResult = Template.internalTryEvaluateExpression(dataContext, this._context, true);
                    if (!evaluationResult.error) {
                        dataContext = evaluationResult.value;
                    }
                    else {
                        throw new Error(evaluationResult.error);
                    }
                }
                if (Array.isArray(dataContext)) {
                    dataContexts = dataContext;
                    dataContextIsArray = true;
                }
                else {
                    dataContexts = [dataContext];
                }
            }
            result = [];
            for (var i = 0; i < dataContexts.length; i++) {
                if (dataContextIsArray) {
                    this._context.$index = i;
                }
                if (dataContexts[i] !== undefined) {
                    this._context.$data = dataContexts[i];
                }
                var dropObject = false;
                if (when instanceof AEL.Expression) {
                    var evaluationResult = Template.internalTryEvaluateExpression(when, this._context, false);
                    var whenValue = false;
                    // If $when fails to evaluate or evaluates to anything but a boolean, consider it is false
                    if (!evaluationResult.error) {
                        whenValue = typeof evaluationResult.value === "boolean" && evaluationResult.value;
                    }
                    if (!evaluationResult.value) {
                        // Value was not found, and we should warn the client that the Expression was invalid
                        this.templateExpansionWarnings.push("WARN: Unable to parse the Adaptive Expression " + when + ". The $when condition has been set to false by default.");
                    }
                    dropObject = !whenValue;
                }
                else if (when) {
                    // If $when was provided, but it is not an AEL.Expression, drop the object
                    this.templateExpansionWarnings.push("WARN: " + when + " is not an Adaptive Expression. The $when condition has been set to false by default.");
                    dropObject = true;
                }
                if (!dropObject) {
                    var expandedObject = this.expandSingleObject(node);
                    if (expandedObject !== null) {
                        result.push(expandedObject);
                    }
                }
            }
            if (result.length === 0) {
                result = null;
            }
            else if (result.length === 1) {
                result = result[0];
            }
        }
        else {
            result = node;
        }
        this._context.restoreLastState();
        return result;
    };
    /**
     * Expands the template using the provided context. Template expansion involves
     * evaluating the expressions used in the original template payload, as well as
     * repeating (expanding) parts of that payload that are bound to arrays.
     *
     * Example:
     *
     * ```typescript
     * let context = {
     *     $root: {
     *         firstName: "John",
     *         lastName: "Doe",
     *         children: [
     *             { fullName: "Jane Doe", age: 9 },
     *             { fullName: "Alex Doe", age: 12 }
     *         ]
     *     }
     * }
     *
     * let templatePayload = {
     *     type: "AdaptiveCard",
     *     version: "1.2",
     *     body: [
     *         {
     *             type: "TextBlock",
     *             text: "${firstName} ${lastName}"
     *         },
     *         {
     *             type: "TextBlock",
     *             $data: "${children}",
     *             text: "${fullName} (${age})"
     *         }
     *     ]
     * }
     *
     * let template = new Template(templatePayload);
     *
     * let expandedTemplate = template.expand(context);
     * ```
     *
     * With the above code, the value of `expandedTemplate` will be
     *
     * ```json
     * {
     *     type: "AdaptiveCard",
     *     version: "1.2",
     *     body: [
     *         {
     *             type: "TextBlock",
     *             text: "John Doe"
     *         },
     *         {
     *             type: "TextBlock",
     *             text: "Jane Doe (9)"
     *         },
     *         {
     *             type: "TextBlock",
     *             text: "Alex Doe (12)"
     *         }
     *     ]
     * }
     * ```
     *
     * @param context The context to bind the template to.
     * @returns A value representing the expanded template. The type of that value
     *   is dependent on the type of the original template payload passed to the constructor.
     */
    Template.prototype.expand = function (context) {
        this.templateExpansionWarnings = [];
        this._context = new EvaluationContext(context);
        return this.internalExpand(this._preparedPayload);
    };
    /**
     * Getter method for the array of warning strings
     * @returns An array storing any warnings that occurred while expanding the template
     */
    Template.prototype.getLastTemplateExpansionWarnings = function () {
        return this.templateExpansionWarnings;
    };
    return Template;
}());
exports.Template = Template;


/***/ }),

/***/ "adaptive-expressions":
/*!****************************************************************************************************!*\
  !*** external {"commonjs2":"adaptive-expressions","commonjs":"adaptive-expressions","root":"AEL"} ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_adaptive_expressions__;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"adaptivecards-templating","version":"2.3.1","description":"Adaptive Card data binding and templating engine for JavaScript","author":"AdaptiveCards","license":"MIT","homepage":"https://adaptivecards.io","repository":{"type":"git","url":"https://github.com/microsoft/AdaptiveCards.git","directory":"source/nodejs/adaptivecards-templating"},"keywords":["adaptivecards","adaptive","cards","microsoft","bot"],"main":"lib/adaptivecards-templating.js","types":"lib/adaptivecards-templating.d.ts","files":["lib","dist","src"],"scripts":{"clean":"rimraf build lib dist","prebuild":"tsc","build":"webpack","watch":"webpack --watch","start":"webpack-dev-server --open","dts":"dts-generator --prefix adaptivecards-templating --project . --out dist/adaptivecards-templating.d.ts","lint":"eslint src/*.ts","release":"npm run build && webpack --mode=production && npm run dts","docs":"npx typedoc"},"devDependencies":{"@types/json-schema":"^7.0.8","adaptive-expressions":"^4.11.0","adaptivecards":"^2.11.1","typedoc":"^0.22.5","typedoc-plugin-markdown":"^3.11.2"},"peerDependencies":{"adaptive-expressions":"^4.11.0"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/adaptivecards-templating.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDO3FCQUMvQjtpQkFDSjthQUNKO1lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckIsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNqQjtpQkFDSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0o7YUFDSTtZQUNELE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFakMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQWFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrRUc7SUFDSCx5QkFBTSxHQUFOLFVBQU8sT0FBMkI7UUFDOUIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7O09BR0c7SUFDSSxtREFBZ0MsR0FBdkM7UUFDSSxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztJQUMxQyxDQUFDO0lBQ0wsZUFBQztBQUFELENBQUM7QUF4WVksNEJBQVE7Ozs7Ozs7Ozs7O0FDM0pyQjs7Ozs7Ozs7Ozs7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BQ0RhdGEvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0FDRGF0YS8uL3NyYy9hZGFwdGl2ZWNhcmRzLXRlbXBsYXRpbmcudHMiLCJ3ZWJwYWNrOi8vQUNEYXRhLy4vc3JjL2pzb24tc2NoZW1hLWNhcmQudHMiLCJ3ZWJwYWNrOi8vQUNEYXRhLy4vc3JjL3RlbXBsYXRlLWVuZ2luZS50cyIsIndlYnBhY2s6Ly9BQ0RhdGEvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzMlwiOlwiYWRhcHRpdmUtZXhwcmVzc2lvbnNcIixcImNvbW1vbmpzXCI6XCJhZGFwdGl2ZS1leHByZXNzaW9uc1wiLFwicm9vdFwiOlwiQUVMXCJ9Iiwid2VicGFjazovL0FDRGF0YS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BQ0RhdGEvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9BQ0RhdGEvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0FDRGF0YS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWRhcHRpdmUtZXhwcmVzc2lvbnNcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQUNEYXRhXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYWRhcHRpdmUtZXhwcmVzc2lvbnNcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFDRGF0YVwiXSA9IGZhY3Rvcnkocm9vdFtcIkFFTFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FkYXB0aXZlX2V4cHJlc3Npb25zX18pIHtcbnJldHVybiAiLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG5leHBvcnQgKiBmcm9tIFwiLi90ZW1wbGF0ZS1lbmdpbmVcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vanNvbi1zY2hlbWEtY2FyZFwiOyIsIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcblxyXG5pbXBvcnQgeyBJQWRhcHRpdmVDYXJkLCBJQ2FyZEVsZW1lbnQsIElDaG9pY2VTZXRJbnB1dCwgSUNvbnRhaW5lciwgSU51bWJlcklucHV0LCBJVGV4dElucHV0LCBJVGltZUlucHV0LCBJVG9nZ2xlSW5wdXQgfSBmcm9tICdhZGFwdGl2ZWNhcmRzL3NyYy9zY2hlbWEnO1xyXG5pbXBvcnQgeyBKU09OU2NoZW1hNywgSlNPTlNjaGVtYTdEZWZpbml0aW9uLCBKU09OU2NoZW1hN1R5cGUgfSBmcm9tICdqc29uLXNjaGVtYSc7XHJcblxyXG5cclxuLy8gSlNPTiBTY2hlbWEgQ2FyZFxyXG4vLyBnZW5lcmF0ZXMgYW4gQWRhcHRpdmUgQ2FyZCBnaXZlbiBhIEpTT04gc2NoZW1hXHJcbmV4cG9ydCBmdW5jdGlvbiBKU09OU2NoZW1hQ2FyZChzY2hlbWE6IEpTT05TY2hlbWE3KTogSUFkYXB0aXZlQ2FyZCB8IHVuZGVmaW5lZCB7XHJcblx0dHJ5IHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHR5cGU6IFwiQWRhcHRpdmVDYXJkXCIsXHJcblx0XHRcdGJvZHk6IFtcclxuXHRcdFx0XHRKU09OU2NoZW1hQ2FyZE9iamVjdChzY2hlbWEsICcnLCAwKSxcclxuXHRcdFx0XSxcclxuXHRcdH1cclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGUpO1xyXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vLyBKU09OIFNjaGVtYSBFbGVtZW50c1xyXG5cclxuZnVuY3Rpb24gSlNPTlNjaGVtYUNhcmRFbGVtZW50KHNjaGVtYTogSlNPTlNjaGVtYTdEZWZpbml0aW9uLCBwYXRoOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpOiBJQ2FyZEVsZW1lbnQge1xyXG4gICAgaWYgKHR5cGVvZiAoc2NoZW1hKSA9PT0gXCJib29sZWFuXCIpIHJldHVybiBudWxsO1xyXG4gICAgc3dpdGNoIChzY2hlbWEudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJhcnJheVwiOlxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEuaXRlbXMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTlNjaGVtYUNhcmRUdXBsZShzY2hlbWEsIHBhdGgsIGRlcHRoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OU2NoZW1hQ2FyZExpc3Qoc2NoZW1hLCBwYXRoLCBkZXB0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OU2NoZW1hQ2FyZE9iamVjdChzY2hlbWEsIHBhdGgsIGRlcHRoKTtcclxuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxyXG4gICAgICAgICAgICByZXR1cm4gSlNPTlNjaGVtYUNhcmRCb29sZWFuKHNjaGVtYSwgcGF0aClcclxuICAgICAgICBjYXNlIFwiaW50ZWdlclwiOlxyXG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIEpTT05TY2hlbWFDYXJkTnVtYmVyKHNjaGVtYSwgcGF0aClcclxuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XHJcbiAgICAgICAgICAgIGlmIChzY2hlbWEuZW51bSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT05TY2hlbWFDYXJkQ2hvaWNlU2V0KHNjaGVtYSwgcGF0aClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OU2NoZW1hQ2FyZFRleHQoc2NoZW1hLCBwYXRoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBcImRhdGUtdGltZVwiOlxyXG4gICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIEpTT05TY2hlbWFDYXJkVGltZShzY2hlbWEsIHBhdGgpXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuY29kZVByb3BlcnR5KHByb3BlcnR5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQocHJvcGVydHkpLnJlcGxhY2UoJy4nLCAnJTJlJylcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dFNpemVBdERlcHRoKGRlcHRoOiBudW1iZXIpIHtcclxuICAgIHN3aXRjaCAoZGVwdGgpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIFwibGFyZ2VcIlxyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgXCJtZWRpdW1cIlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIFwic21hbGxcIlxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OU2NoZW1hRmllbGRUaXRsZShzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpOiBJQ2FyZEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHNjaGVtYS50aXRsZSA/IHtcclxuICAgICAgICAgICAgdHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAgICAgICAgc2l6ZTogdGV4dFNpemVBdERlcHRoKGRlcHRoKSxcclxuICAgICAgICAgICAgdGV4dDogc2NoZW1hLnRpdGxlLFxyXG4gICAgICAgIH0gOiBudWxsLFxyXG4gICAgICAgIHNjaGVtYS5kZXNjcmlwdGlvbiA/IHtcclxuICAgICAgICAgICAgdHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAgICAgICAgc2l6ZTogdGV4dFNpemVBdERlcHRoKGRlcHRoICsgMSksXHJcbiAgICAgICAgICAgIGlzU3VidGxlOiB0cnVlLFxyXG4gICAgICAgICAgICB3cmFwOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZXh0OiBzY2hlbWEuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgfSA6IG51bGwsXHJcbiAgICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05TY2hlbWFDYXJkVHVwbGUoc2NoZW1hOiBKU09OU2NoZW1hNywgcGF0aDogc3RyaW5nLCBkZXB0aDogbnVtYmVyKTogSUNvbnRhaW5lciB7XHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSkgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6IFwiQ29udGFpbmVyXCIsXHJcbiAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgLi4uSlNPTlNjaGVtYUZpZWxkVGl0bGUoc2NoZW1hLCBwYXRoLCBkZXB0aCksXHJcbiAgICAgICAgICAgIC4uLnNjaGVtYS5pdGVtcz8ubWFwKChpdGVtOiBKU09OU2NoZW1hN0RlZmluaXRpb24sIGlkeDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTlNjaGVtYUNhcmRFbGVtZW50KGl0ZW0sIGAke3BhdGh9WyR7aWR4fV1gLCBkZXB0aCArIDEpXHJcbiAgICAgICAgICAgIH0pID8/IFtdLFxyXG4gICAgICAgIF0sXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05TY2hlbWFDYXJkTGlzdChzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpOiBJQ29udGFpbmVyIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogXCJDb250YWluZXJcIixcclxuICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAuLi5KU09OU2NoZW1hRmllbGRUaXRsZShzY2hlbWEsIHBhdGgsIGRlcHRoKSxcclxuICAgICAgICAgICAgLy8gVE9ETyBub3QgaW1wbGVtZW50ZWRcclxuICAgICAgICBdLFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OU2NoZW1hQ2FyZE9iamVjdChzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpOiBJQ29udGFpbmVyIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogXCJDb250YWluZXJcIixcclxuICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAuLi5KU09OU2NoZW1hRmllbGRUaXRsZShzY2hlbWEsIHBhdGgsIGRlcHRoKSxcclxuICAgICAgICAgICAgLi4uc2NoZW1hLnJlcXVpcmVkPy5tYXAoKHByb3BlcnR5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OU2NoZW1hQ2FyZEVsZW1lbnQoc2NoZW1hLnByb3BlcnRpZXNbcHJvcGVydHldLCBgJHtwYXRofS4ke2VuY29kZVByb3BlcnR5KHByb3BlcnR5KX1gLCBkZXB0aCArIDEpXHJcbiAgICAgICAgICAgIH0pID8/IFtdLFxyXG4gICAgICAgIF0sXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05TY2hlbWFDYXJkQm9vbGVhbihzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcpOiBJVG9nZ2xlSW5wdXQge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBcIklucHV0LlRvZ2dsZVwiLFxyXG4gICAgICAgIGlkOiBwYXRoLFxyXG4gICAgICAgIHRpdGxlOiBzY2hlbWEudGl0bGUsXHJcbiAgICAgICAgbGFiZWw6IHNjaGVtYS5kZXNjcmlwdGlvbixcclxuICAgICAgICB2YWx1ZTogc2NoZW1hLmRlZmF1bHQgYXMgc3RyaW5nLFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OU2NoZW1hQ2FyZE51bWJlcihzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcpOiBJTnVtYmVySW5wdXQge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBcIklucHV0Lk51bWJlclwiLFxyXG4gICAgICAgIGlkOiBwYXRoLFxyXG4gICAgICAgIHRpdGxlOiBzY2hlbWEudGl0bGUsXHJcbiAgICAgICAgcGxhY2Vob2xkZXI6IHNjaGVtYS5kZXNjcmlwdGlvbixcclxuICAgICAgICB2YWx1ZTogc2NoZW1hLmRlZmF1bHQgYXMgc3RyaW5nLFxyXG4gICAgICAgIG1pbjogc2NoZW1hLmV4Y2x1c2l2ZU1pbmltdW0gPz8gc2NoZW1hLm1pbmltdW0sXHJcbiAgICAgICAgbWF4OiBzY2hlbWEuZXhjbHVzaXZlTWF4aW11bSA/PyBzY2hlbWEubWF4aW11bSxcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlNjaGVtYUNhcmRDaG9pY2VTZXQoc2NoZW1hOiBKU09OU2NoZW1hNywgcGF0aDogc3RyaW5nKTogSUNob2ljZVNldElucHV0IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogXCJJbnB1dC5DaG9pY2VTZXRcIixcclxuICAgICAgICBpZDogcGF0aCxcclxuICAgICAgICB0aXRsZTogc2NoZW1hLnRpdGxlLFxyXG4gICAgICAgIGNob2ljZXM6IHNjaGVtYS5lbnVtLm1hcCgoaXRlbTogSlNPTlNjaGVtYTdUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogaXRlbSBhcyBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbSBhcyBzdHJpbmcsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBwbGFjZWhvbGRlcjogc2NoZW1hLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHZhbHVlOiBzY2hlbWEuZGVmYXVsdCBhcyBzdHJpbmcsXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05TY2hlbWFDYXJkVGV4dChzY2hlbWE6IEpTT05TY2hlbWE3LCBwYXRoOiBzdHJpbmcpOiBJVGV4dElucHV0IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogXCJJbnB1dC5UZXh0XCIsXHJcbiAgICAgICAgaWQ6IHBhdGgsXHJcbiAgICAgICAgdGl0bGU6IHNjaGVtYS50aXRsZSxcclxuICAgICAgICBwbGFjZWhvbGRlcjogc2NoZW1hLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHZhbHVlOiBzY2hlbWEuZGVmYXVsdCBhcyBzdHJpbmcsXHJcbiAgICAgICAgbWF4TGVuZ3RoOiBzY2hlbWEubWF4TGVuZ3RoLFxyXG4gICAgICAgIHJlZ2V4OiBzY2hlbWEucGF0dGVybixcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlNjaGVtYUNhcmRUaW1lKHNjaGVtYTogSlNPTlNjaGVtYTcsIHBhdGg6IHN0cmluZyk6IElUaW1lSW5wdXQge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiBcIklucHV0LlRpbWVcIixcclxuICAgICAgICBpZDogcGF0aCxcclxuICAgICAgICB0aXRsZTogc2NoZW1hLnRpdGxlLFxyXG4gICAgICAgIHBsYWNlaG9sZGVyOiBzY2hlbWEuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdmFsdWU6IHNjaGVtYS5kZWZhdWx0IGFzIHN0cmluZyxcclxuICAgIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG5pbXBvcnQgKiBhcyBBRUwgZnJvbSBcImFkYXB0aXZlLWV4cHJlc3Npb25zXCI7XHJcbmNvbnN0IHBrZyA9IHJlcXVpcmUoJy4vLi4vcGFja2FnZS5qc29uJyk7XHJcblxyXG5jbGFzcyBFdmFsdWF0aW9uQ29udGV4dCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBfcmVzZXJ2ZWRGaWVsZHMgPSBbXCIkZGF0YVwiLCBcIiR3aGVuXCIsIFwiJHJvb3RcIiwgXCIkaW5kZXhcIiwgXCIkaG9zdFwiLCBcIiRfYWNUZW1wbGF0ZVZlcnNpb25cIl07XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RhdGVTdGFjazogQXJyYXk8eyAkZGF0YTogYW55LCAkaW5kZXg6IGFueSB9PiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfJGRhdGE6IGFueTtcclxuXHJcbiAgICAkcm9vdDogYW55O1xyXG4gICAgJGhvc3Q6IGFueTtcclxuICAgICRpbmRleDogbnVtYmVyO1xyXG4gICAgJF9hY1RlbXBsYXRlVmVyc2lvbjogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQ/OiBJRXZhbHVhdGlvbkNvbnRleHQpIHtcclxuICAgICAgICBpZiAoY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJF9hY1RlbXBsYXRlVmVyc2lvbiA9IHRoaXMuZ2VuZXJhdGVWZXJzaW9uSnNvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IGNvbnRleHQuJHJvb3Q7XHJcbiAgICAgICAgICAgIHRoaXMuJGhvc3QgPSBjb250ZXh0LiRob3N0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1Jlc2VydmVkRmllbGQobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25Db250ZXh0Ll9yZXNlcnZlZEZpZWxkcy5pbmRleE9mKG5hbWUpID49IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVN0YXRlKCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXRlU3RhY2sucHVzaChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGRhdGE6IHRoaXMuJGRhdGEsXHJcbiAgICAgICAgICAgICAgICAkaW5kZXg6IHRoaXMuJGluZGV4XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3RvcmVMYXN0U3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlU3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIGV2YWx1YXRpb24gY29udGV4dCBzdGF0ZSB0byByZXN0b3JlLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzYXZlZENvbnRleHQgPSB0aGlzLl9zdGF0ZVN0YWNrLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLiRkYXRhID0gc2F2ZWRDb250ZXh0LiRkYXRhO1xyXG4gICAgICAgIHRoaXMuJGluZGV4ID0gc2F2ZWRDb250ZXh0LiRpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgJGRhdGEoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJGRhdGEgIT09IHVuZGVmaW5lZCA/IHRoaXMuXyRkYXRhIDogdGhpcy4kcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgJGRhdGEodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuXyRkYXRhID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVWZXJzaW9uSnNvbigpIHtcclxuICAgICAgICAvLyBFeGFtcGxlIHZlcnNpb246IDIuMy4wLWFscGhhXHJcbiAgICAgICAgY29uc3QgdmVyc2lvbiA9IHBrZy52ZXJzaW9uO1xyXG4gICAgICAgIGNvbnN0IHZlcnNpb25TcGxpdCA9IHZlcnNpb24uc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgICAgbGV0IHBhdGNoU3BsaXQgPSBbXTtcclxuICAgICAgICBjb25zdCBwYXRjaEluZGV4ID0gMjtcclxuICAgICAgICBpZiAodmVyc2lvblNwbGl0W3BhdGNoSW5kZXhdKSB7XHJcbiAgICAgICAgICAgIHBhdGNoU3BsaXQgPSB2ZXJzaW9uU3BsaXRbcGF0Y2hJbmRleF0uc3BsaXQoJy0nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwibWFqb3JcIjogcGFyc2VJbnQodmVyc2lvblNwbGl0WzBdKSxcclxuICAgICAgICAgICAgXCJtaW5vclwiOiBwYXJzZUludCh2ZXJzaW9uU3BsaXRbMV0pLFxyXG4gICAgICAgICAgICBcInBhdGNoXCI6IHBhcnNlSW50KHBhdGNoU3BsaXRbMF0pLFxyXG4gICAgICAgICAgICBcInN1ZmZpeFwiOiBwYXRjaFNwbGl0WzFdIHx8IFwiXCIsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBUZW1wbGF0ZU9iamVjdE1lbW9yeSBpbXBsZW1lbnRzIEFFTC5NZW1vcnlJbnRlcmZhY2Uge1xyXG4gICAgcHJpdmF0ZSBfbWVtb3J5OiBBRUwuTWVtb3J5SW50ZXJmYWNlO1xyXG5cclxuICAgICRyb290OiBhbnk7XHJcbiAgICAkZGF0YTogYW55O1xyXG4gICAgJGluZGV4OiBhbnk7XHJcbiAgICAkaG9zdDogYW55O1xyXG4gICAgJF9hY1RlbXBsYXRlVmVyc2lvbjogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX21lbW9yeSA9IG5ldyBBRUwuU2ltcGxlT2JqZWN0TWVtb3J5KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZhbHVlKHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgbGV0IGFjdHVhbFBhdGggPSAocGF0aC5sZW5ndGggPiAwICYmIHBhdGhbMF0gIT09IFwiJFwiKSA/IFwiJGRhdGEuXCIgKyBwYXRoIDogcGF0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lbW9yeS5nZXRWYWx1ZShhY3R1YWxQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZShwYXRoOiBzdHJpbmcsIGlucHV0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9tZW1vcnkuc2V0VmFsdWUocGF0aCwgaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHZlcnNpb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWVtb3J5LnZlcnNpb24oKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEhvbGRzIGdsb2JhbCBzZXR0aW5ncyB0aGF0IGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSB0aGUgd2F5IHRlbXBsYXRlcyBhcmUgZXhwYW5kZWQuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR2xvYmFsU2V0dGluZ3Mge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayBpbnZva2VkIHdoZW4gZXhwcmVzc2lvbiBldmFsdWF0aW9uIG5lZWRzIHRoZSB2YWx1ZSBvZiBhIGZpZWxkIGluIHRoZSBzb3VyY2UgZGF0YSBvYmplY3RcclxuICAgICAqIGFuZCB0aGF0IGZpZWxkIGlzIHVuZGVmaW5lZCBvciBudWxsLiBCeSBkZWZhdWx0LCBleHByZXNzaW9uIGV2YWx1YXRpb24gd2lsbCBzdWJzdGl0dXRlIGFuIHVuZGVmaW5lZFxyXG4gICAgICogZmllbGQgd2l0aCBpdHMgYmluZGluZyBleHByZXNzaW9uIChlLmcuIGAke2ZpZWxkfWApLiBUaGlzIGNhbGxiYWNrIG1ha2VzIGl0IHBvc3NpYmxlIHRvIGN1c3RvbWl6ZSB0aGF0XHJcbiAgICAgKiBiZWhhdmlvci5cclxuICAgICAqXHJcbiAgICAgKiAqKkV4YW1wbGUqKlxyXG4gICAgICogR2l2ZW4gdGhpcyBkYXRhIG9iamVjdDpcclxuICAgICAqXHJcbiAgICAgKiBgYGBqc29uXHJcbiAgICAgKiB7XHJcbiAgICAgKiAgICAgZmlyc3ROYW1lOiBcIkRhdmlkXCJcclxuICAgICAqIH1cclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIFRoZSBleHByZXNzaW9uIGAke2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gIHdpbGwgZXZhbHVhdGUgdG8gXCJEYXZpZCAke2xhc3ROYW1lfVwiIGJlY2F1c2UgdGhlIGBsYXN0TmFtZWBcclxuICAgICAqIGZpZWxkIGlzIHVuZGVmaW5lZC5cclxuICAgICAqXHJcbiAgICAgKiBOb3cgbGV0J3Mgc2V0IHRoZSBjYWxsYmFjazpcclxuICAgICAqIGBgYHR5cGVzY3JpcHRcclxuICAgICAqIEdsb2JhbFNldHRpbmdzLmdldFVuZGVmaW5lZEZpZWxkVmFsdWVTdWJzdGl0dXRpb25TdHJpbmcgPSAocGF0aDogc3RyaW5nKSA9PiB7IHJldHVybiBcIjx1bmRlZmluZWQgdmFsdWU+XCI7IH1cclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIFdpdGggdGhhdCwgdGhlIGFib3ZlIGV4cHJlc3Npb24gd2lsbCBldmFsdWF0ZSB0byBcIkRhdmlkICZsdDt1bmRlZmluZWQgdmFsdWUmZ3Q7XCJcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFVuZGVmaW5lZEZpZWxkVmFsdWVTdWJzdGl0dXRpb25TdHJpbmc/OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIb2xkcyB0aGUgY29udGV4dCB1c2VkIHRvIGV4cGFuZCBhIHRlbXBsYXRlLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJRXZhbHVhdGlvbkNvbnRleHQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcm9vdCBkYXRhIG9iamVjdCB0aGUgdGVtcGxhdGUgd2lsbCBiaW5kIHRvLiBFeHByZXNzaW9ucyB0aGF0IHJlZmVyIHRvICRyb290IGluIHRoZSB0ZW1wbGF0ZSBwYXlsb2FkXHJcbiAgICAgKiBtYXAgdG8gdGhpcyBmaWVsZC4gSW5pdGlhbGx5LCAkZGF0YSBhbHNvIG1hcHMgdG8gJHJvb3QuXHJcbiAgICAgKi9cclxuICAgICRyb290PzogYW55O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgaG9zdCBkYXRhIG9iamVjdCB0aGUgdGVtcGxhdGUgd2lsbCBiaW5kIHRvLiBFeHByZXNzaW9ucyB0aGF0IHJlZmVyIHRvICRob3N0IGluIHRoZSB0ZW1wbGF0ZSBwYXlsb2FkXHJcbiAgICAgKiBtYXAgdG8gdGhpcyBmaWVsZC4gVGhpcyBhbGxvd3MgYSBob3N0IHByb2Nlc3MgdG8gc3VwcGx5IGFkZGl0aW9uYWwgY29udGV4dCB0byB0aGUgdGVtcGxhdGUuXHJcbiAgICAgKi9cclxuICAgICRob3N0PzogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyBhIHRlbXBsYXRlIHRoYXQgY2FuIGJlIGJvdW5kIHRvIGRhdGEuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUge1xyXG5cclxuICAgIHByaXZhdGUgdGVtcGxhdGVFeHBhbnNpb25XYXJuaW5ncztcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcmVwYXJlKG5vZGU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5wYXJzZUludGVycG9sYXRlZFN0cmluZyhub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIgJiYgbm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChUZW1wbGF0ZS5wcmVwYXJlKGl0ZW0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gVGVtcGxhdGUucHJlcGFyZShub2RlW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnRlcm5hbFRyeUV2YWx1YXRlRXhwcmVzc2lvbihleHByZXNzaW9uOiBBRUwuRXhwcmVzc2lvbiwgY29udGV4dDogRXZhbHVhdGlvbkNvbnRleHQsIGFsbG93U3Vic3RpdHV0aW9uczogYm9vbGVhbik6IHsgdmFsdWU6IGFueTsgZXJyb3I6IHN0cmluZyB9IHtcclxuICAgICAgICBsZXQgbWVtb3J5ID0gbmV3IFRlbXBsYXRlT2JqZWN0TWVtb3J5KCk7XHJcbiAgICAgICAgbWVtb3J5LiRyb290ID0gY29udGV4dC4kcm9vdDtcclxuICAgICAgICBtZW1vcnkuJGRhdGEgPSBjb250ZXh0LiRkYXRhO1xyXG4gICAgICAgIG1lbW9yeS4kaW5kZXggPSBjb250ZXh0LiRpbmRleDtcclxuICAgICAgICBtZW1vcnkuJGhvc3QgPSBjb250ZXh0LiRob3N0O1xyXG4gICAgICAgIG1lbW9yeS4kX2FjVGVtcGxhdGVWZXJzaW9uID0gY29udGV4dC4kX2FjVGVtcGxhdGVWZXJzaW9uO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uczogQUVMLk9wdGlvbnMgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhbGxvd1N1YnN0aXR1dGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IG5ldyBBRUwuT3B0aW9ucygpO1xyXG4gICAgICAgICAgICBvcHRpb25zLm51bGxTdWJzdGl0dXRpb24gPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3Vic3RpdHV0aW9uVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoR2xvYmFsU2V0dGluZ3MuZ2V0VW5kZWZpbmVkRmllbGRWYWx1ZVN1YnN0aXR1dGlvblN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnN0aXR1dGlvblZhbHVlID0gR2xvYmFsU2V0dGluZ3MuZ2V0VW5kZWZpbmVkRmllbGRWYWx1ZVN1YnN0aXR1dGlvblN0cmluZyhwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic3RpdHV0aW9uVmFsdWUgPyBzdWJzdGl0dXRpb25WYWx1ZSA6IFwiJHtcIiArIHBhdGggKyBcIn1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhlIHJvb3Qgb2YgYW4gZXhwcmVzc2lvbiBjb21pbmcgZnJvbSBhbiBpbnRlcnBvbGF0ZWQgc3RyaW5nIGlzIG9mIHR5cGUgQ29uY2F0LlxyXG4gICAgICAgIC8vIEluIHRoYXQgY2FzZSwgYW5kIGlmIHRoZSBjYWxsZXIgYWxsb3dzIGl0LCB3ZSdyZSBkb2luZyBvdXIgb3duIGNvbmNhdGVuYXRpb25cclxuICAgICAgICAvLyBpbiBvcmRlciB0byBjYXRjaCBlYWNoIGluZGl2aWR1YWwgZXhwcmVzc2lvbiBldmFsdWF0aW9uIGVycm9yIGFuZCBzdWJzdGl0dXRlIGluXHJcbiAgICAgICAgLy8gdGhlIGZpbmFsIHN0cmluZ1xyXG4gICAgICAgIGlmIChleHByZXNzaW9uLnR5cGUgPT09IEFFTC5FeHByZXNzaW9uVHlwZS5Db25jYXQgJiYgYWxsb3dTdWJzdGl0dXRpb25zKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGRFeHByZXNzaW9uIG9mIGV4cHJlc3Npb24uY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGxldCBldmFsdWF0aW9uUmVzdWx0OiB7IHZhbHVlOiBhbnk7IGVycm9yOiBzdHJpbmcgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSBjaGlsZEV4cHJlc3Npb24udHJ5RXZhbHVhdGUobWVtb3J5LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlJ2xsIHN3YWxsb3cgYWxsIGV4Y2VwdGlvbnMgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBleFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV2YWx1YXRpb25SZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmFsdWF0aW9uUmVzdWx0LnZhbHVlID0gXCIke1wiICsgY2hpbGRFeHByZXNzaW9uLnRvU3RyaW5nKCkgKyBcIn1cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZXZhbHVhdGlvblJlc3VsdC52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogcmVzdWx0LCBlcnJvcjogdW5kZWZpbmVkIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbi50cnlFdmFsdWF0ZShtZW1vcnksIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFyc2VzIGFuIGludGVycG9sYXRlZCBzdHJpbmcgaW50byBhbiBFeHByZXNzaW9uIG9iamVjdCByZWFkeSB0byBldmFsdWF0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW50ZXJwb2xhdGVkU3RyaW5nIFRoZSBpbnRlcnBvbGF0ZWQgc3RyaW5nIHRvIHBhcnNlLiBFeGFtcGxlOiBcIkhlbGxvICR7bmFtZX1cIlxyXG4gICAgICogQHJldHVybnMgQW4gRXhwcmVzc2lvbiBvYmplY3QgaWYgdGhlIHByb3ZpZGVkIGludGVycG9sYXRlZCBzdHJpbmcgY29udGFpbmVkIGF0IGxlYXN0IG9uZSBleHByZXNzaW9uIChlLmcuIFwiJHtleHByZXNzaW9ufVwiKTsgdGhlIG9yaWdpbmFsIHN0cmluZyBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2VJbnRlcnBvbGF0ZWRTdHJpbmcoaW50ZXJwb2xhdGVkU3RyaW5nOiBzdHJpbmcpOiBBRUwuRXhwcmVzc2lvbiB8IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGxvb2t1cDogQUVMLkV2YWx1YXRvckxvb2t1cCA9ICh0eXBlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YW5kYXJkRnVuY3Rpb24gPSBBRUwuRXhwcmVzc2lvbkZ1bmN0aW9ucy5zdGFuZGFyZEZ1bmN0aW9ucy5nZXQodHlwZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhbmRhcmRGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YW5kYXJkRnVuY3Rpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFFTC5FeHByZXNzaW9uRXZhbHVhdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgKGV4cHJlc3Npb246IEFFTC5FeHByZXNzaW9uLCBzdGF0ZTogQUVMLk1lbW9yeUludGVyZmFjZSwgb3B0aW9uczogQUVMLk9wdGlvbnMpID0+IHsgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBmdW5jdGlvbiBcIiArIHR5cGUpOyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIEFFTC5SZXR1cm5UeXBlLlN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBleHByZXNzaW9uIHN0YXJ0IG1hcmtlciwgbGV0J3MgYXR0ZW1wdCB0byBjb252ZXJ0IGludG8gYW4gZXhwcmVzc2lvblxyXG4gICAgICAgIGlmIChpbnRlcnBvbGF0ZWRTdHJpbmcuaW5kZXhPZihcIiR7XCIpID49IDApIHtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZEV4cHJlc3Npb24gPSBBRUwuRXhwcmVzc2lvbi5wYXJzZShcImBcIiArIGludGVycG9sYXRlZFN0cmluZyArIFwiYFwiLCBsb29rdXApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcnNlZEV4cHJlc3Npb24udHlwZSA9PT0gXCJjb25jYXRcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZEV4cHJlc3Npb24uY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmICEocGFyc2VkRXhwcmVzc2lvbi5jaGlsZHJlblswXSBpbnN0YW5jZW9mIEFFTC5Db25zdGFudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY29uY2F0IGNvbnRhaW5zIGEgc2luZ2xlIGNoaWxkIHRoYXQgaXNuJ3QgYSBjb25zdGFudCwgdGh1cyB0aGUgb3JpZ2luYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdHJpbmcgd2FzIGEgc2luZ2xlIGV4cHJlc3Npb24uIFdoZW4gZXZhbHVhdGVkLCB3ZSB3YW50IGl0IHRvIHByb2R1Y2UgdGhlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAvLyBvZiB0aGF0IHNpbmdsZSBleHByZXNzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEV4cHJlc3Npb24uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJzZWRFeHByZXNzaW9uLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdENoaWxkID0gcGFyc2VkRXhwcmVzc2lvbi5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0Q2hpbGQgaW5zdGFuY2VvZiBBRUwuQ29uc3RhbnQgJiYgZmlyc3RDaGlsZC52YWx1ZSA9PT0gXCJcIiAmJiAhKHBhcnNlZEV4cHJlc3Npb24uY2hpbGRyZW5bMV0gaW5zdGFuY2VvZiBBRUwuQ29uc3RhbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjb25jYXQgY29udGFpbnMgMiBjaGlsZHJlbiwgYW5kIHRoZSBmaXJzdCBvbmUgaXMgYW4gZW1wdHkgc3RyaW5nIGNvbnN0YW50IGFuZCB0aGUgc2Vjb25kIGlzbid0IGEgY29uc3RhbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZyb20gdmVyc2lvbiA0LjEwLjMsIEFFTCBhbHdheXMgaW5zZXJ0cyBhbiBlbXB0eSBzdHJpbmcgY29uc3RhbnQgaW4gYWxsIGNvbmNhdCBleHByZXNzaW9uLiBUaHVzIHRoZSBvcmlnaW5hbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHJpbmcgd2FzIGEgc2luZ2xlIGV4cHJlc3Npb24gaW4gdGhpcyBjYXNlIGFzIHdlbGwuIFdoZW4gZXZhbHVhdGVkLCB3ZSB3YW50IGl0IHRvIHByb2R1Y2UgdGhlIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2YgdGhhdCBzaW5nbGUgZXhwcmVzc2lvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEV4cHJlc3Npb24uY2hpbGRyZW5bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2Ugd2FudCB0aGUgZXhwcmVzc2lvbiB0byBwcm9kdWNlIGEgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkRXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG9yaWdpbmFsIHN0cmluZyBkaWRuJ3QgY29udGFpbiBhbnkgZXhwcmVzc2lvbiwgcmV0dXJuIGkgYXMgaXNcclxuICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGVkU3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZXMgdG8gZXZhbHVhdGUgdGhlIHByb3ZpZGVkIGV4cHJlc3Npb24gdXNpbmcgdGhlIHByb3ZpZGVkIGNvbnRleHQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUuXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY29udGV4dCAoZGF0YSkgdXNlZCB0byBldmFsdWF0ZSB0aGUgZXhwcmVzc2lvbi5cclxuICAgICAqIEBwYXJhbSBhbGxvd1N1YnN0aXR1dGlvbnMgSW5kaWNhdGVzIGlmIHRoZSBleHByZXNzaW9uIGV2YWx1YXRvciBzaG91bGQgc3Vic3RpdHV0ZSB1bmRlZmluZWQgdmFsdWUgd2l0aCBhIGRlZmF1bHRcclxuICAgICAqICAgc3RyaW5nIG9yIHRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgR2xvYmFsU2V0dGluZ3MuZ2V0VW5kZWZpbmVkRmllbGRWYWx1ZVN1YnN0aXR1dGlvblN0cmluZyBjYWxsYmFjay5cclxuICAgICAqIEByZXR1cm5zIEFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHJlc3VsdCBvZiB0aGUgZXZhbHVhdGlvbi4gSWYgdGhlIGV2YWx1YXRpb24gc3VjY2VlZGVkLCB0aGUgdmFsdWUgcHJvcGVydHlcclxuICAgICAqICAgY29udGFpbnMgdGhlIGFjdHVhbCBldmFsdWF0aW9uIHJlc3VsdCwgYW5kIHRoZSBlcnJvciBwcm9wZXJ0eSBpcyB1bmRlZmluZWQuIElmIHRoZSBldmFsdWF0aW9uIGZhaWxzLCB0aGUgZXJyb3JcclxuICAgICAqICAgcHJvcGVydHkgY29udGFpbnMgYSBtZXNzYWdlIGRldGFpbGluZyB0aGUgZXJyb3IgdGhhdCBvY2N1cnJlZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cnlFdmFsdWF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogQUVMLkV4cHJlc3Npb24sIGNvbnRleHQ6IElFdmFsdWF0aW9uQ29udGV4dCwgYWxsb3dTdWJzdGl0dXRpb25zOiBib29sZWFuKTogeyB2YWx1ZTogYW55OyBlcnJvcjogc3RyaW5nIH0ge1xyXG4gICAgICAgIHJldHVybiBUZW1wbGF0ZS5pbnRlcm5hbFRyeUV2YWx1YXRlRXhwcmVzc2lvbihleHByZXNzaW9uLCBuZXcgRXZhbHVhdGlvbkNvbnRleHQoY29udGV4dCksIGFsbG93U3Vic3RpdHV0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udGV4dDogRXZhbHVhdGlvbkNvbnRleHQ7XHJcbiAgICBwcml2YXRlIF9wcmVwYXJlZFBheWxvYWQ6IGFueTtcclxuXHJcbiAgICBwcml2YXRlIGV4cGFuZFNpbmdsZU9iamVjdChub2RlOiBvYmplY3QpOiBhbnkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSB7fTtcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NvbnRleHQuaXNSZXNlcnZlZEZpZWxkKGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxFeHBhbmQobm9kZVtrZXldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnRlcm5hbEV4cGFuZChub2RlOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGV4dC5zYXZlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW1BcnJheTogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2Ygbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4cGFuZGVkSXRlbSA9IHRoaXMuaW50ZXJuYWxFeHBhbmQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkSXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGV4cGFuZGVkSXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUFycmF5ID0gaXRlbUFycmF5LmNvbmNhdChleHBhbmRlZEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUFycmF5LnB1c2goZXhwYW5kZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW1BcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIEFFTC5FeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBldmFsdWF0aW9uUmVzdWx0ID0gVGVtcGxhdGUuaW50ZXJuYWxUcnlFdmFsdWF0ZUV4cHJlc3Npb24obm9kZSwgdGhpcy5fY29udGV4dCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWV2YWx1YXRpb25SZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGV2YWx1YXRpb25SZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXZhbHVhdGlvblJlc3VsdC5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIgJiYgbm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgd2hlbiA9IG5vZGVbXCIkd2hlblwiXTtcclxuICAgICAgICAgICAgbGV0IGRhdGFDb250ZXh0ID0gbm9kZVtcIiRkYXRhXCJdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YUNvbnRleHRJc0FycmF5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBkYXRhQ29udGV4dHM6IGFueVtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGFDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFDb250ZXh0cyA9IFsgdW5kZWZpbmVkIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbnRleHQgaW5zdGFuY2VvZiBBRUwuRXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBldmFsdWF0aW9uUmVzdWx0ID0gVGVtcGxhdGUuaW50ZXJuYWxUcnlFdmFsdWF0ZUV4cHJlc3Npb24oZGF0YUNvbnRleHQsIHRoaXMuX2NvbnRleHQsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV2YWx1YXRpb25SZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUNvbnRleHQgPSBldmFsdWF0aW9uUmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGV2YWx1YXRpb25SZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhQ29udGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQ29udGV4dHMgPSBkYXRhQ29udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhQ29udGV4dElzQXJyYXkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUNvbnRleHRzID0gWyBkYXRhQ29udGV4dCBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUNvbnRleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbnRleHRJc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGV4dC4kaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhQ29udGV4dHNbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRleHQuJGRhdGEgPSBkYXRhQ29udGV4dHNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRyb3BPYmplY3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod2hlbiBpbnN0YW5jZW9mIEFFTC5FeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2YWx1YXRpb25SZXN1bHQgPSBUZW1wbGF0ZS5pbnRlcm5hbFRyeUV2YWx1YXRlRXhwcmVzc2lvbih3aGVuLCB0aGlzLl9jb250ZXh0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdoZW5WYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiAkd2hlbiBmYWlscyB0byBldmFsdWF0ZSBvciBldmFsdWF0ZXMgdG8gYW55dGhpbmcgYnV0IGEgYm9vbGVhbiwgY29uc2lkZXIgaXQgaXMgZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV2YWx1YXRpb25SZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlblZhbHVlID0gdHlwZW9mIGV2YWx1YXRpb25SZXN1bHQudmFsdWUgPT09IFwiYm9vbGVhblwiICYmIGV2YWx1YXRpb25SZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXZhbHVhdGlvblJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBWYWx1ZSB3YXMgbm90IGZvdW5kLCBhbmQgd2Ugc2hvdWxkIHdhcm4gdGhlIGNsaWVudCB0aGF0IHRoZSBFeHByZXNzaW9uIHdhcyBpbnZhbGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVFeHBhbnNpb25XYXJuaW5ncy5wdXNoKGBXQVJOOiBVbmFibGUgdG8gcGFyc2UgdGhlIEFkYXB0aXZlIEV4cHJlc3Npb24gJHt3aGVufS4gVGhlICR3aGVuIGNvbmRpdGlvbiBoYXMgYmVlbiBzZXQgdG8gZmFsc2UgYnkgZGVmYXVsdC5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRyb3BPYmplY3QgPSAhd2hlblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh3aGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgJHdoZW4gd2FzIHByb3ZpZGVkLCBidXQgaXQgaXMgbm90IGFuIEFFTC5FeHByZXNzaW9uLCBkcm9wIHRoZSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlRXhwYW5zaW9uV2FybmluZ3MucHVzaChgV0FSTjogJHt3aGVufSBpcyBub3QgYW4gQWRhcHRpdmUgRXhwcmVzc2lvbi4gVGhlICR3aGVuIGNvbmRpdGlvbiBoYXMgYmVlbiBzZXQgdG8gZmFsc2UgYnkgZGVmYXVsdC5gKTtcclxuICAgICAgICAgICAgICAgICAgICBkcm9wT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWRyb3BPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWRPYmplY3QgPSB0aGlzLmV4cGFuZFNpbmdsZU9iamVjdChub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkT2JqZWN0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGV4cGFuZGVkT2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRleHQucmVzdG9yZUxhc3RTdGF0ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZXMgYSBuZXcgVGVtcGxhdGUgaW5zdGFuY2UgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHBheWxvYWQuXHJcbiAgICAgKiBPbmNlIGNyZWF0ZWQsIHRoZSBpbnN0YW5jZSBjYW4gYmUgYm91bmQgdG8gZGlmZmVyZW50IGRhdGEgb2JqZWN0c1xyXG4gICAgICogaW4gYSBsb29wLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYXlsb2FkIFRoZSB0ZW1wbGF0ZSBwYXlsb2FkLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9wcmVwYXJlZFBheWxvYWQgPSBUZW1wbGF0ZS5wcmVwYXJlKHBheWxvYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdGVtcGxhdGUgdXNpbmcgdGhlIHByb3ZpZGVkIGNvbnRleHQuIFRlbXBsYXRlIGV4cGFuc2lvbiBpbnZvbHZlc1xyXG4gICAgICogZXZhbHVhdGluZyB0aGUgZXhwcmVzc2lvbnMgdXNlZCBpbiB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgcGF5bG9hZCwgYXMgd2VsbCBhc1xyXG4gICAgICogcmVwZWF0aW5nIChleHBhbmRpbmcpIHBhcnRzIG9mIHRoYXQgcGF5bG9hZCB0aGF0IGFyZSBib3VuZCB0byBhcnJheXMuXHJcbiAgICAgKlxyXG4gICAgICogRXhhbXBsZTpcclxuICAgICAqXHJcbiAgICAgKiBgYGB0eXBlc2NyaXB0XHJcbiAgICAgKiBsZXQgY29udGV4dCA9IHtcclxuICAgICAqICAgICAkcm9vdDoge1xyXG4gICAgICogICAgICAgICBmaXJzdE5hbWU6IFwiSm9oblwiLFxyXG4gICAgICogICAgICAgICBsYXN0TmFtZTogXCJEb2VcIixcclxuICAgICAqICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAqICAgICAgICAgICAgIHsgZnVsbE5hbWU6IFwiSmFuZSBEb2VcIiwgYWdlOiA5IH0sXHJcbiAgICAgKiAgICAgICAgICAgICB7IGZ1bGxOYW1lOiBcIkFsZXggRG9lXCIsIGFnZTogMTIgfVxyXG4gICAgICogICAgICAgICBdXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfVxyXG4gICAgICpcclxuICAgICAqIGxldCB0ZW1wbGF0ZVBheWxvYWQgPSB7XHJcbiAgICAgKiAgICAgdHlwZTogXCJBZGFwdGl2ZUNhcmRcIixcclxuICAgICAqICAgICB2ZXJzaW9uOiBcIjEuMlwiLFxyXG4gICAgICogICAgIGJvZHk6IFtcclxuICAgICAqICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgdHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAqICAgICAgICAgICAgIHRleHQ6IFwiJHtmaXJzdE5hbWV9ICR7bGFzdE5hbWV9XCJcclxuICAgICAqICAgICAgICAgfSxcclxuICAgICAqICAgICAgICAge1xyXG4gICAgICogICAgICAgICAgICAgdHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAqICAgICAgICAgICAgICRkYXRhOiBcIiR7Y2hpbGRyZW59XCIsXHJcbiAgICAgKiAgICAgICAgICAgICB0ZXh0OiBcIiR7ZnVsbE5hbWV9ICgke2FnZX0pXCJcclxuICAgICAqICAgICAgICAgfVxyXG4gICAgICogICAgIF1cclxuICAgICAqIH1cclxuICAgICAqXHJcbiAgICAgKiBsZXQgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGVQYXlsb2FkKTtcclxuICAgICAqXHJcbiAgICAgKiBsZXQgZXhwYW5kZWRUZW1wbGF0ZSA9IHRlbXBsYXRlLmV4cGFuZChjb250ZXh0KTtcclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIFdpdGggdGhlIGFib3ZlIGNvZGUsIHRoZSB2YWx1ZSBvZiBgZXhwYW5kZWRUZW1wbGF0ZWAgd2lsbCBiZVxyXG4gICAgICpcclxuICAgICAqIGBgYGpzb25cclxuICAgICAqIHtcclxuICAgICAqICAgICB0eXBlOiBcIkFkYXB0aXZlQ2FyZFwiLFxyXG4gICAgICogICAgIHZlcnNpb246IFwiMS4yXCIsXHJcbiAgICAgKiAgICAgYm9keTogW1xyXG4gICAgICogICAgICAgICB7XHJcbiAgICAgKiAgICAgICAgICAgICB0eXBlOiBcIlRleHRCbG9ja1wiLFxyXG4gICAgICogICAgICAgICAgICAgdGV4dDogXCJKb2huIERvZVwiXHJcbiAgICAgKiAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgKiAgICAgICAgICAgICB0ZXh0OiBcIkphbmUgRG9lICg5KVwiXHJcbiAgICAgKiAgICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgIHtcclxuICAgICAqICAgICAgICAgICAgIHR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgKiAgICAgICAgICAgICB0ZXh0OiBcIkFsZXggRG9lICgxMilcIlxyXG4gICAgICogICAgICAgICB9XHJcbiAgICAgKiAgICAgXVxyXG4gICAgICogfVxyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgVGhlIGNvbnRleHQgdG8gYmluZCB0aGUgdGVtcGxhdGUgdG8uXHJcbiAgICAgKiBAcmV0dXJucyBBIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgZXhwYW5kZWQgdGVtcGxhdGUuIFRoZSB0eXBlIG9mIHRoYXQgdmFsdWVcclxuICAgICAqICAgaXMgZGVwZW5kZW50IG9uIHRoZSB0eXBlIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBwYXlsb2FkIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IuXHJcbiAgICAgKi9cclxuICAgIGV4cGFuZChjb250ZXh0OiBJRXZhbHVhdGlvbkNvbnRleHQpOiBhbnkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVFeHBhbnNpb25XYXJuaW5ncyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBuZXcgRXZhbHVhdGlvbkNvbnRleHQoY29udGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxFeHBhbmQodGhpcy5fcHJlcGFyZWRQYXlsb2FkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHRlciBtZXRob2QgZm9yIHRoZSBhcnJheSBvZiB3YXJuaW5nIHN0cmluZ3NcclxuICAgICAqIEByZXR1cm5zIEFuIGFycmF5IHN0b3JpbmcgYW55IHdhcm5pbmdzIHRoYXQgb2NjdXJyZWQgd2hpbGUgZXhwYW5kaW5nIHRoZSB0ZW1wbGF0ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TGFzdFRlbXBsYXRlRXhwYW5zaW9uV2FybmluZ3MoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlRXhwYW5zaW9uV2FybmluZ3M7XHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FkYXB0aXZlX2V4cHJlc3Npb25zX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FkYXB0aXZlY2FyZHMtdGVtcGxhdGluZy50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==