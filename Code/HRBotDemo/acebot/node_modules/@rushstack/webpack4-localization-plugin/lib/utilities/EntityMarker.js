"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMarker = void 0;
const LABEL = Symbol('loc-plugin-marked');
/**
 * Use the functions on this class to mark webpack entities that contain localized resources.
 */
class EntityMarker {
    static markEntity(module, value) {
        module[LABEL] = value;
    }
    static getMark(module) {
        return module[LABEL];
    }
}
exports.EntityMarker = EntityMarker;
//# sourceMappingURL=EntityMarker.js.map