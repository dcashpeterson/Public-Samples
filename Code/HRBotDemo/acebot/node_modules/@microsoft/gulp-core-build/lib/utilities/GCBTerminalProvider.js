"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCBTerminalProvider = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
/**
 * @public
 */
class GCBTerminalProvider extends node_core_library_1.ConsoleTerminalProvider {
    constructor(gcbTask) {
        super({ verboseEnabled: true });
        this._gcbTask = gcbTask;
    }
    write(data, severity) {
        data = data.replace(/\r?\n$/, ''); // Trim trailing newlines because the GCB log functions include a newline
        switch (severity) {
            case node_core_library_1.TerminalProviderSeverity.warning: {
                this._gcbTask.logWarning(data);
                break;
            }
            case node_core_library_1.TerminalProviderSeverity.error: {
                this._gcbTask.logError(data);
                break;
            }
            case node_core_library_1.TerminalProviderSeverity.verbose: {
                this._gcbTask.logVerbose(data);
                break;
            }
            case node_core_library_1.TerminalProviderSeverity.log:
            default: {
                this._gcbTask.log(data);
                break;
            }
        }
    }
}
exports.GCBTerminalProvider = GCBTerminalProvider;
//# sourceMappingURL=GCBTerminalProvider.js.map