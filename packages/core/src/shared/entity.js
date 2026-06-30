"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    id;
    constructor(id) {
        this.id = id;
    }
    equals(other) {
        return this.id === other.id;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map