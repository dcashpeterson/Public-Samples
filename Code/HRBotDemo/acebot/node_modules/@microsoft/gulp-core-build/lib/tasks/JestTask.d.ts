import { GulpTask } from './GulpTask';
import { IBuildConfig } from '../IBuildConfig';
import * as Gulp from 'gulp';
import { JsonObject } from '@rushstack/node-core-library';
/**
 * Configuration for JestTask
 * @alpha
 */
export interface IJestConfig {
    /**
     * Indicate whether this task is enabled. The default value is false.
     */
    isEnabled?: boolean;
    /**
     * Indicate whether Jest cache is enabled or not.
     */
    cache?: boolean;
    /**
     * Same as Jest CLI option collectCoverageFrom
     */
    collectCoverageFrom?: string[];
    /**
     * Same as Jest CLI option coverage
     */
    coverage?: boolean;
    /**
     * Same as Jest CLI option coverageReporters
     */
    coverageReporters?: string[];
    /**
     * Same as Jest CLI option testPathIgnorePatterns
     */
    testPathIgnorePatterns?: string[];
    /**
     * Same as Jest CLI option modulePathIgnorePatterns
     */
    modulePathIgnorePatterns?: string[];
    /**
     * Same as Jest CLI option moduleDirectories
     */
    moduleDirectories?: string[];
    /**
     * Same as Jest CLI option maxWorkers
     */
    maxWorkers?: number;
    /**
     * Same as Jest CLI option testMatch
     */
    testMatch?: string[];
    /**
     * Indicate whether writing NUnit results is enabled when using the default reporter
     */
    writeNUnitResults?: boolean;
}
/**
 * Indicates if jest is enabled
 * @internal
 * @param rootFolder - package root folder
 */
export declare function _isJestEnabled(rootFolder: string): boolean;
/**
 * This task takes in a map of dest: [sources], and copies items from one place to another.
 * @alpha
 */
export declare class JestTask extends GulpTask<IJestConfig> {
    constructor();
    isEnabled(buildConfig: IBuildConfig): boolean;
    /**
     * Loads the z-schema object for this task
     */
    loadSchema(): JsonObject;
    executeTask(gulp: typeof Gulp, completeCallback: (error?: string | Error) => void): void;
    private _copySnapshots;
    private _copyIfMatchExtension;
}
//# sourceMappingURL=JestTask.d.ts.map