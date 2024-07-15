/**
 * Minimal subset of RushConfigurationProject needed for graph manipulation.
 * Used to facilitate type safety in unit tests.
 * @internal
 */
export interface IPartialProject<T extends IPartialProject<T>> {
    dependencyProjects: ReadonlySet<T>;
    consumingProjects: ReadonlySet<T>;
}
/**
 * This namespace contains functions for manipulating sets of projects
 */
export declare class Selection {
    /**
     * Computes the intersection of two or more sets.
     */
    static intersection<T>(first: Iterable<T>, ...rest: ReadonlySet<T>[]): Set<T>;
    /**
     * Computes the union of two or more sets.
     */
    static union<T>(...sets: Iterable<T>[]): Set<T>;
    /**
     * Computes a set that contains the input projects and all the direct and indirect dependencies thereof.
     */
    static expandAllDependencies<T extends IPartialProject<T>>(input: Iterable<T>): Set<T>;
    /**
     * Computes a set that contains the input projects and all projects that directly or indirectly depend on them.
     */
    static expandAllConsumers<T extends IPartialProject<T>>(input: Iterable<T>): Set<T>;
    /**
     * Iterates the direct dependencies of the listed projects. May contain duplicates.
     */
    static directDependenciesOf<T extends IPartialProject<T>>(input: Iterable<T>): Iterable<T>;
    /**
     * Iterates the projects that declare any of the listed projects as a dependency. May contain duplicates.
     */
    static directConsumersOf<T extends IPartialProject<T>>(input: Iterable<T>): Iterable<T>;
}
//# sourceMappingURL=Selection.d.ts.map