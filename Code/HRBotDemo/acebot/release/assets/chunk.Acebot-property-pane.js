(window["webpackJsonp_8fa6dc79_0953_468a_a6b9_34942cae4f6d_0_0_1"] = window["webpackJsonp_8fa6dc79_0953_468a_a6b9_34942cae4f6d_0_0_1"] || []).push([["Acebot-property-pane"],{

/***/ "74GW":
/*!*****************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/acebot/AcebotPropertyPane.js ***!
  \*****************************************************************/
/*! exports provided: AcebotPropertyPane */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AcebotPropertyPane", function() { return AcebotPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! AcebotAdaptiveCardExtensionStrings */ "1ay0");
/* harmony import */ var AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var AcebotPropertyPane = /** @class */ (function () {
    function AcebotPropertyPane() {
    }
    AcebotPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: AcebotAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AcebotPropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.Acebot-property-pane.js.map