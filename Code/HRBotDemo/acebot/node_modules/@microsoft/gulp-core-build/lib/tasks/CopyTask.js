"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyTask = void 0;
const GulpTask_1 = require("./GulpTask");
/**
 * This task takes in a map of dest: [sources], and copies items from one place to another.
 * @public
 */
class CopyTask extends GulpTask_1.GulpTask {
    /**
     * Instantiates a CopyTask with an empty configuration
     */
    constructor() {
        super('copy', {
            copyTo: {},
            shouldFlatten: true
        });
    }
    /**
     * Loads the z-schema object for this task
     */
    loadSchema() {
        return require('./copy.schema.json');
    }
    /**
     * Executes the copy task, which copy files based on the task's Configuration
     */
    executeTask(gulp, completeCallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        /* eslint-disable */
        const flatten = require('gulp-flatten');
        const gulpif = require('gulp-if');
        const merge = require('merge2');
        /* eslint-enable */
        const { copyTo, shouldFlatten } = this.taskConfig;
        const allStreams = [];
        for (const copyDest in copyTo) {
            if (copyTo.hasOwnProperty(copyDest)) {
                const sources = copyTo[copyDest];
                sources.forEach((sourceMatch) => allStreams.push(gulp
                    .src(sourceMatch, { allowEmpty: true })
                    .pipe(gulpif(shouldFlatten, flatten()))
                    .pipe(gulp.dest(copyDest))));
            }
        }
        if (allStreams.length === 0) {
            completeCallback();
        }
        else {
            return merge(allStreams);
        }
    }
}
exports.CopyTask = CopyTask;
//# sourceMappingURL=CopyTask.js.map