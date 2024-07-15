"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JestTask = exports._isJestEnabled = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const path = require("path");
const GulpTask_1 = require("./GulpTask");
const glob = require("glob");
// runCLI is not exported from 'jest' anymore.
// See https://github.com/facebook/jest/issues/9512#issuecomment-581835474
const { runCLI } = require('@jest/core');
const node_core_library_1 = require("@rushstack/node-core-library");
const DEFAULT_JEST_CONFIG_FILE_NAME = 'jest.config.json';
/**
 * Indicates if jest is enabled
 * @internal
 * @param rootFolder - package root folder
 */
function _isJestEnabled(rootFolder) {
    const taskConfigFile = path.join(rootFolder, 'config', 'jest.json');
    if (!node_core_library_1.FileSystem.exists(taskConfigFile)) {
        return false;
    }
    const taskConfig = require(taskConfigFile);
    // eslint-disable-next-line dot-notation
    return !!taskConfig['isEnabled'];
}
exports._isJestEnabled = _isJestEnabled;
/**
 * This task takes in a map of dest: [sources], and copies items from one place to another.
 * @alpha
 */
class JestTask extends GulpTask_1.GulpTask {
    constructor() {
        super('jest', {
            cache: true,
            collectCoverageFrom: ['lib/**/*.js?(x)', '!lib/**/test/**'],
            coverage: true,
            coverageReporters: ['json' /*, 'html' */],
            testPathIgnorePatterns: ['<rootDir>/(src|lib-amd|lib-es6|coverage|build|docs|node_modules)/'],
            // Some unit tests rely on data folders that look like packages.  This confuses jest-hast-map
            // when it tries to scan for package.json files.
            modulePathIgnorePatterns: ['<rootDir>/(src|lib)/.*/package.json']
        });
    }
    isEnabled(buildConfig) {
        return super.isEnabled(buildConfig) && !!this.taskConfig.isEnabled;
    }
    /**
     * Loads the z-schema object for this task
     */
    loadSchema() {
        return require('./jest.schema.json');
    }
    executeTask(gulp, completeCallback) {
        const configFileFullPath = path.join(this.buildConfig.rootPath, 'config', 'jest', DEFAULT_JEST_CONFIG_FILE_NAME);
        this._copySnapshots(this.buildConfig.srcFolder, this.buildConfig.libFolder);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jestConfig = {
            ci: this.buildConfig.production,
            cache: !!this.taskConfig.cache,
            config: node_core_library_1.FileSystem.exists(configFileFullPath) ? configFileFullPath : undefined,
            collectCoverageFrom: this.taskConfig.collectCoverageFrom,
            coverage: this.taskConfig.coverage,
            coverageReporters: this.taskConfig.coverageReporters,
            coverageDirectory: path.join(this.buildConfig.tempFolder, 'coverage'),
            maxWorkers: this.taskConfig.maxWorkers ? this.taskConfig.maxWorkers : 1,
            moduleDirectories: this.taskConfig.moduleDirectories
                ? this.taskConfig.moduleDirectories
                : ['node_modules', this.buildConfig.libFolder],
            reporters: [
                [
                    path.join(__dirname, 'JestReporter.js'),
                    {
                        outputFilePath: path.join(this.buildConfig.tempFolder, 'jest-results', 'test-results.xml'),
                        writeNUnitResults: this.taskConfig.writeNUnitResults
                    }
                ]
            ],
            rootDir: this.buildConfig.rootPath,
            testMatch: this.taskConfig.testMatch ? this.taskConfig.testMatch : ['**/*.test.js?(x)'],
            testPathIgnorePatterns: this.taskConfig.testPathIgnorePatterns,
            modulePathIgnorePatterns: this.taskConfig.modulePathIgnorePatterns,
            updateSnapshot: !this.buildConfig.production,
            // Jest's module resolution for finding jest-environment-jsdom is broken.  See this issue:
            // https://github.com/facebook/jest/issues/5913
            // As a workaround, resolve it for Jest:
            testEnvironment: require.resolve('jest-environment-jsdom'),
            cacheDirectory: path.join(this.buildConfig.rootPath, this.buildConfig.tempFolder, 'jest-cache')
        };
        // suppress 'Running coverage on untested files...' warning
        const oldTTY = process.stdout.isTTY;
        process.stdout.isTTY = undefined;
        runCLI(jestConfig, [this.buildConfig.rootPath])
            .then((result) => {
            process.stdout.isTTY = oldTTY;
            if (!result.results.success) {
                completeCallback(new Error('Jest tests or coverage failed'));
            }
            else {
                if (!this.buildConfig.production) {
                    this._copySnapshots(this.buildConfig.libFolder, this.buildConfig.srcFolder);
                }
                completeCallback();
            }
        })
            .catch((err) => {
            process.stdout.isTTY = oldTTY;
            completeCallback(err);
        });
    }
    _copySnapshots(srcRoot, destRoot) {
        const pattern = path.join(srcRoot, '**', '__snapshots__', '*.snap');
        glob.sync(pattern).forEach((snapFile) => {
            const destination = snapFile.replace(srcRoot, destRoot);
            if (this._copyIfMatchExtension(snapFile, destination, '.test.tsx.snap')) {
                this.logVerbose(`Snapshot file ${snapFile} is copied to match extension ".test.tsx.snap".`);
            }
            else if (this._copyIfMatchExtension(snapFile, destination, '.test.ts.snap')) {
                this.logVerbose(`Snapshot file ${snapFile} is copied to match extension ".test.ts.snap".`);
            }
            else if (this._copyIfMatchExtension(snapFile, destination, '.test.jsx.snap')) {
                this.logVerbose(`Snapshot file ${snapFile} is copied to match extension ".test.jsx.snap".`);
            }
            else if (this._copyIfMatchExtension(snapFile, destination, '.test.js.snap')) {
                this.logVerbose(`Snapshot file ${snapFile} is copied to match extension ".test.js.snap".`);
            }
            else {
                this.logWarning(`Snapshot file ${snapFile} is not copied because don't find that matching test file.`);
            }
        });
    }
    _copyIfMatchExtension(snapSourceFile, destinationFile, extension) {
        const snapDestFile = destinationFile.replace(/\.test\..+\.snap$/, extension);
        const testFileName = path.basename(snapDestFile, '.snap');
        const testFile = path.resolve(path.dirname(snapDestFile), '..', testFileName); // Up from `__snapshots__`.
        if (node_core_library_1.FileSystem.exists(testFile)) {
            node_core_library_1.FileSystem.copyFile({
                sourcePath: snapSourceFile,
                destinationPath: snapDestFile
            });
            return true;
        }
        else {
            return false;
        }
    }
}
exports.JestTask = JestTask;
//# sourceMappingURL=JestTask.js.map