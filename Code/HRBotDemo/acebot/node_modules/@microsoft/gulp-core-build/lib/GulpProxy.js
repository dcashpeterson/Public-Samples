"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GulpProxy = void 0;
const Orchestrator = require("orchestrator");
/**
 * A helper utility for gulp which can be extended to provide additional features to gulp vinyl streams
 */
class GulpProxy extends Orchestrator {
    constructor(gulpInstance) {
        super();
        this.src = gulpInstance.src;
        this.dest = gulpInstance.dest;
        this.watch = gulpInstance.watch;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task() {
        throw new Error('You should not define gulp tasks directly, but instead subclass the GulpTask or call subTask(), and register it to gulp-core-build.');
    }
}
exports.GulpProxy = GulpProxy;
//# sourceMappingURL=GulpProxy.js.map