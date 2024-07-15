/// <reference types="node" />
import { Worker } from 'worker_threads';
/**
 * Symbol to read the ID off of a worker
 * @internal
 */
export declare const WORKER_ID_SYMBOL: unique symbol;
/**
 * @internal
 */
export interface IWorkerPoolOptions {
    /**
     * Identifier for this pool, to assign to its workers for tracking
     */
    id: string;
    /**
     * Maximum number of concurrent workers this WorkerPool may spawn.
     */
    maxWorkers: number;
    /**
     * Optional callback invoked when a worker is destroyed.
     */
    onWorkerDestroyed?: () => void;
    /**
     * Optional callback invoked on a newly created worker.
     */
    prepareWorker?: (worker: Worker) => void;
    /**
     * Optional data to pass to workers when they are initialized.
     * Will be subjected to the Structured Clone algorithm.
     */
    workerData?: unknown;
    /**
     * Absolute path to the worker script.
     */
    workerScriptPath: string;
}
/**
 * Manages a pool of workers.
 * Workers will be shutdown by sending them the boolean value `false` in a postMessage.
 * @internal
 */
export declare class WorkerPool {
    id: string;
    maxWorkers: number;
    private readonly _alive;
    private _error;
    private _finishing;
    private readonly _idle;
    private _nextId;
    private readonly _onComplete;
    private readonly _onWorkerDestroyed;
    private readonly _pending;
    private readonly _prepare;
    private readonly _workerData;
    private readonly _workerScript;
    constructor(options: IWorkerPoolOptions);
    /**
     * Gets the count of active workers.
     */
    getActiveCount(): number;
    /**
     * Gets the count of idle workers.
     */
    getIdleCount(): number;
    /**
     * Gets the count of live workers.
     */
    getLiveCount(): number;
    /**
     * Tells the pool to shut down when all workers are done.
     * Returns a promise that will be fulfilled if all workers finish successfully, or reject with the first error.
     */
    finishAsync(): Promise<void>;
    /**
     * Resets the pool and allows more work
     */
    reset(): void;
    /**
     * Returns a worker to the pool. If the pool is finishing, deallocates the worker.
     * @param worker - The worker to free
     */
    checkinWorker(worker: Worker): void;
    /**
     * Checks out a currently available worker or waits for the next free worker.
     * @param allowCreate - If creating new workers is allowed (subject to maxSize)
     */
    checkoutWorkerAsync(allowCreate: boolean): Promise<Worker>;
    /**
     * Creates a new worker if allowed by maxSize.
     */
    private _createWorker;
    /**
     * Cleans up a worker
     */
    private _destroyWorker;
    /**
     * Notifies all pending callbacks that an error has occurred and switches this pool into error state.
     */
    private _onError;
}
//# sourceMappingURL=WorkerPool.d.ts.map