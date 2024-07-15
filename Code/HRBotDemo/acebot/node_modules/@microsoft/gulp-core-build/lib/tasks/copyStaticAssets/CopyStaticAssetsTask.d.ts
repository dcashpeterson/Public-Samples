/// <reference types="node" />
import * as Gulp from 'gulp';
import { GulpTask } from '../GulpTask';
import { JsonObject } from '@rushstack/node-core-library';
/**
 * Configuration for CopyStaticAssetsTask
 * @public
 */
export interface ICopyStaticAssetsTaskConfig {
    includeExtensions?: string[];
    excludeExtensions?: string[];
    includeFiles?: string[];
    excludeFiles?: string[];
}
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
export declare class CopyStaticAssetsTask extends GulpTask<ICopyStaticAssetsTaskConfig> {
    constructor();
    loadSchema(): JsonObject;
    executeTask(gulp: typeof Gulp, completeCallback: (error?: string) => void): NodeJS.ReadWriteStream;
}
//# sourceMappingURL=CopyStaticAssetsTask.d.ts.map