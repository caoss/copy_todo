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
        infList:[],
        axisState:'',
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextprops){
        let self= this;
        if( nextprops && nextprops.defaultData && nextprops.defaultData.criterionType2){
            if(nextprops.defaultData.axisState){
                this.setState({
                    axisState:nextprops.defaultData.axisState
                })
            }
            if(nextprops.defaultData.infType){
                let infType = '';
                switch(nextprops.defaultData.infType-0){
                    case 1:
                        infType='in';
                        break;
                    case 2:
                        infType='out';
                        break;
                    case 3:
                        infType='ain';
                        break;
                    case 4:
                        infType='aout';
                        break;
                    default:
                        break;
                }
                this.setState({
                    infList:this.props.infObj[infType]
                })
            }
            this.setState({
                currentType:nextprops.defaultData.criterionType2,
            })

        }
    }

    handleSelectChange = (name,value) => {
        let self = this;
        if(name =='criterionType2'){//
            this.setState({
                currentType:value,
            })
        }

        if(name =='infType'){
            console.log('--------cm',this.state.infObj,value );
            let { getPortList } = this.props;
            // getPortList({interfaceType:value }).then(res=>{
            //     console.log( 'infList---',res );
            //     this.setState({
            //         infList:res
            //     })
            // })
            let infType = '';
            switch(value-0){
                case 1:
                    infType='in';
                    break;
                case 2:
                    infType='out';
                    break;
                case 3:
                    infType='ain';
                    break;
                case 4:
                    infType='aout';
                    break;
                default:
                    break;
            }
            this.setState({
                infList:this.props.infObj[infType]
            })
            this.props.form.setFieldsValue({
                infId:'',
            });
        }

        if(name=='axisState'){
            this.setState({
                axisState:value
            })
        }
    }


    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('values----',values)
            if (!err) {
                this.props.onSubmit(values);
                this.props.onCancel();
                this.props.form.resetFields();
                // this.props.form.setFieldsValue({
                //     criterionType:'',
                // });
                // this.setState({
                //     currentType:''
                // })
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
        const { formData, onCancel, defaultData, ...rest } = this.props
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
                    onCancel={()=>{ 
                        onCancel();
                        this.props.form.resetFields();
                        }}
                    onOk={this.handleSubmit.bind(this)}
                >
                    <Form>
                        <Form.Item
                                label="条件类型2"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >
                                {getFieldDecorator('criterionType2', {initialValue:defaultData && defaultData.criterionType2?defaultData.criterionType2+'':'',rules: [{ required: true, message: '请选择条件类型!' }],})(
                                    <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'criterionType2')}>
                                        {
                                            this.props.criterionType2.map(function(item){
                                                return(
                                                    <Option value={item.type} key={item.type}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
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
                                            {getFieldDecorator('param', { initialValue:defaultData && defaultData.param?defaultData.param-0:'', rules: [{ required: true, message: '请选择参数类型!' }],})(
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
                                        label="选择轴口"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('axis',{ initialValue:defaultData && defaultData.axis?defaultData.axis-0:'', rules: [{ required: true, message: '请选择轴!' }],} )(
                                            <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'axis')}>
                                                {
                                                    this.props.axisList.map(function(item){
                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    

                                    <Form.Item
                                            label="轴条件"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('axisState', {initialValue:defaultData && defaultData.axisState?defaultData.axisState+'':'',rules: [{ required: true, message: '请选择轴口类型!' }],})(
                                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'axisState')}>
                                                    <Option value={'1'}> 轴原点 </Option>
                                                    <Option value={'2'}> 轴位置 </Option>
                                                    <Option value={'3'}> 轴状态 </Option>
                                                </Select>
                                            )}
                                    </Form.Item>
                                                
                                    
                                    {
                                        this.state.axisState =='1' ?
                                            <Form.Item
                                                label="轴是否已找到原点"
                                                labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                            >
                                                {getFieldDecorator('alreadyGoHome',{initialValue: defaultData && defaultData.alreadyGoHome?true:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.value?true:false} />
                                                )}
                                            </Form.Item>
                                        :
                                        this.state.axisState =='2'?
                                            <div>
                                                <Form.Item
                                                    label="条件"
                                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                                >
                                                {getFieldDecorator('condition', {initialValue:defaultData && defaultData.condition?defaultData.condition+'':'',rules: [{ required: true, message: 'Please select your gender!' }],})(
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
                                                    label="轴的实时反馈位置"
                                                    labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                                >
                                                    {getFieldDecorator('realTimeMPos',{rules: [{ required: true, message: 'Please select your value!' }],initialValue:defaultData && defaultData.realTimeMPos?defaultData.realTimeMPos:''})(
                                                    <Input />
                                                    )}
                                                </Form.Item>
                                            </div>
                                        :
                                        this.state.axisState =='3'?

                                            <Form.Item
                                                label="轴的状态"
                                                labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}
                                            >
                                                {getFieldDecorator('isIdle',{initialValue: defaultData && defaultData.isIdle?true:false,rules: [{required: true, message: '请选择轴的状态!' }],})(
                                                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.value?true:false} />
                                                )}
                                            </Form.Item>
                                        :null  
                                    }

                                </div>
                            :
                                null
                        }


                        {
                            this.state.currentType=='3'?
                                <div>
                                    <Form.Item
                                            label="口的类型"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('infType', {initialValue:defaultData && defaultData.infType?defaultData.infType+'':'',rules: [{ required: true, message: '请选择轴口类型!' }],})(
                                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'infType')}>
                                                    <Option value={'1'}> in </Option>
                                                    <Option value={'3'}>ain</Option>
                                                    <Option value={'4'}>aout</Option>
                                                    <Option value={'2'}>out</Option>
                                                </Select>
                                            )}
                                    </Form.Item>

                                    <Form.Item
                                            label="口"
                                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('infId', {initialValue:defaultData && defaultData.infId?defaultData.infId-0:'',rules: [{ required: true, message: 'Please select your value!' }],})(
                                                <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'infId')}>
                                                    {
                                                        this.state.infList && this.state.infList.length>0?
                                                        this.state.infList.map(function(item){
                                                            return(
                                                                <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
                                                            )
                                                        })
                                                        :
                                                        null
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
                                    {getFieldDecorator('condition', {initialValue:defaultData && defaultData.condition?defaultData.condition+'':'',rules: [{ required: true, message: 'Please select your gender!' }],})(
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