"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDeletionUtility = void 0;
const path = require("path");
const globEscape = require("glob-escape");
const globby = require("globby");
// eslint-disable-next-line
const del = require('del');
class FileDeletionUtility {
    static deletePatterns(patterns) {
        const files = globby.sync(patterns);
        this.deleteFiles(files);
    }
    static deleteFiles(files) {
        del.sync(this.escapeFilePaths(this.removeChildren(files)));
    }
    static escapeFilePaths(files) {
        return files.map((file) => {
            return globEscape(file);
        });
    }
    static removeChildren(filenames) {
        // Appears to be a known issue with `del` whereby
        // if you ask to delete both a folder, and something in the folder,
        // it randomly chooses which one to delete first, which can cause
        // the function to fail sporadically. The fix for this is simple:
        // we need to remove any cleanPaths which exist under a folder we
        // are attempting to delete
        // First we sort the list of files. We know that if something is a file,
        // if matched, the parent folder should appear earlier in the list
        filenames.sort();
        // We need to determine which paths exist under other paths, and remove them from the
        // list of files to delete
        const filesToDelete = [];
        // current working directory
        let currentParent = undefined;
        for (let i = 0; i < filenames.length; i++) {
            const curFile = filenames[i];
            if (this.isParentDirectory(currentParent, curFile)) {
                continue;
            }
            else {
                filesToDelete.push(curFile);
                currentParent = curFile;
            }
        }
        return filesToDelete;
    }
    static isParentDirectory(directory, filePath) {
        if (!directory || !filePath) {
            return false;
        }
        const directoryParts = path.resolve(directory).split(path.sep);
        const fileParts = path.resolve(filePath).split(path.sep);
        if (directoryParts[directoryParts.length - 1] === '') {
            // this is to fix an issue with windows roots
            directoryParts.pop();
        }
        if (directoryParts.length >= fileParts.length) {
            return false;
        }
        for (let i = 0; i < directoryParts.length; i++) {
            if (directoryParts[i] !== fileParts[i]) {
                return false;
            }
        }
        return true;
    }
}
exports.FileDeletionUtility = FileDeletionUtility;
//# sourceMappingURL=FileDeletionUtility.js.map