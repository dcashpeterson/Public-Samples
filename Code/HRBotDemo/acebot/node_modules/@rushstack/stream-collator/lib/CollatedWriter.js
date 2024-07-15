"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollatedWriter = void 0;
const terminal_1 = require("@rushstack/terminal");
const CollatedTerminal_1 = require("./CollatedTerminal");
/**
 * An writable interface for managing output of simultaneous processes.
 *
 * @beta
 */
class CollatedWriter extends terminal_1.TerminalWritable {
    constructor(taskName, collator) {
        super({ preventAutoclose: true });
        this.taskName = taskName;
        this.terminal = new CollatedTerminal_1.CollatedTerminal(this);
        this._collator = collator;
        this._bufferedChunks = [];
    }
    /**
     * Returns true if this is the active writer for its associated {@link StreamCollator}.
     */
    get isActive() {
        return this._collator.activeWriter === this;
    }
    /**
     * For diagnostic purposes, if the writer is buffering chunks because it has
     * not become active yet, they can be inspected via this property.
     */
    get bufferedChunks() {
        return this._bufferedChunks;
    }
    /** {@inheritDoc @rushstack/terminal#TerminalWritable.onWriteChunk} */
    onWriteChunk(chunk) {
        this._collator._writerWriteChunk(this, chunk, this._bufferedChunks);
    }
    /** {@inheritDoc @rushstack/terminal#TerminalWritable.onClose} */
    onClose() {
        this._collator._writerClose(this, this._bufferedChunks);
    }
    /** @internal */
    _flushBufferedChunks() {
        for (const chunk of this._bufferedChunks) {
            this._collator.destination.writeChunk(chunk);
        }
        this._bufferedChunks.length = 0;
    }
}
exports.CollatedWriter = CollatedWriter;
//# sourceMappingURL=CollatedWriter.js.map