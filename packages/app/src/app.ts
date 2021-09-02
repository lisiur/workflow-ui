import {Workflow, NodeType} from 'workflow'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const workflow = new Workflow(canvas)

workflow.addNode(NodeType.Trigger, 100, 100)
workflow.addNode(NodeType.Collector, 300, 300)
