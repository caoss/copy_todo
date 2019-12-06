/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Collapse, Icon } from 'antd'
import uuid from 'uuid'

const Panel = Collapse.Panel

class Index extends Component {
    static propTypes = {
        workspaceRef: PropTypes.any,
        descriptors: PropTypes.object
    }

    state = {
        activeKey: [],
        collapse: false,
        textSearch: '',
        descriptors: {}
    }

    componentDidMount() {
        const { workspaceRef, descriptors } = this.props
        this.waitForCanvasRender(workspaceRef)
    }

    componentWillReceiveProps(nextProps) {}

    componentWillUnmount() {
        const { workspaceRef } = this.props
        this.detachEventListener(workspaceRef)
    }

    waitForCanvasRender = workspace => {
        // console.log(canvas)
        setTimeout(() => {
        if (workspace) {
            this.attachEventListener(workspace)
            return
        }
        const { workspaceRef } = this.props
        // console.log('canvas--------', this)
        this.waitForCanvasRender(workspaceRef)
        }, 5)
    }

    attachEventListener = workspaceRef => {
        workspaceRef.refs.workspaceHook.addEventListener( 'dragover', this.events.onDragOver,false)
        workspaceRef.refs.workspaceHook.addEventListener('drop',this.events.onDrop,false)
    }

    detachEventListener = workspaceRef => {
        workspaceRef.refs.workspaceHook.removeEventListener( 'dragover',this.events.onDragOver,false)
        workspaceRef.refs.workspaceHook.removeEventListener('drop',this.events.onDrop,false)
    }

    handlers = {
        onAddItem: (item, centered) => {
            const { workspaceRef } = this.props
            const id = uuid()
            const option = Object.assign({}, item, {
                id,
                type: item.nodeClazz
            })
            // console.log('onAddItem---------', option)
            // console.log(canvasRef)
            workspaceRef.handlers.add(option, centered)
        }
    }

    events = {
        onDragStart: (e, item) => {
            this.item = item
            // console.log('onDragStart--------------', e, item)
        },
        onDragEnd: e => {
            // console.log('onDragEnd--------------', e)
            this.item = null
        },
        onDragOver: e => {
            if (e.preventDefault) {
                e.preventDefault()
            }
            return false
        },
        onDrop: e => {
            e = e || window.event
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.stopPropagation) {
                e.stopPropagation()
            }
            const { pageX, pageY } = e
            // console.log(e)
            // const option = Object.assign({}, this.item, { x: layerX, y: layerY })
            this.handlers.onAddItem(this.item, { x: pageX, y: pageY, mode: 'page' })
            return false
        }
    }

    renderItems = items => (
        <div>
            {
                items.map(item => (
                    <div
                        className="item-con"
                        key={item.name}
                        draggable
                        onDragStart={e => this.events.onDragStart(e, item)}
                        onDragEnd={e => this.events.onDragEnd(e, item)}
                        onClick={() => {
                            this.handlers.onAddItem(item, { x: 160, y: 160 })
                        }}
                    >
                    <img
                        src={require(`./images/icon_${item.icon}.png`)}
                        className="item-icon"
                    />
                        {item.name}
                    </div>
                ))
            }
        </div>
    )

    render() {
        const { descriptors } = this.props
        const active = Object.keys(descriptors)[0]
        const customPanelStyle = {
            width: '100%',
            background: '#2A2D3E',
            color: '#FFF',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden'
        }
        return (
            <div className="my-slider">
                {
                active 
                ? 
                    (
                        <Collapse defaultActiveKey={[active]} style={customPanelStyle}>
                            {
                                descriptors && Object.keys(descriptors).map(key => (
                                    <Panel
                                        key={key}
                                        header={
                                            <div className="h-con">
                                            <img
                                                src={require(`./images/icon_${
                                                descriptors[key].icon
                                                }.png`)}
                                                className="item-icon"
                                            />
                                            {descriptors[key].name}
                                            </div>
                                        }
                                    >
                                        {this.renderItems(descriptors[key].subs)}
                                    </Panel>
                                ))
                            }
                        </Collapse>
                    ) 
                : 
                    ''
                }
            </div>
            )
    }
    }

Index.propTypes = {}

Index.defaultProps = {}

export default Index
