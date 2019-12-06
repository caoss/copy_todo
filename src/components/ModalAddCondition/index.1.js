/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form, Icon, Input, Button, Checkbox,Modal,Select,Switch
  } from 'antd';
import './index.scss'

class ModalAddCondition extends Component {
    static propTypes = {}

    state = {
        errors: null,
        confirmLoading: false,
        currentType:'',
        infType:'',
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextprops){
       
    }
    handleSelectChange = (name,value) => {
        console.log(name,value);
        let self = this;
        if(name =='criterionType'){//
            this.setState({
                currentType:value,
            })
        }
        if(name =='infType'){//
            this.setState({
                infType:value
            },()=>{
                this.props.form.setFieldsValue({
                    infId:'',
                });
            })
        }
    }


    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // onOk={this._onSubmit.bind(this)}
                // console.log('Received values of form: ', values);
                this.props.onSubmit(values);
                this.props.onCancel();
                this.props.form.setFieldsValue({
                    criterionType:'',
                });
                this.setState({
                    currentType:''
                })
            }
        });
    }

    onChange=()=>{
       var userName = this.props.form.getFieldValue('userName');
    }

    handlers = {}
    normalizeAll = (value, prevValue = []) => {
        return value;
    };


    render() {
        const { formData, onSubmit, onCancel, defaultData, ...rest } = this.props
        const { confirmLoading } = this.state
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        return (
            <div>
                <Modal
                    cancelText="取消"
                    okText="确定"
                    confirmLoading={confirmLoading}
                    {...rest}
                    onCancel={onCancel}
                    onOk={this.handleSubmit.bind(this)}
                >
                    <Form>
                        <Form.Item
                                label="条件类型"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >
                                {getFieldDecorator('criterionType', {initialValue:defaultData && defaultData.criterionType?defaultData.criterionType:'',rules: [{ required: true, message: '请选择条件类型!' }],})(
                                    <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'criterionType')}>
                                        {
                                            this.props.criterionType.map(function(item){
                                                return(
                                                    <Option value={item.type} key={item.type}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                        <Form.Item
                            label="与或"
                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('isAnd',{initialValue:true,rules: [{required: true, message: 'Please select your value!' }],})(
                                <Switch checkedChildren="与" unCheckedChildren="或" defaultChecked={true} />
                            )}
                        </Form.Item>

                        {/* 参数类型 */}
                        {
                            this.state.currentType=='1'?
                                <div>
                                    <Form.Item
                                            label="参数类型"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('param', {rules: [{ required: true, message: '请选择参数类型!' }],})(
                                                <Select  style={{ width: 210 }}>
                                                    {
                                                        this.props.paramList.map(function(item){
                                                            return(
                                                                <Option value={item.id} key={item.id}>{item.paramDesc}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }
                        {
                            this.state.currentType=='2'?
                                <div>
                                    {/* 轴 */}
                                    <Form.Item
                                        label="轴是否已找到原点"
                                        labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('alreadyGoHome',{initialValue: defaultData && defaultData.alreadyGoHome?true:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.value?true:false} />
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        label="轴的实时反馈位置"
                                        labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('realTimeMPos',{rules: [{ required: true, message: 'Please select your value!' }],initialValue:defaultData && defaultData.speed?defaultData.speed:''})(
                                        <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="轴的状态"
                                        labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('isIdle',{initialValue: defaultData && defaultData.isIdle?true:false,rules: [{required: true, message: '请选择轴的状态!' }],})(
                                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.value?true:false} />
                                        )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }


                        {
                            this.state.currentType=='3'?
                                <div>
                                    {/* 轴 */}
                                    <Form.Item
                                            label="口的类型"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('infType', {initialValue:defaultData && defaultData.criterionType?defaultData.criterionType:'',rules: [{ required: true, message: '请选择轴口类型!' }],})(
                                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'infType')}>
                                                    <Option value={'inInfList'}> in </Option>
                                                    <Option value={'aInInfList'}>ain</Option>
                                                    <Option value={'outInfList'}>aout</Option>
                                                    <Option value={'aOutInfList'}>out</Option>
                                                </Select>
                                            )}
                                    </Form.Item>
                                    <Form.Item
                                            label="口"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('infId', {initialValue:defaultData && defaultData.criterionType?defaultData.criterionType:'',rules: [{ required: true, message: 'Please select your value!' }],})(
                                                <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'infId')}>
                                                    {
                                                        this.state.infType && this.props.infList[this.state.infType].length>0?
                                                        this.props.infList[this.state.infType].map(function(item){
                                                            return(
                                                                <Option value={item.id} key={item.id}>{item.name}</Option>
                                                            )
                                                        })
                                                        :
                                                        (
                                                            this.state.infType &&this.props.infList[this.state.infType].id?
                                                                <Option value={this.props.infList[this.state.infType].id} >{this.props.infList[this.state.infType].name}</Option>
                                                                :
                                                                ''
                                                        )
                                                    }
                                                </Select>
                                            )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }

                        {
                            this.state.currentType=='4'?
                                <div>
                                    <Form.Item
                                        label="当前工作模式"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('workMode',{initialValue: defaultData && defaultData.workMode?true:false,rules: [{required: true, message: 'Please select your workMode!' }],})(
                                            <Switch checkedChildren="手动" unCheckedChildren="自动" defaultChecked={defaultData && defaultData.value?true:false} />
                                        )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }
                        {
                            this.state.currentType=='1' || this.state.currentType=='3'?
                                <div>
                                    <Form.Item
                                        label="条件"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                    {getFieldDecorator('condition', {initialValue:defaultData && defaultData.axis?defaultData.axis:'',rules: [{ required: true, message: 'Please select your gender!' }],})(
                                        <Select  style={{ width: 210 }}>
                                                {
                                                    this.props.condition.map(function(item){
                                                        return(
                                                            <Option value={item.value} key={item.value}>{item.name}</Option>
                                                        )
                                                    })
                                                }
                                        </Select>
                                    )}
                                    </Form.Item>
                                    <Form.Item
                                            label="值"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('value',{rules: [{ required: true, message: 'Please select your value!' }],initialValue:defaultData && defaultData.value?defaultData.value:''})(
                                            <Input />
                                            )}
                                    </Form.Item>
                                   
                                </div>
                            :
                                null
                        }



                    </Form>

                </Modal>
            </div>
        )
    }
}


const ModalAddCondition1 = Form.create()(ModalAddCondition);
export default ModalAddCondition1