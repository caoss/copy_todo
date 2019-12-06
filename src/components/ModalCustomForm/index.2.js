/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, message,Select,Form,Input,Button  } from 'antd'
import './index.scss'
import CustomForm from '../CustomForm/index'

export default class ModalCustomForm extends Component {
    static propTypes = {}
    constructor(props) {
        super(props)
        this.state = {
            errors: null,
            confirmLoading: false,
            currentType:'axisAllStop',
            actionsType:[
                {
                    type:'axisAllStop',//不需要其它条件
                    name:'所有轴减速停止'
                },
                {
                    type:'axisGoHome',//需要选择轴口
                    name:'轴找原点',
                },
                {
                    type:'axisMove',//需要选择轴口，目标类型 1:原点, 2:安全位, 3:自定义点位，非必需;点位标识，非必需,speed 速度，非必需
                    name:'轴点位移动'
                },
                {
                    type:'axisMoveTorque',
                    name:'轴点位移动(扭矩模式)'
                },
                {
                    type:'setOut',
                    name:'Out信号设置'
                },
                {
                    type:'timeDelay',
                    name:'延时'
                },
            ]
        }
    }

    componentDidMount() {}

    handlers = {}

    handleChange(value) {
        console.log(`selected ${value}`);
        this.setState({
            currentType:value
        })
    }
    handleChange2(value) {
        console.log(value);
    }

    render() {
        const { formData, onSubmit, onCancel, defaultData, ...rest } = this.props
        const { confirmLoading } = this.state
        const Option = Select.Option;
        return (
        <Modal
            cancelText="取消"
            okText="确定"
            confirmLoading={confirmLoading}
            {...rest}
            onCancel={onCancel}
            onOk={() => {
                alert(1111)
            }}
        >
            {/* 添加动作 */}
                <div >
                    <Form layout='inline'>
                        <div>
                            <Form.Item  label="动作类型" >
                                <Select defaultValue={this.state.actionsType[0].type} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                                    {
                                        this.state.actionsType.map(function(item){
                                            return(
                                                <Option value={item.type} key={item.type}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </div>

                        {
                            this.state.currentType =='axisGoHome'?
                                <div>
                                    <Form.Item  label="选择轴口" >
                                        <Button type="primary">选择轴口</Button>
                                    </Form.Item>
                                </div>
                            :
                            null
                        }

                        {
                            this.state.currentType =='axisMove'?
                                <div>
                                    <Form.Item  label="选择点位" >
                                        <Button type="primary">选择点位</Button>
                                    </Form.Item>
                                </div>
                            :
                            null
                        }

                        
                        {
                            this.state.currentType =='axisMove'?
                                <div>
                                    <Form.Item  label="选择I/O口" >
                                        <Button type="primary">选择I/O口</Button>
                                    </Form.Item>
                                </div>
                            :
                            null
                        }

                        {
                            this.state.currentType =='axisMove'?
                                <div>
                                    <Form.Item  label="值" >
                                        <Input placeholder="Basic usage"  onChange={this.handleChange2.bind(this)}/>
                                    </Form.Item>
                                </div>
                            :
                            null
                        }

                                 
                    </Form>
                </div>
        </Modal>
        )
    }
}
