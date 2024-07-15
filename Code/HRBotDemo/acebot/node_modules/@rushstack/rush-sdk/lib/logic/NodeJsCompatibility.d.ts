import type { RushConfiguration } from '../api/RushConfiguration';
export interface IWarnAboutVersionTooNewOptions {
    isRushLib: boolean;
    /**
     * The CLI front-end does an early check for NodeJsCompatibility.warnAboutVersionTooNew(),
     * so this flag is used to avoid reporting the same message twice.  Note that the definition
     * of "too new" may differ between the globally installed "@microsoft/rush" front end
     * versus the "@microsoft/rush-lib" loaded by the version selector.
     */
    alreadyReportedNodeTooNewError: boolean;
}
export interface IWarnAboutCompatibilityIssuesOptions extends IWarnAboutVersionTooNewOptions {
    rushConfiguration: RushConfiguration | undefined;
}
/**
 * This class provides useful functions for warning if the current Node.js runtime isn't supported.
 *
 * @internal
 */
export declare class NodeJsCompatibility {
    /**
     * This reports if the Node.js version is known to have serious incompatibilities.  In that situation, the user
     * should downgrade Rush to an older release that supported their Node.js version.
     */
    static reportAncientIncompatibleVersion(): boolean;
    /**
     * Detect whether the Node.js version is "supported" by the Rush maintainers.  We generally
     * only support versions that were "Long Term Support" (LTS) at the time when Rush was published.
     *
     * This is a warning only -- the user is free to ignore it and use Rush anyway.
     */
    static warnAboutCompatibilityIssues(options: IWarnAboutCompatibilityIssuesOptions): boolean;
    /**
     * Warn about a Node.js version that has not been tested yet with Rush.
     */
    static warnAboutVersionTooNew(options: IWarnAboutVersionTooNewOptions): boolean;
    private static _warnAboutNonLtsVersion;
    private static _warnAboutOddNumberedVersion;
    static get isLtsVersion(): boolean;
    static get isOddNumberedVersion(): boolean;
}
//# sourceMappingURL=NodeJsCompatibility.d.ts.map