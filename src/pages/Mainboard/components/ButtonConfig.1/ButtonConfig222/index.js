/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Card, Button, message,Row ,Col,Popconfirm,Icon} from 'antd'
import ModalCustomForm from '../../../../components/ModalCustomForm'
import CustomTable from '../../../../components/CustomTable'

import ModuleList from "./ModuleList"
import { toJS } from 'mobx';


@inject('store')
@observer
class Index extends Component {
    constructor(props) {
        super(props)
        const self = this
        const labelParam = {
            wrapperCol: {
                span: 16
            },
            labelCol: {
                span: 8
            }
        }
        this.state = {
            mode: 0,
            pagination: {},
            data: {},
            ioOptions: [],
            loading: false,
            columns: [
                {
                title: '按钮类型',
                dataIndex: 'buttonType',
                render(item, row, index) {
                    const types = [
                    { label: '开始', value: 1 },
                    { label: '停止', value: 2 },
                    { label: '急停', value: 3 },
                    { label: '复位', value: 4 }
                    ]

                    let res = '开始'

                    for (const r of types) {
                    if (r.value == row.buttonType) {
                        res = r.label
                    }
                    }
                    return <div>{res}</div>
                }
                },
                {
                title: '按钮信号对应输入口',
                dataIndex: 'infIn',
                render(item, row, index) {
                    let res = ''
                    for (const r of self.state.ioOptions) {
                    if (r.value == row.infIn) {
                        res = r.label
                    }
                    }
                    return <div>{res}</div>
                }
                },
                {
                title: '操作',
                dataIndex: 'id',
                key: 'x',
                render: (id, row, index) => (
                    <div>
                    <Button
                        type="primary"
                        style={{ marginRight: '8px' }}
                        onClick={() => {
                        self.setState({
                            data: row,
                            mode: 2
                        })
                        }}
                    >
                        编辑
                    </Button>
                    </div>
                )
                }
            ],
            formData: [
                {
                type: 'select',
                label: '按钮类型',
                valueKey: 'buttonType',
                required: true,
                value: 1,
                items: [
                    { label: '开始', value: 1 },
                    { label: '停止', value: 2 },
                    { label: '急停', value: 3 },
                    { label: '复位', value: 4 }
                ],
                ...labelParam
                },
                {
                type: 'select',
                label: '按钮信号对应输入口',
                valueKey: 'infIn',
                value: '',
                required: true,
                items: [],
                ...labelParam
                }
            ]
        }
    }

    componentDidMount() {
        const { mainboardStore } = this.props.store
        const softwareId = global.softwareId;
        mainboardStore.getIOPortList({
            softwareId,
            interfaceType: 1
        }).then(res => {
            const ioList = mainboardStore.ioPortData.list
            const items = []
            this.state.formData[1].items = items
            for (const r of ioList) {
            items.push({
                label: r.interfaceName,
                value: r.id
            })
            }
            this.state.ioOptions = items
            this.setState({
            formData: this.state.formData,
            ioOptions: items
            })
        })
        this._getModuleGroupList().then(res=>{
            console.log('res---',res);
            this.setState({
                ModuleList:res
            })
        });

        this.handlers.onTableChange();
    }

    
      _getModuleGroupList(){
            const { moduleGroupStore } = this.props.store
            return new Promise(function (resolve, reject) {
                moduleGroupStore.getList().then(res=>{
                    resolve(res)
                });
            });
        }
    

    handlers = {
        onSubmit: (err, values) =>
        new Promise((r, j) => {
            const { mainboardStore } = this.props.store
            const { mode, data } = this.state
            const softwareId = global.softwareId;
            if (!err) {
            if (mode === 1) {
                mainboardStore
                .createButton({ softwareId, ...values })
                .then(res => {
                    if (res.code === '0') {
                    r(res)
                    this.setState({
                        pagination: { current: 1 }
                    })
                    eventBus.emit('onTableChange')
                    } else {
                    j(res)
                    }
                })
                .catch(err => {
                    j(err)
                })
            } else {
                mainboardStore
                .editButton({ id: data.id, softwareId, ...values })
                .then(res => {
                    if (res.code === '0') {
                    r(res)
                    eventBus.emit('onTableChange')
                    } else {
                    j(res)
                    }
                })
                .catch(err => {
                    j(err)
                })
            }
            }
        }),
        removeButton: idList => {
            const { mainboardStore } = this.props.store
            mainboardStore.removeButton({ idList }).then(res => {
                if (res.code === '0') {
                message.success(res.message)
                eventBus.emit('onTableChange')
                } else {
                message.error(res.message)
                }
            })
        },
        onTableChange: (page, params) => {
            const { mainboardStore } = this.props.store
            const softwareId = global.softwareId;
            return new Promise((r, j) => {
                mainboardStore
                .getButtonList({
                    softwareId,
                })
                .then(res => {
                    r(res)
                })
                .catch(err => {
                    j(err)
                })
            })
        }
    }

    render() {
        let self = this;
        const { mainboardStore } = this.props.store
        const { formData, columns, mode, data, pagination } = this.state
        const buttonData = mainboardStore.buttonData
        const paginationData = Object.assign({}, pagination, {
        total: buttonData.total,
        showSizeChanger: true
        })
        const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.selection = selectedRows
        }
        }

        console.log(  buttonData.list );
        return (

            

<Card bordered={false} className="point-config">
        <Row type="flex">
            <Col span={8}>
                <div style={{ paddingBottom: '24px' }}>
                    <Button
                        type="primary"
                        style={{ marginRight: '8px' }}
                        onClick={() => {
                        this.setState({ mode: 1, data: {} })
                        }}
                    >
                        创建按钮
                    </Button>
                </div>
                <div style={{ paddingBottom: '24px' }}>
                {
                        buttonData.list && buttonData.list.length>0?
                        buttonData.list.map((item,i)=>{
                                return(
                                    <div style={{ marginBottom:'20px',cursor:'pointer' }}>
                                        <b>{ item.infName}</b>
                                            <Icon 
                                            onClick={() => {
                                                self.setState({
                                                    data: item,
                                                    mode: 2
                                                })
                                            }}
                                            style={{ 'cursor':'pointer',marginLeft:'20px'  }} type="edit" />
                                    </div>
                                )
                            })
                        :
                        null

                    }
                </div>
            </Col> 

            <Col span={16}>
                <ModuleList  data={ toJS(this.state.ModuleList) }/>
                <ModalCustomForm
                    title="按钮"
                    visible={!!mode}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({ mode: 0 })
                    }}
                    onSubmit={this.handlers.onSubmit}
                    formData={formData}
                    defaultData={data}
                />
            </Col>
        </Row>
      </Card>

        )
    }
}
export default Index
