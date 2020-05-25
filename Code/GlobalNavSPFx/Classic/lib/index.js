var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
require('react');
require('react-dom');
require("@dcashpeterson/globalnavcommon");
import { Launcher, HeaderFooterDataService, Header, Footer } from "@dcashpeterson/globalnavcommon";
var bootstrapper = /** @class */ (function () {
    function bootstrapper() {
    }
    bootstrapper.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var header, footer, ribbon, workspace, navUrl, navigationData_1, headerProps, footerProps, navLauncher, footerLauncher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        header = document.createElement("div");
                        footer = document.createElement("div");
                        ribbon = document.getElementById('s4-ribbonrow');
                        workspace = document.getElementById('s4-workspace');
                        if (!workspace) return [3 /*break*/, 2];
                        ribbon.parentElement.insertBefore(header, ribbon);
                        workspace.appendChild(footer);
                        navUrl = 'https://derekcp.sharepoint.com/sites/GlobalNavWithSPFx/Style%20Library/HeaderFooterData.json.txt';
                        // Get the header and footer data and render it
                        return [4 /*yield*/, HeaderFooterDataService.get(navUrl)
                                .then(function (data) {
                                navigationData_1 = data;
                            })];
                    case 1:
                        // Get the header and footer data and render it
                        _a.sent();
                        headerProps = { links: navigationData_1.headerLinks };
                        footerProps = { links: navigationData_1.footerLinks, message: "Copyright 2020 Contoso Electronics" };
                        navLauncher = new Launcher({
                            domElement: header,
                            reactControl: Header,
                            controlProps: headerProps
                        });
                        navLauncher.launch();
                        footerLauncher = new Launcher({
                            domElement: footer,
                            reactControl: Footer,
                            controlProps: footerProps
                        });
                        footerLauncher.launch();
                        return [3 /*break*/, 3];
                    case 2:
                        // The element we want to attach to is missing
                        console.log('Error in CustomHeaderFooterApplicationCustomizer: Unable to find element to attach header and footer');
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    return bootstrapper;
}());
export { bootstrapper };
// In-line code starts here
window.ExecuteOrDelayUntilBodyLoaded(function () {
    if (window.location.search.indexOf('IsDlg=1') < 0) {
        var b = new bootstrapper();
        b.onInit();
    }
});
