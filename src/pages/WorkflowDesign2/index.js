/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { Card, Icon, Modal } from 'antd'
import Workspace from '../../components/Workspace'
import Slider from '../../components/Slider'
import Storage from '../../utils/Storage'
import AttrContent from '../../components/NodeAttribute'
import ModalCustomForm from '../../components/ModalCustomForm'

class Index extends Component {
    constructor(props) {
        super(props)
        const self = this
        this.id = this.props.location.search.substring(('?id=').length);
        this.state = {
            mode: 0,
            data: {},
            workspaceRef: null,
            descriptors: {},
            saveData: Storage.getFormStorage(this.id),
            isShowAttrs: false,
            selectedItem: null,
            formData: [
                {
                    type: 'select',
                    label: '连接类型',
                    valueKey: 'connectType',
                    required: true,
                    items: [
                        {
                            label: '轴连接',
                            value: 1
                        },
                        {
                            label: '轴连接1',
                            value: 2
                        }
                    ],
                    value: 1
                },
                {
                    type: 'select',
                    label: '选择条件',
                    valueKey: 'ceiteria',
                    required: true,
                    items: [
                        {
                            label: '等于',
                            value: 1
                        },
                        {
                            label: '小于',
                            value: 2
                        },
                        {
                            label: '大于',
                            value: 3
                        },
                        {
                            label: '小于等于',
                            value: 4
                        },
                        {
                            label: '大于等于',
                            value: 5
                        }
                    ],
                    value: 1
                },
                {
                    type: 'text',
                    label: '值',
                    valueKey: 'ceiteriaValue',
                    value: '',
                    required: true
                }
            ]
        }
        
    }

    componentDidMount() {

        import('../../json/workflow.json').then(descriptors => {
        this.setState({
            descriptors: descriptors.default
        })
        })
        this.setState({
        workspaceRef: this.refs.myWorkspace
        })

        eventBus.on('elementsSelect', this.handlers.selectElement)
        eventBus.on('elementsNoSelect', this.handlers.noSelectElement)
        eventBus.on('elementsDbclick', this.handlers.dbclickElement)
    }

    componentWillUnmount() {
        eventBus.off('elementsSelect', this.handlers.selectElement)
        eventBus.off('elementsNoSelect', this.handlers.noSelectElement)
        eventBus.off('elementsDbclick', this.handlers.dbclickElement)
    }

    handlers = {
        selectElement: (eleView, ev) => {
            this.setState({
                selectedItem: eleView,
                isShowAttrs: true
            })
        },
        noSelectElement: (eleView, ev) => {
            this.setState({
                selectedItem: null,
                isShowAttrs: false
            })
        },
        dbclickElement: (eleView, ev) => {
            const ele = eleView.model
            if (ele.prop('type') === 'node.Job') {//选择动作指令
                console.log('eleView')
                this.setState({ mode: 1 })
            }else if(ele.prop('type') === 'node.Station'){//选择工位时，要跳转设计流程
                window.open('./actionflow?id='+ele.id);
            }
        },
        onSubmit: e => {}
    }

    render() {
        const {
            descriptors,
            workspaceRef,
            isShowAttrs,
            selectedItem,
            formData,
            data,
            mode
        } = this.state

        return (
            <div className="workflow-page">
                <div className="component-slider">
                    <Slider workspaceRef={workspaceRef} descriptors={descriptors} />
                </div>
                <Workspace
                    id={ this.id }
                    ref="myWorkspace"
                    saveData={this.state.saveData}
                    /*targetMarker->连线是否加箭头*/
                    options={{ targetArraw: true,targetMarker:false }}
                />

                {/* 属性面板 */}
                {isShowAttrs ? (
                    <div className="attribute-slider">
                        <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon
                                type="setting"
                                style={{ color: '#5B77D9', fontSize: '22px' }}
                            />
                            <span className="attr-title">属性面板</span>
                            </div>
                        }
                        bodyStyle={{ padding: 0 }}
                        className="attribute-con"
                        >
                        <AttrContent
                            workspaceRef={workspaceRef}
                            descriptors={descriptors}
                            selectedItem={selectedItem}
                            // onChange={(e, changedValues, allValues) => {
                            //   console.log('onchange------e', changedValues, allValues)
                            // }}
                        />
                        </Card>
                    </div>
                ) : (
                ''
                )}
                
                <ModalCustomForm
                    title="动作指令dfa"
                    visible={!!mode}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({ mode: 0 })
                    }}
                    onSubmit={this.handlers.onSubmit}
                    formData={formData}
                    defaultData={data}
                />
                
            </div>
        )
    }
}
export default Index
