export declare class FileDeletionUtility {
    static deletePatterns(patterns: string[]): void;
    static deleteFiles(files: string[]): void;
    static escapeFilePaths(files: string[]): string[];
    static removeChildren(filenames: string[]): string[];
    static isParentDirectory(directory: string | undefined, filePath: string | undefined): boolean;
}
//# sourceMappingURL=FileDeletionUtility.d.ts.map