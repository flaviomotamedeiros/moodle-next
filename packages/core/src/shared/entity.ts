export abstract class Entity<TId extends string = string> {
  constructor(readonly id: TId) {}

  equals(other: Entity<TId>): boolean {
    return this.id === other.id
  }
}
