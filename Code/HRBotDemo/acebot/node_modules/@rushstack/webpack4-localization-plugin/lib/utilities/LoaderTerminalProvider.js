"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderTerminalProvider = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
class LoaderTerminalProvider {
    static getTerminalProviderForLoader(loaderContext) {
        return {
            supportsColor: false,
            eolCharacter: '\n',
            write: (data, severity) => {
                switch (severity) {
                    case node_core_library_1.TerminalProviderSeverity.error: {
                        loaderContext.emitError(new Error(data));
                        break;
                    }
                    case node_core_library_1.TerminalProviderSeverity.warning: {
                        loaderContext.emitWarning(new Error(data));
                        break;
                    }
                }
            }
        };
    }
}
exports.LoaderTerminalProvider = LoaderTerminalProvider;
//# sourceMappingURL=LoaderTerminalProvider.js.map