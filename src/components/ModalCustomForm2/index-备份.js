/**
 * @author YM
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Modal,Select,Form,Input,Switch } from 'antd'
import './index.scss'
import Storage from '../../utils/Storage'
// import SystemUtil from '../../utils/SystemUtil';
 class ModalCustomForm extends Component {
    static propTypes = {}

    constructor(props) {
        super(props)
        this.state = {
            errors: null,
            confirmLoading: false,
            currentType:'',
            actionTargetType:'',
            axisList:[],
            pointList:[],
            outInfList:[],
        }
    }

    componentDidMount() {
    }

    handlers = {}

    handleSubmit = (e) => {
        e.preventDefault();
        const { onCancel,actionId,onSubmit } = this.props;
        let { currentType } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                onSubmit(values)
                onCancel();
            }
        });
    }
    
    handleSelectChange = (name,value) => {
        let self = this;
        if(name =='actionsType'){//切换运动模式，轴复位,点位复位
            this.props.form.setFieldsValue({
                axis:null,
                points:[],
            });
            this.setState({
                currentType:value,
                actionTargetType:'',
                pointList:[],
            })
        }else if( name =='actionTargetType' ){//轴点位移动时，目标类型切换
            this.setState({
                actionTargetType:value
            })
        }else if( name =='axis' ){//切换轴的时候，点位列表切换
            this.props.axisList.forEach(function(item){
                if(item.id == value){
                    self.setState({
                        pointList:item.pointList
                    },()=>{
                        self.props.form.setFieldsValue({
                            points:[],//设置点位时多选，默认值
                        });
                    })
                }
            })
            
        }
       
    }

    componentWillReceiveProps(nextprops){
    }
    _onCancel(){
        this.props.onCancel();
    }

    render() {
        const { onSubmit, onCancel, defaultData,actionId, ...rest } = this.props
        const { confirmLoading } = this.state
        const Option = Select.Option;
        const { getFieldDecorator } = this.props.form;

        const children = [];
        for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        }

        return (
        <Modal
            cancelText="取消"
            okText="确定"
            confirmLoading={confirmLoading}
            {...rest}
            onCancel={ this._onCancel.bind(this) }
            onOk={this.handleSubmit.bind(this)}
        >
            {/* 添加动作 */}
                <div >
                    <Form>
                        <Form.Item
                            label="动作类型"
                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('actionsType', {rules: [{ required: true, message: 'Please select your actionsType!' }],})(
                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'actionsType')}>
                                    {
                                        this.props.actionsType.map(function(item){
                                            return(
                                                <Option value={item.type} key={item.type}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>

                        {
                            /*选择轴口的情况---1回原点,2,3 */
                            this.state.currentType =='axisGoHome' 
                                ||  this.state.currentType =='axisMove' 
                                ||  this.state.currentType =='axisMoveTorque' 
                            ?
                                <Form.Item
                                    label="选择轴口"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('axis', {rules: [{ required: true, message: 'Please select your gender!' }],})(
                                        <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'axis')}>
                                            {
                                                this.props.axisList.map(function(item){
                                                    return(
                                                        <Option value={item.id} key={item.id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            :
                                null
                        } 
                           
                       
                        {
                            this.state.currentType =='axisMove'?
                                <Form.Item
                                    label="目标类型"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('actionTargetType')(
                                        <Select  style={{ width: 120 }} onChange={this.handleSelectChange.bind(this,'actionTargetType')}>
                                            <Option value='1'>原点</Option>
                                            <Option value='2'>安全位</Option>
                                            <Option value='3'>自定义点位</Option>
                                            {/* 3->选择点位 */}
                                        </Select>
                                    )}
                                </Form.Item>    
                            :
                                null
                        }


                        {
                            ( this.state.actionTargetType =='3' && this.state.currentType =='axisMove' ) || this.state.currentType =='axisMoveTorque'?
                                <Form.Item
                                    label="选择点位"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >   
                                 {getFieldDecorator('points', {rules: [{required: true, message: 'Please select your point!' }],})(
                                         <Select
                                            mode="multiple"
                                            placeholder="Please select points"
                                            style={{ width: '100%' }}
                                            >
                                            {
                                                this.state.pointList &&this.state.pointList.axisPoint&&this.state.pointList.axisPoint.length>0 ?    
                                                    this.state.pointList.axisPoint.map(function(item){
                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.pointName}</Option>
                                                        )
                                                    })
                                                    :
                                                    (
                                                        this.state.pointList && this.state.pointList.axisPoint && this.state.pointList.axisPoint.id
                                                        ?
                                                            <Option value={this.state.pointList.axisPoint.id} key={this.state.pointList.axisPoint.id}>{this.state.pointList.axisPoint.pointName}</Option>
                                                            :
                                                            ''
                                                    )
                                            }
                                        </Select>
                                    )}
                                   
                                </Form.Item>
                            :
                                null
                        }

                        {
                            this.state.currentType =='axisMove'?
                                <Form.Item
                                    label="速度"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('speed')(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }    



                        {
                            this.state.currentType =='setOut'?
                                <Form.Item
                                    label="选择O口"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('infId', {rules: [{ required: true, message: 'Please select your infId!' }],})(
                                        <Select  style={{ width: 210 }} >
                                            {
                                                this.props.outInfList.map(function(item){
                                                    return(
                                                        <Option value={item.id} key={item.id}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            :
                                null
                        }    
                        {
                            this.state.currentType =='setOut'?
                                <Form.Item
                                    label="值"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('value',{initialValue: defaultData && defaultData.value?true:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.value?true:false} />
                                    )}
                                </Form.Item>
                            :
                                null
                        }    


                        {
                            this.state.currentType =='axisMoveTorque'?
                                <Form.Item
                                    label="压合量(mm)"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('fitDist', {rules: [{ required: true, message: 'Please input your fitDist!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }    

                        {
                            this.state.currentType =='axisMoveTorque'?
                                <Form.Item
                                    label="扭力百分比"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('torquePercent', {rules: [{ required: true, message: 'Please input your torquePercent!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }   

                        {
                            this.state.currentType =='timeDelay'?
                                <Form.Item
                                    label="延时时间"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('delayTime', {rules: [{ required: true, message: 'Please input your 延时时间!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }     
                    </Form>
                </div>
        </Modal>
        )
    }
}

const WrappedApp = Form.create()(ModalCustomForm);

export default WrappedApp