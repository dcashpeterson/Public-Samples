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
import * as React from 'react';
import './HeaderFooter.module.scss';
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header(props) {
        return _super.call(this, props) || this;
    }
    Header.prototype.render = function () {
        return (React.createElement("div", { className: "topNav" },
            React.createElement("label", { htmlFor: "show-menu", className: "show-menu" },
                React.createElement("div", { className: "show-menu" },
                    React.createElement("div", { className: "hamburger" },
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)))),
            React.createElement("input", { type: "checkbox", id: "show-menu", role: "button" }),
            React.createElement("ul", null, this.props.links.map(function (l) { return (React.createElement("li", { key: l.name },
                React.createElement("a", { href: l.url }, l.name),
                React.createElement("ul", { className: "hidden" }, l.children ? l.children.map(function (m) { return (React.createElement("li", { key: m.name },
                    React.createElement("a", { href: m.url }, m.name))); }) : null))); }))));
    };
    return Header;
}(React.Component));
export default Header;
