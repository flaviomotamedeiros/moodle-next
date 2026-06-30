"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
const entity_js_1 = require("../shared/entity.js");
class Section extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    get title() { return this.props.title; }
    get order() { return this.props.order; }
    get visible() { return this.props.visible; }
    reorder(newOrder) {
        this.props.order = newOrder;
    }
    toggleVisibility() {
        this.props.visible = !this.props.visible;
    }
}
exports.Section = Section;
//# sourceMappingURL=section.js.map