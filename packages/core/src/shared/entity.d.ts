export declare abstract class Entity<TId extends string = string> {
    readonly id: TId;
    constructor(id: TId);
    equals(other: Entity<TId>): boolean;
}
//# sourceMappingURL=entity.d.ts.map