/**
 * The parsed format of a provided version specifier.
 */
export declare enum DependencySpecifierType {
    /**
     * A git repository
     */
    Git = "Git",
    /**
     * A tagged version, e.g. "example@latest"
     */
    Tag = "Tag",
    /**
     * A specific version number, e.g. "example@1.2.3"
     */
    Version = "Version",
    /**
     * A version range, e.g. "example@2.x"
     */
    Range = "Range",
    /**
     * A local .tar.gz, .tar or .tgz file
     */
    File = "File",
    /**
     * A local directory
     */
    Directory = "Directory",
    /**
     * An HTTP url to a .tar.gz, .tar or .tgz file
     */
    Remote = "Remote",
    /**
     * A package alias, e.g. "npm:other-package@^1.2.3"
     */
    Alias = "Alias",
    /**
     * A package specified using workspace protocol, e.g. "workspace:^1.2.3"
     */
    Workspace = "Workspace"
}
/**
 * An NPM "version specifier" is a string that can appear as a package.json "dependencies" value.
 * Example version specifiers: `^1.2.3`, `file:./blah.tgz`, `npm:other-package@~1.2.3`, and so forth.
 * A "dependency specifier" is the version specifier information, combined with the dependency package name.
 */
export declare class DependencySpecifier {
    /**
     * The dependency package name, i.e. the key from a "dependencies" key/value table.
     */
    readonly packageName: string;
    /**
     * The dependency version specifier, i.e. the value from a "dependencies" key/value table.
     * Example values: `^1.2.3`, `file:./blah.tgz`, `npm:other-package@~1.2.3`
     */
    readonly versionSpecifier: string;
    /**
     * The type of the `versionSpecifier`.
     */
    readonly specifierType: DependencySpecifierType;
    /**
     * If `specifierType` is `alias`, then this is the parsed target dependency.
     * For example, if version specifier i `"npm:other-package@^1.2.3"` then this is the parsed object for
     * `other-package@^1.2.3`.
     */
    readonly aliasTarget: DependencySpecifier | undefined;
    constructor(packageName: string, versionSpecifier: string);
    static getDependencySpecifierType(specifierType: string): DependencySpecifierType;
}
//# sourceMappingURL=DependencySpecifier.d.ts.map