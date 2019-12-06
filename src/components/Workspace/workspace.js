/**
 * @author YM
 */
import './nodes/base/Node'
import {
    LinkNode
} from './nodes/custom/index'

joint.dia.GraphExtend = joint.dia.Graph.extend({
    selectElements: [],
    addSelectElement(ele) {
        ele.highlight()
        this.selectElements.push(ele)
    },
    addOnlySelect(ele) {
        this.removeAllSelect()
        ele.highlight()
        this.selectElements.push(ele)
    },
    removeSelectElements(ele) {
        this.selectElements.forEach((ele, i) => {})
    },
    removeAllSelect() {
        this.selectElements.forEach((ele, i) => {
            ele.unhighlight()
        })
        this.selectElements = []
    },
    getSelectElements() {
        return this.selectElements
    },
    deleteAllSelectElements() {
        const eles = this.selectElements

        const cells = []
        for (const r of eles) {
            cells.push(r.model)
        }
        this.removeCells(cells)
        this.removeAllSelect()
    },
    clearAll() {
        console.log(this.getCells())
        this.removeCells(this.getCells())
    }
})

joint.dia.PaperExtend = joint.dia.Paper.extend({
    initialize() {
        joint.dia.Paper.prototype.initialize.apply(this, arguments)
        const graph = this.model
        let prePos = {
            x: 0,
            y: 0
        }
        // 实现平移工作空间
        this.on('blank:pointerdown', (ev, x, y) => {
            prePos = {
                x: ev.pageX,
                y: ev.pageY
            }
        })
        this.on('blank:pointermove', (ev, x, y) => {
            const {
                pageX,
                pageY
            } = ev
            const origin = this.translate()
            const newOrigin = {
                x: origin.tx + (pageX - prePos.x),
                y: origin.ty + (pageY - prePos.y)
            }
            prePos = {
                x: ev.pageX,
                y: ev.pageY
            }
            this.translate(newOrigin.x, newOrigin.y)
        })
        // 实现右键菜单功能
        // this.on('element:contextmenu', (eleView, x, y, m) => {
        //   console.log('element:contextmenu', eleView, x, y, m)
        // })
        // 实现滚动鼠标缩放功能
        // this.on('blank:mousewheel', (ev, x, y, delta) => {
        //   //   console.log('delta---------', delta)
        //   const zoom = this.getZoom()
        //   console.log(zoom)
        //   if (delta === 1) {
        //     this.zoomIn(x, y)
        //   } else {
        //     this.zoomOut(x, y)
        //   }
        // })
        this.on('element:pointerdown', (eleView, ev) => {
            graph.addOnlySelect(eleView)
            this.trigger('element:select', eleView, ev)
        })

        this.on('blank:pointerdown', (eleView, ev) => {
            graph.removeAllSelect()
            this.trigger('element:noselect', eleView, ev)
        })
    },
    getZoom() {
        const options = this.options
        return options.zoom
    },
    zoomIn(x, y) {
        const zoom = this.getZoom()
        zoom.scale += 0.05

        if (zoom.scale > zoom.maxScale) {
            zoom.scale = zoom.maxScale
            return
        }

        const scaleX = zoom.scale
        const scaleY = zoom.scale
        this.scale(scaleX, scaleY, x, y)
    },
    zoomOut(x, y) {
        const zoom = this.getZoom()
        zoom.scale -= 0.05
        if (zoom.scale < zoom.minScale) {
            zoom.scale = zoom.minScale
            return
        }
        const scaleX = zoom.scale
        const scaleY = zoom.scale
        this.scale(scaleX, scaleY, x, y)
    },
    zoomFit() {
        const zoom = this.getZoom()
        zoom.scale = 1
        this.scale(1, 1, 0, 0)
    },
    translatePaper() {}
})

const createWorkSpace = function (options) {

    const graph = new joint.dia.GraphExtend()
    const mergeOptions = Object.assign({}, {
            model: graph,
            gridSize: 10,
            background: {
                color: '#374162'
            },
            zoom: {
                enable: true,
                minScale: 0.3,
                maxScale: 2,
                scale: 1
            },
            highlighting: {
                default: {
                    name: 'stroke',
                    options: {}
                }
            },
            perpendicularLinks: false,
            drawGrid: {//画格子
                name: 'mesh',
                args: {
                    color: '#2C354F'
                }
            },
            snapLinks: false,
            linkPinning: false,
            defaultLink: options && options.targetArraw ?
                LinkNode({
                    attrs: {
                        '.connection': {
                            targetMarker:options.targetMarker ?{//定义连接箭头
                                type: 'path',
                                'stroke-width': 0,
                                fill: '#FF408A',
                                d: 'M 8 -4 0 0 8 4 Z'
                            }:''
                        }
                    }
                }) :
                LinkNode()
            //   guard(evt, view) {
            //     console.log(evt, view)
            //   }
        },
        options
    )
    const paper = new joint.dia.PaperExtend(mergeOptions)
    return {
        graph,
        paper
    }
}

function addSelect(ele, graph) {}

export default createWorkSpace