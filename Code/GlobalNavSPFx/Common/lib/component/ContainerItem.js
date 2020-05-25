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
import * as React from "react";
//Include CSS in bundle
import './Lib2Styles.css';
var ContainerItemState = /** @class */ (function () {
    function ContainerItemState() {
    }
    return ContainerItemState;
}());
export { ContainerItemState };
var ContainerItem = /** @class */ (function (_super) {
    __extends(ContainerItem, _super);
    function ContainerItem(props) {
        var _this = _super.call(this, props) || this;
        _this.LOG_SOURCE = "ContainerItem";
        _this.onClick = function () {
            window.open(_this.props.item.url, "_blank");
        };
        _this.state = new ContainerItemState();
        return _this;
    }
    ContainerItem.prototype.render = function () {
        try {
            return (React.createElement("div", { "data-component": this.LOG_SOURCE, className: "lib2" },
                React.createElement("h2", null, this.props.item.title),
                React.createElement("div", null, this.props.item.description),
                React.createElement("div", { className: "launch" },
                    React.createElement("button", { onClick: this.onClick }, "Launch"))));
        }
        catch (err) {
            console.error(err + " - " + this.LOG_SOURCE + " (render)");
            return null;
        }
    };
    return ContainerItem;
}(React.Component));
export default ContainerItem;
