import { Entity } from '../shared/entity.js';
export interface SectionProps {
    title: string;
    order: number;
    visible: boolean;
}
export declare class Section extends Entity {
    private props;
    constructor(id: string, props: SectionProps);
    get title(): string;
    get order(): number;
    get visible(): boolean;
    reorder(newOrder: number): void;
    toggleVisibility(): void;
}
//# sourceMappingURL=section.d.ts.map