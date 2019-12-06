/**
 * @author YM
 */
import React, {
    Component
} from 'react'
import './index.scss'
import {
    Button
} from 'antd'
import {
    saveAs
} from 'file-saver'
import createWorkspace from './workspace'
import CommonButton from '../Common/CommonButton'
import Storage from '../../utils/Storage'

class Index extends Component {
    constructor(props) {
        super(props)
        const self = this
        this.state = {
            workspace: null,
            zoomRatio: 1,
            showRightMenu: false,
            rightType: '',
            rightEleView: null,
            rightPos: {
                x: 0,
                y: 0
            }
        }
        this.menu = [{
                type: 'all',
                name: '清空工作空间',
                onClick: () => {
                    self.toolsEvents.clearAll()
                }
            },
            {
                type: 'element',
                name: '旋转90度',
                onClick: () => {
                    self.toolsEvents.rotateElement(90)
                }
            },
            {
                type: 'element',
                name: '逆时针旋转90度',
                onClick: () => {
                    self.toolsEvents.rotateElement(-90)
                }
            }
        ]
    }

    componentDidMount() {
        const myWorkspaceCon = document.querySelector('#myWorkspaceCon')
        const mInfo = myWorkspaceCon.getBoundingClientRect()
        const {
            saveData,
            options
        } = this.props

        this.workspace = createWorkspace({
            el: document.getElementById('myWorkspace'),
            width: mInfo.width,
            height: mInfo.height,
            targetArraw: !!(options && options.targetArraw),
            targetMarker: !!(options && options.targetMarker),
            validateConnection(source, magnetS, target, magnetT) {
                // console.log('cellViewT--------------', cellViewT)
                const portSStr = magnetS ? magnetS.getAttribute('port-group') : ''
                const portSArr = portSStr.split('-')
                const portSType = portSArr ? portSArr[portSArr.length - 1] : null
                const portTStr = magnetT ? magnetT.getAttribute('port-group') : ''
                const portTArr = portTStr.split('-')
                const portTType = portTArr ? portTArr[portTArr.length - 1] : null

                if (!portSType || portSType == 'in') {
                    return false
                }

                if (!portTType || portTType !== 'in') {
                    return false
                }

                if (magnetS === magnetT) return false

                return true
            }
        })

        this.workspace.paper.on('element:select', (eleView, ev) => {
            eventBus.emit('elementsSelect', [eleView, ev])
            // console.log(ele, ev)
        })
        this.workspace.paper.on('element:noselect', (eleView, ev) => {
            eventBus.emit('elementsNoSelect', [eleView, ev])
        })
        this.workspace.paper.on('element:contextmenu', (eleView, ev) => {
            console.log('element:contextmenu', eleView, ev)
            const {
                pageX,
                pageY
            } = ev
            this.setState({
                rightEleView: eleView,
                showRightMenu: true,
                rightType: 'element',
                rightPos: {
                    x: pageX,
                    y: pageY
                }
            })
        })
        this.workspace.paper.on('blank:contextmenu', ev => {
            const {
                pageX,
                pageY
            } = ev
            this.setState({
                rightEleView: null,
                showRightMenu: true,
                rightType: 'blank',
                rightPos: {
                    x: pageX,
                    y: pageY
                }
            })
        })
        this.workspace.paper.on('cell:pointerdown blank:pointerdown', () => {
            this.setState({
                showRightMenu: false
            })
        })
        this.workspace.paper.on('element:pointerdblclick', (eleView, ev) => {
            eventBus.emit('elementsDbclick', [eleView, ev])
        })
        document.addEventListener('keydown', this.eventHandlers.keydown, false)

        if (saveData) {
            this.workspace.graph.fromJSON(JSON.parse(saveData))
        }
        // this.workspace.graph.fromJSON(JSON.parse(data))
    }

    eventHandlers = {
        keydown: e => {
            const {
                graph
            } = this.workspace
            if (e.keyCode === 46 || e.keyCode === 68) {
                graph.deleteAllSelectElements()
                eventBus.emit('elementsNoSelect', [e])
            } else if (e.keyCode === 27) {}
        }
    }

    handlers = {
        add: (item, pos) => {
            let cells = this.workspace.graph.attributes.cells.models;
            let num =  1;            
            cells.map(function(cell){
                if(cell.attributes.type == 'node.Station'){
                    num ++;
                }
            })
            if (pos.mode === 'page') {
                pos = this.workspace.paper.clientToLocalPoint({
                    x: pos.x,
                    y: pos.y
                })
            }

            const createdObj = joint.shapes.node[item.type].create({
                    position: {
                        x: pos.x,
                        y: pos.y
                    }
                },
                item
            )

            if(item.type == 'Station'){
                createdObj.attributes.attrs.label.text = '工位'+num;
            }

            this.workspace.graph.addCells(createdObj)
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        // const { elementObjects = {} } = nextProps
        // this.elementObjects = elementObjects
        // console.log('this.canvas.fabricObjects', this.canvas.fabricObjects)
    }

    toolsEvents = {
        zoomIn: () => {
            this.workspace.paper.zoomIn(0, 0)
            const zoom = this.workspace.paper.getZoom()
            this.setState({
                zoomRatio: zoom.scale
            })
        },
        zoomOut: () => {
            this.workspace.paper.zoomOut(0, 0)
            const zoom = this.workspace.paper.getZoom()
            this.setState({
                zoomRatio: zoom.scale
            })
        },
        zoomFit: () => {
            this.workspace.paper.zoomFit(0, 0)
            const zoom = this.workspace.paper.getZoom()
            this.setState({
                zoomRatio: zoom.scale
            })
        },
        save: key => {//保存数据-------------------------------------将 流程图信息 与 ID 绑定在一起
            const data = this.workspace.graph.toJSON()
            console.log('save--------------', key, data)
            Storage.saveToStorage({
                key,
                value: JSON.stringify(data)
            })
        },
        export: () => {
            const data = this.workspace.graph.toJSON()
            console.log('export--------------', data)
            const blob = new Blob([JSON.stringify(data)], {
                type: ''
            })
            saveAs(blob, 'design.json')
        },
        import: files => {
            if (files) {
                const reader = new FileReader()
                reader.onload = e => {
                    const result = JSON.parse(e.target.result)
                    console.log('result-------------', result)
                    if (result.cells) {
                        this.workspace.graph.fromJSON(result)
                    }
                }
                reader.readAsText(files[0])
            }
        },
        onUpload: () => {
            const inputEl = document.createElement('input')
            inputEl.accept = '.json'
            inputEl.type = 'file'
            inputEl.hidden = true
            inputEl.onchange = e => {
                this.toolsEvents.import(e.currentTarget.files)
            }
            document.body.appendChild(inputEl) // required for firefox
            inputEl.click()
            inputEl.remove()
        },
        clearAll: () => {
            this.workspace.graph.clearAll()
            this.setState({
                showRightMenu: false
            })
        },
        rotateElement: deg => {
            const {
                rightEleView
            } = this.state
            const model = rightEleView.model
            console.log('model', model)
            model.rotate(deg)
        }
    }

    render() {
        const {
            id
        } = this.props
        const {
            zoomRatio,
            rightPos,
            showRightMenu,
            rightType
        } = this.state
        const zoomValue = parseInt((zoomRatio * 100).toFixed(2), 10)
        return ( <div className = "my-canvas-con"
            style = {
                {
                    width: '100%',
                    height: '100%'
                }
            }
            id = "myWorkspaceCon"
            ref = "workspaceHook" >
            <
            div id = "myWorkspace"
            style = {
                {
                    width: '100%',
                    height: '100%'
                }
            }
            /> <div className = "editor-toolbar" >
            <div className = "editor-toolbar-zoom" >
            <Button.Group >
            <CommonButton 
                style = {
                    {
                        borderBottomLeftRadius: '8px',
                        borderTopLeftRadius: '8px'
                    }
                }
                icon = "search-plus"
                onClick = {
                    e => {
                        this.toolsEvents.zoomIn(e)
                    }
                }
            /> 
            <CommonButton onClick = {
                e => {
                    this.toolsEvents.zoomFit(e)
                }
            } >
            {
                zoomValue
            } %
            </CommonButton> 
            <CommonButton style = {
                {
                    borderBottomRightRadius: '8px',
                    borderTopRightRadius: '8px'
                }
            }
            icon = "search-minus"
            onClick = {
                e => {
                    this.toolsEvents.zoomOut(e)
                }
            }
            /> </Button.Group> 
            </div>

            <div className = "editor-toolbar-zoom" >
            <Button.Group >

            <CommonButton onClick = {
                () => {
                    this.toolsEvents.save(id)
                }
            } >
            保存 </CommonButton>

            <CommonButton onClick = {
                () => {
                    this.toolsEvents.onUpload(id)
                }
            } >
            导入 </CommonButton>

            <CommonButton onClick = {
                () => {
                    this.toolsEvents.export(id)
                }
            } >
            导出 </CommonButton>

            </Button.Group>
            </div> 
            </div> 
                {
                    showRightMenu
                    ?
                    ( <div className = "right-menu"
                        style = {
                            {
                                top: rightPos.y,
                                left: rightPos.x
                            }
                        }
                        onClick = {
                            () => {
                                this.setState({
                                    showRightMenu: false
                                })
                            }
                        } >
                        {
                            this.menu.map((item, i) =>
                                item.type === 'all' || item.type == rightType ?
                                ( <div key = {
                                        i
                                    }
                                    className = "menu-item"
                                    onClick = {
                                        item.onClick
                                    } > {
                                        item.name
                                    } </div>
                                ) :
                                ('')
                            )
                        } </div>
                    ) :
                    ''
            } </div>
        )
    }
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index