/**
 * Rush per-user configuration data.
 *
 * @beta
 */
export declare class RushUserConfiguration {
    private static _schema;
    /**
     * If provided, store build cache in the specified folder. Must be an absolute path.
     */
    readonly buildCacheFolder: string | undefined;
    private constructor();
    static initializeAsync(): Promise<RushUserConfiguration>;
    static getRushUserFolderPath(): string;
}
//# sourceMappingURL=RushUserConfiguration.d.ts.map