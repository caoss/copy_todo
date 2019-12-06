/**
 * @author 
 * 添加动作
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Modal,Select,Form,Input,Switch,message,Button,Popconfirm  } from 'antd'
import './index.scss'

 class ModalCustomForm extends Component {
    static propTypes = {}

    constructor(props) {
        super(props)
        this.state = {
            currentType:0,
            currentArcType:0,
        }
    }

    componentDidMount() {
    }

    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        const { onCancel,onSubmit } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let { jetDelay,speed,needleHeight,pointId,pointType} = values;
                let obj  = { jetDelay,speed, needleHeight,pointId ,pointType} ;
                let {arcType,direction,radiusStr} = values;
                obj.extParams = JSON.stringify({arcType,direction,radiusStr});
                onSubmit({},obj).then(res=>{
                    console.log('成功-----------',res);
                    onCancel();
                })
            }
        });
    }
    
    handleSelectChange = (name,value) => {
        console.log(name,value);
        let self = this;
        if(name =='pointType'){//切换运动模式，轴复位,点位复位
            this.setState({
                currentType:value,
            })
        }else if(name =="arcType"){
            this.setState({
                currentArcType:value,
            })
        }
    }

    componentWillReceiveProps(nextprops){
        if(this.props.defaultData && nextprops.defaultData && nextprops.defaultData.id && this.props.defaultData.id != nextprops.defaultData.id){
            let defaultData = nextprops.defaultData;
            console.log("defaultData",defaultData);
            this.setState({
                currentType:defaultData.pointType,
            })
            if(defaultData.extParams&&JSON.parse(defaultData.extParams)){
                this.setState({
                    currentArcType:JSON.parse(defaultData.extParams).arcType,
                })
            }

        }
    }

    _onCancel(){
        this.props.onCancel();
        this.setState({
            outInfList:[],
            currentType:'',
            destType:'',
            pointList:[],
        })
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

  
    render() {
        let self = this;
        const { onSubmit, onCancel, defaultData,actionId,paramsData,...rest } = this.props
        const { confirmLoading } = this.state
        const { getFieldDecorator } = this.props.form;

        let obj1 = this.props.formData&&this.props.formData.length>=5?this.props.formData[0]:{};
        let obj2 = this.props.formData&&this.props.formData.length>=5?this.props.formData[1]:{};

        let parms = defaultData&&defaultData.extParams?JSON.parse(defaultData.extParams):{};
        console.log( parms );
        

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
                            label="点位ID"
                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('pointId', {initialValue:defaultData ? defaultData.pointId:'',rules: [{ required: true, message: 'Please select your pointId!' }],})(
                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'pointId')}>
                                    {
                                        obj1 && obj1.items?
                                        obj1.items.map(function(item){
                                            return(
                                                <Option value={item.value} key={item.value}>{item.label}</Option>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="点位类型"
                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('pointType', {initialValue:defaultData ? defaultData.pointType:'',rules: [{ required: true, message: 'Please select your pointType!' }],})(
                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'pointType')}>
                                    {
                                        obj2 && obj2.items?
                                        obj2.items.map(function(item){
                                            return(
                                                <Option value={item.value} key={item.value}>{item.label}</Option>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        
                        <Form.Item
                            label="抬针高度(mm,绝对值)"
                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('needleHeight', {initialValue:defaultData ? defaultData.needleHeight:'',rules: [{required: true, message: 'Please input your needleHeight!' }], })(
                            <Input type="number" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="出胶延时(s)"
                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('jetDelay', {initialValue:defaultData ? defaultData.jetDelay:'',rules: [{required: true, message: 'Please input your jetDelay!' }], })(
                            <Input type="number" />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="速度(mm/s)"
                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('speed', {initialValue:defaultData ? defaultData.speed:'',rules: [{required: true, message: 'Please input your speed!' }], })(
                            <Input type="number" />
                            )}
                        </Form.Item>
                        
                        {
                            this.state.currentType =='8'?
                            <div>
                                <Form.Item
                                    label="圆弧类型"
                                    labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('arcType', {initialValue:parms ? parms.arcType:'',rules: [{ required: true, message: 'Please select your arcType!' }],})(
                                        <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'arcType')}>
                                            <Option value={1}>圆</Option>
                                            <Option value={2}>椭圆</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="圆弧方向"
                                    labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('direction', {initialValue:parms ? parms.direction:'',rules: [{ required: true, message: 'Please select your direction!' }],})(
                                        <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'direction')}>
                                            <Option value={1}>顺时针</Option>
                                            <Option value={2}>逆时针</Option>
                                        </Select>
                                    )}
                                </Form.Item>

                                {
                                    this.state.currentArcType && this.state.currentArcType ==2?
                                        <Form.Item
                                            label="椭圆半径"
                                            labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}
                                        >
                                            {getFieldDecorator('radiusStr', {initialValue:parms ? parms.radiusStr:'',rules: [{required: true,message: 'Please input your radiusStr!' }], })(
                                            <Input type="" placeholder="格式: a,b "/>
                                            )}
                                        </Form.Item>
                                    :
                                    null
                                }
                               

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

const WrappedApp = Form.create()(ModalCustomForm);

export default WrappedApp