"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const node_core_library_1 = require("@rushstack/node-core-library");
const xml = require("xml");
const TestResults = require("jest-nunit-reporter/src/Testresults");
const reporters_1 = require("@jest/reporters");
/**
 * Jest logs message to stderr. This class is to override that behavior so that
 * rush does not get confused.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class JestReporter extends reporters_1.DefaultReporter {
    constructor(globalConfig, options) {
        super(globalConfig);
        this._options = options;
    }
    log(message) {
        process.stdout.write(message + '\n');
    }
    onRunComplete(contexts, results) {
        super.onRunComplete(contexts, results);
        if (!this._options || !this._options.writeNUnitResults) {
            return;
        }
        const outputFilePath = this._options.outputFilePath;
        if (!outputFilePath) {
            throw new Error('Jest NUnit output was enabled but no outputFilePath was provided');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testResults = new TestResults(results);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = xml(testResults, { declaration: true, indent: '  ' });
        node_core_library_1.FileSystem.writeFile(outputFilePath, data, { ensureFolderExists: true });
    }
}
module.exports = JestReporter;
//# sourceMappingURL=JestReporter.js.map