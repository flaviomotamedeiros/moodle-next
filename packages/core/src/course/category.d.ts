import { Entity } from '../shared/entity.js';
export interface CategoryProps {
    name: string;
    parentId?: string;
}
export declare class Category extends Entity {
    private props;
    constructor(id: string, props: CategoryProps);
    get name(): string;
    get parentId(): string | undefined;
    get isRoot(): boolean;
}
//# sourceMappingURL=category.d.ts.map