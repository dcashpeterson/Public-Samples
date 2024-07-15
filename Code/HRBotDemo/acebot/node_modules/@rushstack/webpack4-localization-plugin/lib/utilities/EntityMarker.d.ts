declare const LABEL: unique symbol;
export interface IMarkable {
    [LABEL]: boolean;
}
/**
 * Use the functions on this class to mark webpack entities that contain localized resources.
 */
export declare class EntityMarker {
    static markEntity<TModule>(module: TModule, value: boolean): void;
    static getMark<TModule>(module: TModule): boolean | undefined;
}
export {};
//# sourceMappingURL=EntityMarker.d.ts.map