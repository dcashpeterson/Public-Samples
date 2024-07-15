"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanFlagTask = void 0;
const CleanTask_1 = require("./CleanTask");
/**
 * This task runs at the start of any command if the --clean or -c parameter is specified
 * @public
 */
class CleanFlagTask extends CleanTask_1.CleanTask {
    constructor() {
        super();
        /** Instantiates a new CleanTask with the name 'clean' */
        this._hasRun = false;
    }
    isEnabled(buildConfig) {
        const shouldRun = 
        // eslint-disable-next-line dot-notation
        (!!buildConfig.args['clean'] || !!buildConfig.args['c']) && this._hasRun === false;
        return shouldRun;
    }
    executeTask(gulp, completeCallback) {
        super.executeTask(gulp, () => {
            this._hasRun = true;
            completeCallback();
        });
    }
}
exports.CleanFlagTask = CleanFlagTask;
//# sourceMappingURL=CleanFlagTask.js.map