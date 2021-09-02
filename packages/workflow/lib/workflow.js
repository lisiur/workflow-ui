import { EzCanvas } from 'ezcanvas';
import { TriggerWidget } from './widgets/triggerWidget';
import { v4 as uuid } from 'uuid';
import { CollectorWidget } from './widgets/collectorWidget';
import { EdgeWidget } from './widgets/edgeWidget';
export var NodeType;
(function (NodeType) {
    NodeType[NodeType["Trigger"] = 0] = "Trigger";
    NodeType[NodeType["Collector"] = 1] = "Collector";
})(NodeType || (NodeType = {}));
export class Workflow {
    ezcanvas;
    nodeToNodeWrapperMap;
    idToNodeWrapperMap;
    edgeWrappers;
    idToOutEdgesMap;
    idToInEdgesMap;
    static fromJson(canvas, meta) {
        const workflow = new Workflow(canvas);
        for (let node of meta.nodes) {
        }
    }
    constructor(canvas) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        this.ezcanvas = new EzCanvas(canvas);
        this.nodeToNodeWrapperMap = new Map();
        this.idToNodeWrapperMap = new Map();
        this.edgeWrappers = [];
        this.idToOutEdgesMap = new Map();
        this.idToInEdgesMap = new Map();
    }
    addNode(type, x, y, z = 0) {
        const center = this.ezcanvas.translateDomPosition(x, y);
        let widget;
        switch (type) {
            case NodeType.Trigger: {
                widget = new TriggerWidget(center, z);
                break;
            }
            case NodeType.Collector: {
                widget = new CollectorWidget(center, z);
                break;
            }
            default: {
                throw new Error("unknown type");
            }
        }
        widget.linkTo = (toNode) => {
            this.addEdge(widget, toNode);
        };
        const nodeWrapper = new NodeWrapper(widget);
        nodeWrapper.addTo(this.ezcanvas.defaultLayer);
        this.idToNodeWrapperMap.set(nodeWrapper.id, nodeWrapper);
        this.nodeToNodeWrapperMap.set(widget, nodeWrapper);
    }
    addEdge(from, to) {
        const fromNodeWrapper = this.nodeToNodeWrapperMap.get(from);
        const toNodeWrapper = this.nodeToNodeWrapperMap.get(to);
        if (!fromNodeWrapper || !toNodeWrapper) {
            throw new Error('invalid node');
        }
        this.addEdgeById(fromNodeWrapper.id, toNodeWrapper.id);
    }
    addEdgeById(from, to) {
        const fromNode = this.idToNodeWrapperMap.get(from);
        const toNode = this.idToNodeWrapperMap.get(to);
        if (!fromNode || !toNode) {
            throw new Error('invalid id');
        }
        const edgeWidget = new EdgeWidget(fromNode.widget, toNode.widget);
        const edgeWrapper = new EdgeWrapper(edgeWidget);
        edgeWrapper.addTo(this.ezcanvas.defaultLayer);
        this.edgeWrappers.push(edgeWrapper);
        let outEdges = this.idToOutEdgesMap.get(fromNode.id) ?? [];
        outEdges.push(edgeWrapper);
        this.idToOutEdgesMap.set(fromNode.id, outEdges);
        let inEdges = this.idToInEdgesMap.get(toNode.id) ?? [];
        inEdges.push(edgeWrapper);
        this.idToInEdgesMap.set(toNode.id, inEdges);
    }
}
class NodeWrapper {
    widget;
    id;
    constructor(widget, id) {
        this.widget = widget;
        this.id = id ?? uuid();
        this.widget = widget;
    }
    addTo(layer) {
        this.widget.addTo(layer);
    }
    toJsonMeta() {
        return;
    }
}
class EdgeWrapper {
    widget;
    id;
    constructor(widget, id) {
        this.widget = widget;
        this.id = id ?? uuid();
        this.widget = widget;
    }
    addTo(layer) {
        this.widget.addTo(layer);
    }
}
