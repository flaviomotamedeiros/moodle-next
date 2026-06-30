"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const entity_js_1 = require("./entity.js");
class AggregateRoot extends entity_js_1.Entity {
    _events = [];
    emit(event) {
        this._events.push(event);
    }
    pullEvents() {
        const events = this._events;
        this._events = [];
        return events;
    }
}
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregate-root.js.map