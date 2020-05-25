import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { languageManager } from '../../languageManager';
var ComponentManager = /** @class */ (function () {
    function ComponentManager() {
    }
    ComponentManager.render = function (headerDomElement, footerDomElement, data) {
        var strings = languageManager.GetStrings();
        // If there is a header DOM element, make the react element and render it
        if (headerDomElement) {
            var reactElt = React.createElement(Header, {
                links: data.headerLinks
            });
            ReactDOM.render(reactElt, headerDomElement);
        }
        // If there is a footer DOM element, make the react element and render it
        if (footerDomElement) {
            var reactElt = React.createElement(Footer, {
                message: strings.FooterMessage,
                links: data.footerLinks
            });
            ReactDOM.render(reactElt, footerDomElement);
        }
    };
    return ComponentManager;
}());
export default ComponentManager;
