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
        confirmLoading: false,
    
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextprops){
       
    }
      //添加动作条件流程
      handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values)
                this.props.onCancel();
            }
        });
    }


    render() {
        const { formData, onSubmit, onCancel, defaultData, ...rest } = this.props
        const { confirmLoading } = this.state
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;

        console.log('default',defaultData);
        return (
            <div>
                <Modal
                    cancelText="取消"
                    okText="确定"
                    confirmLoading={confirmLoading}
                    {...rest}
                    onCancel={()=>{ 
                        this.props.form.resetFields();
                        onCancel();
                    }}
                    onOk={this.handleSubmit.bind(this)}
                >
                    <Form>
                        <Form.Item
                            label="选择O口"
                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('infId', { initialValue:defaultData && defaultData.infId?defaultData.infId-0:'', rules: [{ required: true, message: 'Please select your infId!' }],})(
                                <Select 
                                style={{ width: 210 }} >
                                    {
                                        this.props.outInfList.map(function(item){
                                            return(
                                                <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
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
                                {getFieldDecorator('value',{initialValue:defaultData&&defaultData['value'] && defaultData['value'] == 'on'?true:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                    <Switch checkedChildren="手动" unCheckedChildren="自动" checked={defaultData&& defaultData['value'] && defaultData['value'] == 'on'?true:false}  />
                                )}
                            </Form.Item>

                    </Form>

                </Modal>
            </div>
        )
    }
}


const ModalAddCondition1 = Form.create()(ModalAddCondition);
export default ModalAddCondition1