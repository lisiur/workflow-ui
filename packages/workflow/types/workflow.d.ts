import { NodeWidget } from './widgets/nodeWidget';
declare type NodeMeta = {
    type: "Script";
    id: string;
    cmd: string;
    arg: string;
} | {
    type: "Trigger";
    id: string;
};
export declare enum NodeType {
    Trigger = 0,
    Collector = 1
}
interface EdgeMeta {
    from: string;
    to: string;
}
interface WorkflowJsonMeta {
    nodes: NodeMeta[];
    edges: EdgeMeta[];
    positions: {
        [k: string]: [number, number];
    };
}
export declare class Workflow {
    private ezcanvas;
    private nodeToNodeWrapperMap;
    private idToNodeWrapperMap;
    private edgeWrappers;
    private idToOutEdgesMap;
    private idToInEdgesMap;
    static fromJson(canvas: string | HTMLCanvasElement, meta: WorkflowJsonMeta): void;
    constructor(canvas: string | HTMLCanvasElement);
    addNode(type: NodeType, x: number, y: number, z?: number): void;
    addEdge(from: NodeWidget, to: NodeWidget): void;
    addEdgeById(from: string, to: string): void;
}
export {};
