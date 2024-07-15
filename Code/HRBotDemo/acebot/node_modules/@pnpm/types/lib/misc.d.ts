export type DependenciesField = 'optionalDependencies' | 'dependencies' | 'devDependencies';
export type DependenciesOrPeersField = DependenciesField | 'peerDependencies';
export declare const DEPENDENCIES_FIELDS: DependenciesField[];
export declare const DEPENDENCIES_OR_PEER_FIELDS: DependenciesOrPeersField[];
export interface Registries {
    default: string;
    [scope: string]: string;
}
export type HoistedDependencies = Record<string, Record<string, 'public' | 'private'>>;
export interface PatchFile {
    path: string;
    hash: string;
}
