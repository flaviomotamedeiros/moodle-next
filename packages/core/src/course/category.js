"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const entity_js_1 = require("../shared/entity.js");
class Category extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    get name() { return this.props.name; }
    get parentId() { return this.props.parentId; }
    get isRoot() { return !this.props.parentId; }
}
exports.Category = Category;
//# sourceMappingURL=category.js.map