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
require('react');
require('react-dom');
require("@dcashpeterson/globalnavcommon");
import { ContainerItem } from "@dcashpeterson/globalnavcommon";
var ContainerState = /** @class */ (function () {
    function ContainerState() {
    }
    return ContainerState;
}());
export { ContainerState };
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(props) {
        var _this = _super.call(this, props) || this;
        _this.LOG_SOURCE = "Container";
        _this.state = new ContainerState();
        return _this;
    }
    Container.prototype.render = function () {
        try {
            return (React.createElement("div", { "data-component": this.LOG_SOURCE, className: "lib1" }, this.props.items && this.props.items.length > 0 && this.props.items.map(function (i, idx) {
                return (React.createElement(ContainerItem, { key: idx, item: i }));
            })));
        }
        catch (err) {
            console.error(err + " - " + this.LOG_SOURCE + " (render)");
            return null;
        }
    };
    return Container;
}(React.Component));
export default Container;
