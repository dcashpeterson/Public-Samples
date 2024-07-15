var __extends = (this && this.__extends) || (function () {
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
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
var CARD_VIEW_REGISTRY_ID = 'Acebot_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'Acebot_QUICK_VIEW';
var AcebotAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(AcebotAdaptiveCardExtension, _super);
    function AcebotAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AcebotAdaptiveCardExtension.prototype.onInit = function () {
        this.state = {};
        // registers the card view to be shown in a dashboard
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        // registers the quick view to open via QuickView action
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        return Promise.resolve();
    };
    AcebotAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'Acebot-property-pane'*/
        './AcebotPropertyPane')
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
}(BaseAdaptiveCardExtension));
export default AcebotAdaptiveCardExtension;
//# sourceMappingURL=AcebotAdaptiveCardExtension.js.map