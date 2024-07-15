"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyStaticAssetsTask = void 0;
const path = require("path");
const globEscape = require("glob-escape");
const GulpTask_1 = require("../GulpTask");
/**
 * Copies files from the /src folder into the /lib folder, if they have certain file extensions
 * or file paths.
 *
 * @privateRemarks
 *
 * Example:
 * ```
 *  IN:
 *    setConfig({
 *      includeExtensions: ['template.html'],
 *      excludeExtensions: ['png'],
 *      includeFiles: ['/assets/goodAsset.png'],
 *      excludeFiles: ['/assets/badAsset.gif']
 *    })
 *
 *  OUT:
 *    copies all files that match our standard webpack file-loader extensions
 *      ('jpg', 'png', 'woff', 'eot', 'ttf', 'svg', 'gif'), with the following extensions, in the following order of
 *    precedence (from lowest to highest):
 *      1. including additional extensions (i.e. 'template.html')
 *      2. excluding specific extensions (i.e. 'png')
 *      3. including specific globs (i.e. '/assets/goodAsset.png')
 *      4. excluding specific globs (i.e. '/assets/badAsset.gif')
 * ```
 * @public
 */
class CopyStaticAssetsTask extends GulpTask_1.GulpTask {
    constructor() {
        super('copy-static-assets', {
            includeExtensions: [],
            excludeExtensions: [],
            includeFiles: [],
            excludeFiles: []
        });
    }
    loadSchema() {
        return require('./copy-static-assets.schema.json');
    }
    executeTask(gulp, completeCallback) {
        const rootPath = path.join(this.buildConfig.rootPath, this.buildConfig.srcFolder || 'src');
        const libPath = path.join(this.buildConfig.rootPath, this.buildConfig.libFolder || 'lib');
        const globPatterns = [];
        const allExtensions = (this.taskConfig.includeExtensions || []).concat([
            'json',
            'html',
            'css',
            'md'
        ]);
        for (let ext of allExtensions) {
            if (this.taskConfig.excludeExtensions) {
                if (this.taskConfig.excludeExtensions.indexOf(ext) !== -1) {
                    break; // Skipping this extension. It's been excluded
                }
            }
            if (!ext.match(/^\./)) {
                ext = `.${ext}`;
            }
            globPatterns.push(path.join(rootPath, '**', `*${globEscape(ext)}`));
        }
        for (const file of this.taskConfig.includeFiles || []) {
            if (this.taskConfig.excludeFiles) {
                if (this.taskConfig.excludeFiles.indexOf(file) !== -1) {
                    break; // Skipping this file. It's been excluded
                }
            }
            globPatterns.push(path.join(rootPath, file));
        }
        for (const file of this.taskConfig.excludeFiles || []) {
            globPatterns.push(`!${path.join(rootPath, file)}`);
        }
        return gulp
            .src(globPatterns, { base: rootPath })
            .pipe(gulp.dest(libPath))
            .on('finish', () => completeCallback());
    }
}
exports.CopyStaticAssetsTask = CopyStaticAssetsTask;
//# sourceMappingURL=CopyStaticAssetsTask.js.map