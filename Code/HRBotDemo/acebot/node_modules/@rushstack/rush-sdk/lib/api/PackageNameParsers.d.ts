import { PackageNameParser } from '@rushstack/node-core-library';
export declare class PackageNameParsers {
    /**
     * This is the default for `RushConfiguration.packageNameParser`.
     */
    static rushDefault: PackageNameParser;
    /**
     * This is the `RushConfiguration.packageNameParser` used when `allowMostlyStandardPackageNames = true`
     * in rush.json.
     */
    static mostlyStandard: PackageNameParser;
    /**
     * Use this in contexts where we don't have easy access to `RushConfiguration.packageNameParser`
     * AND the package name was already validated at some earlier stage.
     */
    static permissive: PackageNameParser;
}
//# sourceMappingURL=PackageNameParsers.d.ts.map