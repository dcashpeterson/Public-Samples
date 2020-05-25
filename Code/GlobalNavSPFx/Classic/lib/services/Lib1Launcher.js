import React from "react";
import ReactDOM from "react-dom";
//Include CSS in bundle
import '../component/Lib1Styles.css';
import { Header } from "@dcashpeterson/globalnavcommon";
var Lib1Launcher = /** @class */ (function () {
    function Lib1Launcher(props) {
        console.log("Lib1Launcher constructor");
        try {
            this.domElementHeader = props.domElement;
            this.items = props.items;
        }
        catch (err) {
            console.error("Lib1Launcher (constructor) " + err);
        }
    }
    Lib1Launcher.prototype.launch = function () {
        console.log("Lib1Launcher launch");
        this.renderHeader();
    };
    Lib1Launcher.prototype.renderHeader = function () {
        console.log("Lib1Launcher render");
        try {
            var containerElement = document.createElement("DIV");
            this.domElementHeader.appendChild(containerElement);
            var header = React.createElement("h2", null, "My list of items");
            var props = { links: this.items };
            var container = React.createElement(Header, props, null);
            var elements = [header, container];
            //render
            ReactDOM.render(elements, containerElement);
            console.log("Lib1Launcher render complete");
        }
        catch (err) {
            console.error("Lib1Launcher (renderHeader) " + err);
        }
    };
    return Lib1Launcher;
}());
export { Lib1Launcher };
