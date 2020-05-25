import React from "react";
import ReactDOM from "react-dom";
var Launcher = /** @class */ (function () {
    function Launcher(props) {
        console.log("Launcher constructor");
        try {
            this.domElementHeader = props.domElement;
            this.reactControl = props.reactControl;
            this.controlProps = props.controlProps;
        }
        catch (err) {
            console.error("Launcher (constructor) " + err);
        }
    }
    Launcher.prototype.launch = function () {
        console.log("Launcher launch");
        this.renderHeader();
    };
    Launcher.prototype.renderHeader = function () {
        console.log("Launcher render");
        try {
            var container = React.createElement(this.reactControl, this.controlProps, null);
            //render
            ReactDOM.render(container, this.domElementHeader);
            console.log("Launcher render complete");
        }
        catch (err) {
            console.error("Launcher (renderHeader) " + err);
        }
    };
    return Launcher;
}());
export { Launcher };
