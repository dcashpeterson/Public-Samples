define("8fa6dc79-0953-468a-a6b9-34942cae4f6d_0.0.1", ["AcebotAdaptiveCardExtensionStrings","@microsoft/sp-loader","@microsoft/sp-adaptive-card-extension-base"], function(__WEBPACK_EXTERNAL_MODULE__1ay0__, __WEBPACK_EXTERNAL_MODULE_I6O9__, __WEBPACK_EXTERNAL_MODULE_lz_E__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// Returns a list of SPFx components used in a given chunk but not used in the runtime chunk
/******/ 	function getAsyncSpfxComponents(chunkId) {
/******/ 		var component_0 = { // @microsoft/sp-property-pane
/******/ 			i: "f9e737b7-f0df-4597-ba8c-3060f82380db",
/******/ 			v: "1.18.2",
/******/ 			m: "26ea"
/******/ 		};
/******/
/******/ 		return {"Acebot-property-pane": [component_0]}[chunkId] || [];
/******/ 	}
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"acebot-adaptive-card-extension": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "chunk." + ({"Acebot-property-pane":"Acebot-property-pane"}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/ 		// SPFx Component async loading
/******/
/******/ 		var chunkAsyncComponents = getAsyncSpfxComponents(chunkId);
/******/ 		for (var i = 0; i < chunkAsyncComponents.length; i++) {
/******/ 			// Has the component already been loaded into the modules object?
/******/ 			if (!modules[chunkAsyncComponents[i].m]) {
/******/ 				(function (chunkComponent){
/******/ 					promises.push(spfxLoader.SPComponentLoader.loadComponentById(
/******/ 						chunkComponent.i,
/******/ 						chunkComponent.v
/******/ 					).then(function (component) {
/******/ 						modules[chunkComponent.m] = function(module) {
/******/ 							module.exports = component;
/******/ 						};
/******/ 					}));
/******/ 				})(chunkAsyncComponents[i]);
/******/ 			}
/******/ 		}
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/ 				if (script.src.indexOf(window.location.origin + '/') !== 0) {
/******/ 					script.crossOrigin = "anonymous";
/******/ 				}
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var spfxLoader = __webpack_require__("I6O9");
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp_8fa6dc79_0953_468a_a6b9_34942cae4f6d_0_0_1"] = window["webpackJsonp_8fa6dc79_0953_468a_a6b9_34942cae4f6d_0_0_1"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Set the webpack public path
/******/ 	(function () {
/******/ 	  var scripts = document.getElementsByTagName('script');
/******/ 	  var regex = /acebot\-adaptive\-card\-extension\.js/i;
/******/ 	  var publicPath;
/******/
/******/ 	  if (scripts && scripts.length) {
/******/ 	    for (var i = 0; i < scripts.length; i++) {
/******/ 	      if (!scripts[i]) continue;
/******/ 	      var path = scripts[i].getAttribute('src');
/******/ 	      if (path && path.match(regex)) {
/******/ 	        publicPath = path.substring(0, path.lastIndexOf('/') + 1);
/******/ 	        break;
/******/ 	      }
/******/ 	    }
/******/ 	  }
/******/
/******/ 	  if (!publicPath) {
/******/ 	    for (var global in window.__setWebpackPublicPathLoaderSrcRegistry__) {
/******/ 	      if (global && global.match(regex)) {
/******/ 	        publicPath = global.substring(0, global.lastIndexOf('/') + 1);
/******/ 	        break;
/******/ 	      }
/******/ 	    }
/******/ 	  }
/******/ 	  __webpack_require__.p = publicPath;
/******/ 	})();
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "2jV8");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1ay0":
/*!*****************************************************!*\
  !*** external "AcebotAdaptiveCardExtensionStrings" ***!
  \*****************************************************/
/*! no static exports found */
/*! exports used: PrimaryText, PropertyPaneDescription, SubTitle, Title, TitleFieldLabel */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1ay0__;

/***/ }),

/***/ "2jV8":
/*!**************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/acebot/AcebotAdaptiveCardExtension.js ***!
  \**************************************************************************/
/*! exports provided: QUICK_VIEW_REGISTRY_ID, default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QUICK_VIEW_REGISTRY_ID", function() { return QUICK_VIEW_REGISTRY_ID; });
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-adaptive-card-extension-base */ "lz/E");
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _cardView_CardView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cardView/CardView */ "fAgO");
/* harmony import */ var _quickView_QuickView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./quickView/QuickView */ "XbIM");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var CARD_VIEW_REGISTRY_ID = 'Acebot_CARD_VIEW';
var QUICK_VIEW_REGISTRY_ID = 'Acebot_QUICK_VIEW';
var AcebotAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(AcebotAdaptiveCardExtension, _super);
    function AcebotAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AcebotAdaptiveCardExtension.prototype.onInit = function () {
        this.state = {};
        // registers the card view to be shown in a dashboard
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new _cardView_CardView__WEBPACK_IMPORTED_MODULE_1__[/* CardView */ "e"](); });
        // registers the quick view to open via QuickView action
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new _quickView_QuickView__WEBPACK_IMPORTED_MODULE_2__[/* QuickView */ "e"](); });
        return Promise.resolve();
    };
    AcebotAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return __webpack_require__.e(/*! import() | Acebot-property-pane */ "Acebot-property-pane").then(__webpack_require__.bind(null, /*! ./AcebotPropertyPane */ "74GW"))
            .then(function (component) {
            _this._deferredPropertyPane = new component.AcebotPropertyPane();
        });
    };
    AcebotAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    AcebotAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return AcebotAdaptiveCardExtension;
}(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__["BaseAdaptiveCardExtension"]));
/* harmony default export */ __webpack_exports__["default"] = (AcebotAdaptiveCardExtension);


/***/ }),

/***/ "FvnM":
/*!*************************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/acebot/quickView/template/QuickViewTemplate.json ***!
  \*************************************************************************************/
/*! exports provided: schema, type, version, body, default */
/*! all exports used */
/***/ (function(module) {

module.exports = JSON.parse("{\"schema\":\"http://adaptivecards.io/schemas/adaptive-card.json\",\"type\":\"AdaptiveCard\",\"version\":\"1.5\",\"body\":[{\"type\":\"TextBlock\",\"weight\":\"Bolder\",\"text\":\"${title}\"},{\"type\":\"ColumnSet\",\"columns\":[{\"type\":\"Column\",\"items\":[{\"type\":\"TextBlock\",\"weight\":\"Bolder\",\"text\":\"${subTitle}\",\"wrap\":true}]}]}]}");

/***/ }),

/***/ "I6O9":
/*!***************************************!*\
  !*** external "@microsoft/sp-loader" ***!
  \***************************************/
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_I6O9__;

/***/ }),

/***/ "XbIM":
/*!******************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/acebot/quickView/QuickView.js ***!
  \******************************************************************/
/*! exports provided: QuickView */
/*! exports used: QuickView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return QuickView; });
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-adaptive-card-extension-base */ "lz/E");
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! AcebotAdaptiveCardExtensionStrings */ "1ay0");
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var QuickView = /** @class */ (function (_super) {
    __extends(QuickView, _super);
    function QuickView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(QuickView.prototype, "data", {
        get: function () {
            return {
                subTitle: AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["SubTitle"],
                title: AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["Title"]
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuickView.prototype, "template", {
        get: function () {
            return __webpack_require__(/*! ./template/QuickViewTemplate.json */ "FvnM");
        },
        enumerable: false,
        configurable: true
    });
    return QuickView;
}(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__["BaseAdaptiveCardQuickView"]));



/***/ }),

/***/ "fAgO":
/*!****************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/acebot/cardView/CardView.js ***!
  \****************************************************************/
/*! exports provided: CardView */
/*! exports used: CardView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return CardView; });
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-adaptive-card-extension-base */ "lz/E");
/* harmony import */ var _microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! AcebotAdaptiveCardExtensionStrings */ "1ay0");
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


//import { Guid } from '@microsoft/sp-core-library';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardViewParameters", {
        get: function () {
            return Object(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__["BasicCardView"])({
                cardBar: {
                    componentName: 'cardBar',
                    title: this.properties.title
                },
                header: {
                    componentName: 'text',
                    text: AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PrimaryText"]
                },
                footer: {
                    componentName: 'textInput',
                    id: 'chatMessage',
                    placeholder: "Enter your question",
                    button: {
                        icon: {
                            url: 'Send'
                        },
                        action: {
                            type: 'Submit',
                            parameters: {
                                id: 'chatMessage'
                            }
                        }
                    }
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    CardView.prototype.onAction = function (action) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var fetch_1, convResponse, conversation, chatMessage, msgResponse, message, actResponse, activity;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(action.type === 'Submit' && ((_a = action.data) === null || _a === void 0 ? void 0 : _a.id) === 'chatMessage')) return [3 /*break*/, 7];
                        fetch_1 = __webpack_require__(/*! node-fetch */ "oY9k");
                        return [4 /*yield*/, fetch_1('https://directline.botframework.com/v3/directline/conversations', {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI'
                                }
                            })];
                    case 1:
                        convResponse = _c.sent();
                        return [4 /*yield*/, convResponse.json()];
                    case 2:
                        conversation = _c.sent();
                        console.log(conversation);
                        chatMessage = {
                            "locale": "en-EN",
                            "type": "message",
                            "from": {
                                "id": "joe"
                            },
                            "text": (_b = action.data) === null || _b === void 0 ? void 0 : _b.chatMessage
                        };
                        return [4 /*yield*/, fetch_1("https://directline.botframework.com/v3/directline/conversations/".concat(conversation === null || conversation === void 0 ? void 0 : conversation.conversationId, "/activities"), {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(chatMessage)
                            })];
                    case 3:
                        msgResponse = _c.sent();
                        return [4 /*yield*/, msgResponse.json()];
                    case 4:
                        message = _c.sent();
                        console.log(message);
                        return [4 /*yield*/, fetch_1("https://directline.botframework.com/v3/directline/conversations/".concat(conversation === null || conversation === void 0 ? void 0 : conversation.conversationId, "/activities"), {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer gvswrMwuCUU.TNehwSLlV9EgVOuwwoSUbIxvohs1BBpjdPDhoVgwEhI',
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 5:
                        actResponse = _c.sent();
                        return [4 /*yield*/, actResponse.json()];
                    case 6:
                        activity = _c.sent();
                        console.log(activity);
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return CardView;
}(_microsoft_sp_adaptive_card_extension_base__WEBPACK_IMPORTED_MODULE_0__["BaseComponentsCardView"]));



/***/ }),

/***/ "lz/E":
/*!*************************************************************!*\
  !*** external "@microsoft/sp-adaptive-card-extension-base" ***!
  \*************************************************************/
/*! no static exports found */
/*! exports used: BaseAdaptiveCardExtension, BaseAdaptiveCardQuickView, BaseComponentsCardView, BasicCardView */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lz_E__;

/***/ }),

/***/ "oY9k":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;

/***/ })

/******/ })});;
//# sourceMappingURL=acebot-adaptive-card-extension.js.map