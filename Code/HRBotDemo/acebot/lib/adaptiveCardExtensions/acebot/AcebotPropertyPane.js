import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'AcebotAdaptiveCardExtensionStrings';
var AcebotPropertyPane = /** @class */ (function () {
    function AcebotPropertyPane() {
    }
    AcebotPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
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
export { AcebotPropertyPane };
//# sourceMappingURL=AcebotPropertyPane.js.map