import {EzCanvas, Layer, Widget} from 'ezcanvas'
import {TriggerWidget} from './widgets/triggerWidget'
import {v4 as uuid} from 'uuid'
import {CollectorWidget} from './widgets/collectorWidget'
import {NodeWidget} from './widgets/nodeWidget'
import {EdgeWidget} from './widgets/edgeWidget'

type NodeMeta = {
    type: "Script"
    id: string
    cmd: string
    arg: string
} | {
    type: "Trigger"
    id: string
}

export enum NodeType {
    Trigger,
    Collector,
}

interface EdgeMeta {
    from: string
    to: string
}

interface WorkflowJsonMeta {
    nodes: NodeMeta[],
    edges: EdgeMeta[]
    positions: {
        [k: string]: [number, number]
    },
}

export class Workflow {
    private ezcanvas: EzCanvas
    private nodeToNodeWrapperMap: Map<NodeWidget, NodeWrapper>
    private idToNodeWrapperMap: Map<string, NodeWrapper>
    private edgeWrappers: EdgeWrapper[]
    private idToOutEdgesMap: Map<string, EdgeWrapper[]>
    private idToInEdgesMap: Map<string, EdgeWrapper[]>
    static fromJson(canvas: string | HTMLCanvasElement, meta: WorkflowJsonMeta) {
        const workflow = new Workflow(canvas)
        for (let node of meta.nodes) {

        }
    }
    constructor(canvas: string | HTMLCanvasElement) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas) as HTMLCanvasElement
        }
        this.ezcanvas = new EzCanvas(canvas)
        this.nodeToNodeWrapperMap = new Map()
        this.idToNodeWrapperMap = new Map()
        this.edgeWrappers = []
        this.idToOutEdgesMap = new Map()
        this.idToInEdgesMap = new Map()
    }

    addNode(type: NodeType, x: number, y: number, z = 0) {
        const center = this.ezcanvas.translateDomPosition(x, y)
        let widget!: NodeWidget
        switch (type) {
            case NodeType.Trigger: {
                widget = new TriggerWidget(center, z)
                break
            }
            case NodeType.Collector: {
                widget = new CollectorWidget(center, z)
                break
            }
            default: {
                throw new Error("unknown type")
            }
        }

        widget.linkTo = (toNode) => {
            this.addEdge(widget, toNode)
        }
        const nodeWrapper = new NodeWrapper(widget)
        nodeWrapper.addTo(this.ezcanvas.defaultLayer)
        this.idToNodeWrapperMap.set(nodeWrapper.id, nodeWrapper)
        this.nodeToNodeWrapperMap.set(widget, nodeWrapper)
    }

    addEdge(from: NodeWidget, to: NodeWidget) {
        const fromNodeWrapper = this.nodeToNodeWrapperMap.get(from)
        const toNodeWrapper = this.nodeToNodeWrapperMap.get(to)
        if (!fromNodeWrapper || !toNodeWrapper) {
            throw new Error('invalid node')
        }
        this.addEdgeById(fromNodeWrapper.id, toNodeWrapper.id)
    }

    addEdgeById(from: string, to: string) {
        const fromNode = this.idToNodeWrapperMap.get(from)
        const toNode = this.idToNodeWrapperMap.get(to)
        if (!fromNode || !toNode) {
            throw new Error('invalid id')
        }
        const edgeWidget = new EdgeWidget(fromNode.widget, toNode.widget)
        const edgeWrapper = new EdgeWrapper(edgeWidget)
        edgeWrapper.addTo(this.ezcanvas.defaultLayer)

        this.edgeWrappers.push(edgeWrapper)

        let outEdges = this.idToOutEdgesMap.get(fromNode.id) ?? []
        outEdges.push(edgeWrapper)
        this.idToOutEdgesMap.set(fromNode.id, outEdges)

        let inEdges = this.idToInEdgesMap.get(toNode.id) ?? []
        inEdges.push(edgeWrapper)
        this.idToInEdgesMap.set(toNode.id, inEdges)
    }
}

class NodeWrapper {
    public id: string

    constructor(public widget: NodeWidget, id?: string) {
        this.id = id ?? uuid()
        this.widget = widget
    }

    addTo(layer: Layer) {
        this.widget.addTo(layer)
    }

    toJsonMeta() {
        return
    }
}

class EdgeWrapper {
    public id: string
    constructor(public widget: EdgeWidget, id?: string) {
        this.id = id ?? uuid()
        this.widget = widget
    }

    addTo(layer: Layer) {
        this.widget.addTo(layer)
    }
}
