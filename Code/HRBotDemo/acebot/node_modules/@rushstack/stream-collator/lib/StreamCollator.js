"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamCollator = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
const CollatedWriter_1 = require("./CollatedWriter");
const CollatedTerminal_1 = require("./CollatedTerminal");
/**
 * A static class which manages the output of multiple threads.
 *
 * @beta
 */
class StreamCollator {
    constructor(options) {
        this._taskNames = new Set();
        this._writers = new Set();
        // The writer whose output is being shown in realtime, or undefined if none
        this._activeWriter = undefined;
        // Writers that are not closed yet, and have never been active
        this._openInactiveWriters = new Set();
        // Writers that are now closed, but have accumulated buffered chunks, and have never been active
        this._closedInactiveWriters = new Set();
        this._preventReentrantCall = false;
        this.destination = options.destination;
        this.terminal = new CollatedTerminal_1.CollatedTerminal(this.destination);
        this._onWriterActive = options.onWriterActive;
    }
    /**
     * Returns the currently active `CollatedWriter`, or `undefined` if no writer
     * is active yet.
     */
    get activeWriter() {
        return this._activeWriter;
    }
    /**
     * For diagnostic purposes, returns the {@link CollatedWriter.taskName} for the
     * currently active writer, or an empty string if no writer is active.
     */
    get activeTaskName() {
        if (this._activeWriter) {
            return this._activeWriter.taskName;
        }
        return '';
    }
    /**
     * The list of writers that have been registered by calling {@link StreamCollator.registerTask},
     * in the order that they were registered.
     */
    get writers() {
        return this._writers;
    }
    /**
     * Registers a new task to be collated, and constructs a {@link CollatedWriter} object
     * to receive its input.
     */
    registerTask(taskName) {
        if (this._taskNames.has(taskName)) {
            throw new Error('A task with that name has already been registered');
        }
        const writer = new CollatedWriter_1.CollatedWriter(taskName, this);
        this._writers.add(writer);
        this._taskNames.add(writer.taskName);
        // When a task is initially registered, it is open and has not accumulated any buffered chunks
        this._openInactiveWriters.add(writer);
        if (this._activeWriter === undefined) {
            // If there is no active writer, then the first one to be registered becomes active.
            this._assignActiveWriter(writer);
        }
        return writer;
    }
    /** @internal */
    _writerWriteChunk(writer, chunk, bufferedChunks) {
        this._checkForReentrantCall();
        if (this._activeWriter === undefined) {
            // If no writer is currently active, then the first one to write something becomes active
            this._assignActiveWriter(writer);
        }
        if (writer.isActive) {
            this.destination.writeChunk(chunk);
        }
        else {
            bufferedChunks.push(chunk);
        }
    }
    /** @internal */
    _writerClose(writer, bufferedChunks) {
        this._checkForReentrantCall();
        if (writer.isActive) {
            writer._flushBufferedChunks();
            this._activeWriter = undefined;
            // If any buffered writers are already closed, activate them each immediately
            // We copy the set, since _assignActiveWriter() will be deleting from it.
            for (const closedInactiveWriter of [...this._closedInactiveWriters]) {
                try {
                    this._assignActiveWriter(closedInactiveWriter);
                }
                finally {
                    this._activeWriter = undefined;
                }
            }
            let writerToActivate = undefined;
            // Try to activate a writer that already accumulated some data
            for (const openInactiveWriter of this._openInactiveWriters) {
                if (openInactiveWriter.bufferedChunks.length > 0) {
                    writerToActivate = openInactiveWriter;
                    break;
                }
            }
            if (!writerToActivate) {
                // Otherwise just take the first one
                for (const openInactiveWriter of this._openInactiveWriters) {
                    writerToActivate = openInactiveWriter;
                    break;
                }
            }
            if (writerToActivate) {
                this._assignActiveWriter(writerToActivate);
            }
        }
        else {
            this._openInactiveWriters.delete(writer);
            this._closedInactiveWriters.add(writer);
        }
    }
    _assignActiveWriter(writer) {
        this._activeWriter = writer;
        this._closedInactiveWriters.delete(writer);
        this._openInactiveWriters.delete(writer);
        if (this._onWriterActive) {
            this._preventReentrantCall = true;
            try {
                this._onWriterActive(writer);
            }
            finally {
                this._preventReentrantCall = false;
            }
        }
        writer._flushBufferedChunks();
    }
    _checkForReentrantCall() {
        if (this._preventReentrantCall) {
            throw new node_core_library_1.InternalError('Reentrant call to StreamCollator');
        }
    }
}
exports.StreamCollator = StreamCollator;
//# sourceMappingURL=StreamCollator.js.map