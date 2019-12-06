/**
 * @author 
 * 添加动作
 */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Modal,Select,Form,Input,Switch,message,Button,Popconfirm  } from 'antd'
import './index.scss'
import Storage from '../../utils/Storage'
import ModalAddCondition2 from './add' 

// import SystemUtil from '../../utils/SystemUtil';
 class ModalCustomForm extends Component {
    static propTypes = {}

    constructor(props) {
        super(props)
        this.state = {
            errors: null,
            confirmLoading: false,
            currentType:'',
            destType:'',
            pointList:[],
            outInfList:[],
            stepType:'',
            workSpeed:null,
            mode:false,
            inList:[],
            defaultData:{},
        }
    }

    componentDidMount() {
    }

    handlers = {}

    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        const { onCancel,onSubmit } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                // console.log('Received values of form: ', values,this.state.outInfList);
                if( values.stepType=='7'&& this.state.outInfList.length>0 ){
                    values.extParams =  JSON.stringify(this.state.outInfList);                    
                }else if(values.stepType=='7'){
                    message.error('out信号设置需要添加O口信息');
                    return;
                }
                if(values.stepType=='10'){
                    values.value = values.value?"on":'off'
                }
                console.log('Received values of form: ', values);
                onSubmit(values).then(res=>{
                    console.log('成功-----------',res);
                    onCancel();
                })
            }
        });
    }
    
    handleSelectChange = (name,value) => {
        console.log(name,value);
        let self = this;
        if(name =='stepType'){//切换运动模式，轴复位,点位复位
            this.setState({
                currentType:value,
                destType:'',
                pointList:[],
                stepType:value,
            },()=>{
                this.props.form.setFieldsValue({
                    axis:null,
                    points:[],
                    stepName:'',
                    timeout:(value=='4'|| value=='5'||value=='6'?60:value=='3'?5:value=='7'?0.5:null),
                    destType:'',
                    torquePercent:'',
                    fitDist:''
                });
            })
        }else if( name =='destType' ){//轴点位移动时，目标类型切换
            this.setState({
                destType:value
            })
        }else if( name =='axis' ){//切换轴的时候，点位列表切换
            let {getPointList,getAxisInfo} = this.props;
            
            if( this.state.stepType == 5 ){
                getAxisInfo(value).then(res=>{
                    this.setState({
                        workSpeed:res.workSpeed
                    })
                })
            }
            getPointList(value).then((res)=>{
                self.setState({
                    pointList:res
                },()=>{
                    self.props.form.setFieldsValue({
                        pointId:'',//设置点位时多选，默认值
                    });
                })
            });
            
        }
       
    }

    componentWillReceiveProps(nextprops){
        let {getPointList} = this.props;
        if(this.props.defaultData && nextprops.defaultData && nextprops.defaultData.id && this.props.defaultData.id != nextprops.defaultData.id){
            let defaultData = nextprops.defaultData;
            if(defaultData&& defaultData.extParams &&  JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['axisId'] ){
                getPointList(JSON.parse(defaultData.extParams)['axisId']).then((res)=>{
                    this.setState({
                        pointList:res,
                    })
                });
            }
            if(defaultData && defaultData.extParams &&  JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['pointId'] ){
                this.setState({
                    destType:3,
                })
            }
            if(defaultData&&defaultData.stepType=='7'&& defaultData.extParams && JSON.parse(defaultData.extParams)){
                console.log('defaultData.extParams',JSON.parse(defaultData.extParams));
                this.setState({
                    outInfList:JSON.parse(defaultData.extParams),
                })
            }
            this.setState({
                currentType:defaultData.stepType,
            })

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

      //条件项弹窗相关操作
    handlers2 = {
        _onCancel(){
            this.setState({
                mode:false,
                defaultData:{}
            })
        },
        _submit(parms){
            parms.value = parms.value ?'on':'off';
            let arr =[];
            arr.push(parms);
            this.setState({
                outInfList:this.state.outInfList.concat(arr)
            },()=>{
                console.log('outInfList',this.state.outInfList);
            })
        },
        onChange(){
            console.log('change-----------------');
        }
    }
    _delOutInf(i){
        let arr = this.state.outInfList;
        arr.splice(i,1)
        this.setState({
            outInfList:arr
        })
    }

    _editOut(item){
        this.setState({
            defaultData:item,
            mode:2
        })
    }
    render() {

        console.log('traceList---------', this.props.traceList);
        let self = this;
        const { onSubmit, onCancel, defaultData,actionId,paramsData,selAxisList,partsList,...rest } = this.props
        const { confirmLoading,pointList,mode,outInfList,currentType } = this.state
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
                            {getFieldDecorator('stepType', {initialValue:defaultData ? defaultData.stepType:'',rules: [{ required: true, message: 'Please select your stepType!' }],})(
                                <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'stepType')}>
                                    {
                                        this.props.actionsType.map(function(item){
                                            return(
                                                <Option value={item.stepType} key={item.stepType}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        
                        {
                            this.state.currentType =='12' || this.state.currentType =='3'|| 
                            this.state.currentType =='9'|| this.state.currentType =='10' ||
                            this.state.currentType =='4' ||this.state.currentType =='5' ||
                            this.state.currentType =='6'||this.state.currentType =='8'||
                            this.state.currentType =='20'?
                            null
                            :
                            <Form.Item
                                label="动作名称"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >
                                {getFieldDecorator('stepName', {initialValue:defaultData ? defaultData.stepName:'',rules: [{ message: 'Please input your 动作名称!' }], })(
                                <Input />
                                )}
                            </Form.Item>
                        }

                        {
                            /*选择轴口的情况---1回原点,2,3 */
                            this.state.currentType =='4' 
                                ||  this.state.currentType =='5' 
                                ||  this.state.currentType =='6' 
                                ||  this.state.currentType =='12' 
                            ?
                                <Form.Item
                                    label="选择轴口"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('axis', {initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['axisId'] ? JSON.parse(defaultData.extParams)['axisId'] :'',rules: [{ required: true, message: 'Please select your stepType!' }],})(
                                        <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'axis')}>
                                            {
                                                this.props.axisList.map(function(item){
                                                    if( selAxisList.includes(item.id)){

                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
                                                        )
                                                    }
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            :
                                null
                        } 
                           
                       
                        {
                            this.state.currentType =='5' 
                            ?
                                <Form.Item
                                    label="目标类型"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('destType',{ initialValue: defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['destType']?JSON.parse(defaultData.extParams)['destType']:'' })(
                                        <Select  style={{ width: 120 }} onChange={this.handleSelectChange.bind(this,'destType')}>
                                            <Option value={1}>原点</Option>
                                            <Option value={2}>安全位</Option>
                                            <Option value={3}>自定义点位</Option>
                                            {/* 3->选择点位 */}
                                        </Select>
                                    )}
                                </Form.Item>    
                            :
                                null
                        }

                        {
                            ( this.state.destType =='3' && this.state.currentType =='5' )
                            ?
                                <Form.Item
                                    label="选择点位"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >   
                                 {getFieldDecorator('pointId', { initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['pointId']?JSON.parse(defaultData.extParams)['pointId']:''
                                     ,rules: [
                                      {required: true, message: 'Please select your point!' }],})(
                                         <Select
                                            // mode="multiple"
                                            placeholder="Please select point"
                                            style={{ width: '100%' }}
                                            >
                                            {
                                                pointList && pointList.length>0 ?    
                                                    pointList.map(function(item){
                                                        return(
                                                            <Option value={item.pointId} key={item.pointId}>{item.pointName}</Option>
                                                        )
                                                    })
                                                    :
                                                    null
                                            }
                                        </Select>
                                    )}
                                   
                                </Form.Item>
                            :
                                null
                        }

                        {
                            this.state.currentType =='5' ||
                            this.state.currentType =='12'
                            ?
                                <Form.Item
                                    label="速度"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('speed',{ 
                                        initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['speed']?JSON.parse(defaultData.extParams)['speed']:this.state.workSpeed
                                    })(
                                        
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }   

                        {
                            this.state.currentType =='7'?
                                <div>
                                    {
                                        outInfList && outInfList.length>0?
                                            outInfList.map((item,i)=>{
                                                return(
                                                    <div key={i}>
                                                        {JSON.stringify(item)}  
                                                    <Popconfirm
                                                        title="确定删除此条件?"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onConfirm={  self._delOutInf.bind(self,i)  }
                                                    >
                                                        <Button  style={{ 'magin':'0 10px' }} type="danger"  icon="delete"/> 
                                                    </Popconfirm>
                                                    <Button onClick={self._editOut.bind(self,item)} type="edit"  icon="edit"/> 
                                                    </div>
                                                )
                                            })
                                        :
                                        null
                                    }
                                    <Button onClick={ ()=>{ this.setState({mode:true})}}  icon="plus" >
                                        添加
                                    </Button>
                                </div>
                            :
                                null
                        }    

                        {
                            this.state.currentType =='6' 
                            ?
                                <Form.Item
                                    label="压合量(mm)"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('fitDist', { initialValue: defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['fitDist']?JSON.parse(defaultData.extParams)['fitDist']:'',rules: [{required: true, message: 'Please input your fitDist!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }    

                        {
                            this.state.currentType =='6'
                            ?
                                <Form.Item
                                    label="扭力百分比"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('torquePercent', {
                                        initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['torquePercent']?JSON.parse(defaultData.extParams)['torquePercent']:''
                                        ,rules: [{required: true, message: 'Please input your torquePercent!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }   

                        {
                            this.state.currentType =='8'?
                                <Form.Item
                                    label="延时时间"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                    {getFieldDecorator('delay', {
                                        initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['delay']?JSON.parse(defaultData.extParams)['delay']:''
                                        ,rules: [{ required: true, message: 'Please input your 延时时间!' }], })(
                                    <Input />
                                    )}
                                </Form.Item>
                            :
                                null
                        }
                          {              
                            /*检查信号 */
                                this.state.currentType =='13' 
                            ?
                            <div>
                                <Form.Item
                                    label="工位"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                      {getFieldDecorator('cubeId', {initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['cubeId'] ? JSON.parse(defaultData.extParams)['cubeId'] :'',rules: [{ required: true, message: 'Please select your cube!' }],})(
                                        <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'cubeId')}>
                                            <Option value={1}>左工位</Option>
                                            <Option value={2}>右工位</Option>
                                            <Option value={3}>初定位</Option>
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label="拍照模式"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                      {getFieldDecorator('moveMode', {initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['moveMode'] ? JSON.parse(defaultData.extParams)['moveMode'] :'',rules: [{ required: true, message: 'Please select your moveMode!' }],})(
                                        <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'moveMode')}>
                                            <Option value={1}>不移动</Option>
                                            <Option value={2}>移动1次</Option>
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label="信号"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                {getFieldDecorator('signal',{ 
                                            initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['signal']?JSON.parse(defaultData.extParams)['signal']:null
                                            ,rules: [{required: true, message: 'Please select your signal!' }] })(
                                    <Input />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="NG指令"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                {getFieldDecorator('ngCmd',{ 
                                            initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['ngCmd']?JSON.parse(defaultData.extParams)['ngCmd']:null
                                        ,rules: [{required: true, message: 'Please select your ngCmd!' }] })(
                                    <Input />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="OK指令"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                {getFieldDecorator('okCmd',{ 
                                            initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['okCmd']?JSON.parse(defaultData.extParams)['okCmd']:null
                                            ,rules: [{required: true, message: 'Please select your oKCmd!' }],})(
                                    <Input />
                                    )}
                                </Form.Item>
                            </div>
                            :
                                null
                        } 
                        
                       

                        {
                            this.state.currentType =='9'?
                                <div>
                                    <Form.Item
                                        label="气缸"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('partId', {initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['partId']?JSON.parse(defaultData.extParams)['partId']:'',rules: [{ required: true, message: 'Please select your partId!' }],})(
                                            <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'partId')}>
                                                {
                                                    this.props.partList.map(function(item){
                                                        if( partsList.includes(item.id)){
                                                            return(
                                                                <Option value={item.id} key={item.id}>{item.partName}</Option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="目标点位"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('destType', {initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['destType']?JSON.parse(defaultData.extParams)['destType']:'',rules: [{ required: true, message: 'Please select your destType!' }],})(
                                            <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'destType')}>
                                                <Option value={1}>原点</Option>
                                                <Option value={2}>动点</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }
                        {
                            this.state.currentType =='10'?
                                <div>
                                    <Form.Item
                                        label="真空气压表"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('partId', {initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['partId']?JSON.parse(defaultData.extParams)['partId']:'',rules: [{ required: true, message: 'Please select your partId!' }],})(
                                            <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'partId')}>
                                                {
                                                    this.props.partList2.map(function(item){
                                                        if( partsList.includes(item.id)){
                                                            return(
                                                                <Option value={item.id} key={item.id}>{item.partName}</Option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        label="操作"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >   
                                        {getFieldDecorator('value',{initialValue:defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['value']&&JSON.parse(defaultData.extParams)['value']=='on'?true:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData && defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['value']&&JSON.parse(defaultData.extParams)['value']=='on'?true:false}  />
                                        )}
                                    </Form.Item>
                                </div>
                            :
                                null
                        }

  
                        {              
                            /*检查信号 */
                                this.state.currentType =='12' 
                            ?
                                <div>
                                     <Form.Item
                                        label="定长距离"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                    {getFieldDecorator('dist',{ 
                                                initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['dist']?JSON.parse(defaultData.extParams)['dist']:null,
                                                rules: [{ required: true, message: 'Please select your dist!' }]
                                            })(
                                        <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="检查信号"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                          {getFieldDecorator('infIn', {initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['infIn'] ? JSON.parse(defaultData.extParams)['infIn'] :'',rules: [{ required: false, message: '？' }],})(
                                            <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'infIn')}>
                                                {
                                                    this.props.inList.map(function(item){
                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
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
                            /*检查信号 */
                                this.state.currentType =='11' 
                            ?
                            <div>
                                <Form.Item
                                    label="流程变量"
                                    labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                >
                                      {getFieldDecorator('paramId', {initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['paramId'] ? JSON.parse(defaultData.extParams)['paramId'] :'',rules: [{ required: true, message: 'Please select your paramId!' }],})(
                                        <Select  style={{ width: 210 }}  onChange={this.handleSelectChange.bind(this,'paramId')}>
                                            {
                                                this.props.paramsData.map(function(item){
                                                    return(
                                                        <Option value={item.id} key={item.id}>{item.param}</Option>
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
                               {getFieldDecorator('value',{ 
                                        initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['value']?JSON.parse(defaultData.extParams)['value']:null
                                    })(
                                <Input />
                                )}
                            </Form.Item>
                            </div>
                            :
                                null
                        } 

                         {
                             this.state.currentType =='1'||this.state.currentType =='9'||this.state.currentType =='11'|| this.state.currentType =='10' ||
                            this.state.currentType =='2' || this.state.currentType =='8'||
                            this.state.currentType =='20'?
                             null
                            :
                            <Form.Item
                                label="超时时间(s)"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >
                                {getFieldDecorator('timeout',{initialValue:defaultData && defaultData.timeout?defaultData.timeout: (currentType == '3'?5:currentType=='4'?60:currentType=='9'?1:null )  })(
                                <Input />
                                )}
                            </Form.Item>
                        }
                      
                      {
                            this.state.currentType =='20' 
                            ?
                                <div>
                                    {/* <Form.Item
                                        label="胶阀出胶信号"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('glueValveOutId', { initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['glueValveOutId']?JSON.parse(defaultData.extParams)['glueValveOutId']:null,rules: [{ required: true, message: 'Please select your glueValveOutId!' }],})(
                                            <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'glueValveOutId')}>
                                                {
                                                    this.props.outInfList.map(function(item){
                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.interfaceName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>     */}
                                    <Form.Item
                                        label="轨迹标识"
                                        labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                                    >
                                        {getFieldDecorator('traceId', { initialValue:defaultData&&defaultData.extParams && JSON.parse(defaultData.extParams) && JSON.parse(defaultData.extParams)['traceId']?JSON.parse(defaultData.extParams)['traceId']:null,rules: [{ required: true, message: 'Please select your traceId!' }],})(
                                            <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'traceId')}>
                                                {
                                                    this.props.traceList.map(function(item){
                                                        return(
                                                            <Option value={item.id} key={item.id}>{item.traceName}</Option>
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
                            <Form.Item
                                label="使能标识"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >   
                                {getFieldDecorator('enableFlag',{initialValue: defaultData.enableFlag?defaultData.enableFlag:false,rules: [{required: true, message: 'Please select your value!' }],})(
                                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={defaultData.enableFlag?defaultData.enableFlag:false}  />
                                )}
                            </Form.Item>
                        }


                    </Form>

                    <ModalAddCondition2 
                        title="添加条件项"
                        visible={ !!mode }
                        onCancel={ this.handlers2._onCancel.bind(this) }
                        onSubmit={this.handlers2._submit.bind(this)}
                        outInfList={ this.props.outInfList }
                        defaultData={this.state.defaultData}
                    />
                </div>
        </Modal>
        )
    }
}

const WrappedApp = Form.create()(ModalCustomForm);

export default WrappedApp