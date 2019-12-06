/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form, Icon, Input, Button, Checkbox,Modal,Select,Switch,message,Popconfirm
  } from 'antd';
import './index.scss'
import ModalAddCriteria from './addCriteria' 

class ModalAddCondition extends Component {
    static propTypes = {}

    state = {
        errors: null,
        confirmLoading: false,
        currentType:'',
        infType:'',
        infList:[],
        mode:false,
        criterionList:[],
        defaultData:{},
        edit_index:null,
        infObj:{},
    }

    componentDidMount() {

        let { getPortList } = this.props;
        getPortList({interfaceType:1 }).then(res=>{
            this.setState({
                infObj:Object.assign({},this.state.infObj,{in:res})
            })
        })
        getPortList({interfaceType:2 }).then(res=>{
            this.setState({
                infObj:Object.assign({},this.state.infObj,{out:res})
            })
        })
        getPortList({interfaceType:3 }).then(res=>{
            this.setState({
                infObj:Object.assign({},this.state.infObj,{ain:res})
            })
        })
        getPortList({interfaceType:4 }).then(res=>{
            this.setState({
                infObj:Object.assign({},this.state.infObj,{aout:res})
            })
        })

    }

    componentWillReceiveProps(nextprops){
       if( nextprops.defaultData && nextprops.defaultData.criterionList && nextprops.defaultData.criterionList.length>0 && nextprops.editCriteraId){
           this.setState({
                criterionList:JSON.parse(nextprops.defaultData.criterionList)
           })
       }else{
            this.setState({
                criterionList:[]
            })
       }
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleSelectChange = (name,value) => {
        let self = this;
        if(name =='criterionType2'){//
            this.setState({
                currentType:value,
            })
        }
        if(name =='infType'){//
            let { getPortList } = this.props;
            getPortList({interfaceType:value }).then(res=>{
                this.setState({
                    infList:res
                })
            })
            this.props.form.setFieldsValue({
                infId:'',
            });
        }
    }


    //添加动作条件流程
    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.criterionList.length<=0){
                    message.error('条件项不能为空')
                    return;
                }
                values.criterionList = JSON.stringify(this.state.criterionList);
                this.props.onSubmit(values).then(res=>{
                    if (res.code == '0') {
                        this.props.onCancel();
                        // this.props.form.resetFields();
                        // this.setState({ criterionList:[]})
                    }
                });
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

    //条件项弹窗相关操作
    handlers2 = {
        _onCancel(){
            this.setState({
                mode:false,
                defaultData:{}
            })
        },
        _submit(parms){
            let str = '';
            let condition='';
            if(parms.condition){//条件
                switch( parms.condition ){
                    case '1':
                        condition = 'gt';
                        break;
                    case '2':
                        condition = 'ge'
                        break;
                    case '3':
                        condition = 'lt'
                        break;
                    case '4':
                        condition = 'le'
                        break;
                    case '5':
                        condition = 'eq'
                        break;
                    default:
                    break;
                }
            }
            if( parms.param ){//系统参数
                str = `param.${ parms.param } ${ condition } ${parms.value}`;
            }else if(parms.axis && parms.axisState ){//轴信息
                str = `axis.${ parms.axis }`;
                switch ( parms.axisState ) {
                    case '1':
                        str += ` alreadyGoHome ${ condition } ${ parms.alreadyGoHome }` ;
                        break;
                    case '2':
                        str += ` realTimeMPos ${ condition } ${ parms.realTimeMPos }` ;
                        break;
                    case '3':
                        str += ` isIdle eq ${ parms.isIdle }` ;
                        break;
                    default:
                        break;
                }
            }else if( parms.infId ){//口信息
                let infType ='';
                switch (parms.infType) {
                    case '1':
                        infType = 'in';
                        break;
                    case '2':
                        infType = 'out';
                        break;
                    case '3':
                        infType = 'ain';
                        break;
                    case '4':
                        infType = 'aout';
                        break;
                    default:
                        break;
                }
                str = `${ infType}.${parms.infId} ${ condition } ${ parms.value }` ;
            }else if(parms.criterionType2=='4'){
                str = `running.workMode eq ${ parms.workMode }` ;
            }

            if(str.trim()!=''){
                parms.str = str;
            }

            if(this.state.mode === '1'){
                this.state.criterionList.push(parms.str);
            }else if( this.state.mode ==='2' ){
                this.state.criterionList[this.state.edit_index] = parms.str;
            }
            this.setState({
                criterionList:[].concat( this.state.criterionList )
            })
        },
        onChange(){
            console.log('change-----------------');
        }
    }
    
    _delCriteria(i){
        let arr = this.state.criterionList;
        arr.splice(i,1)
        this.setState({
            criterionList:arr
        })
    }
    _editCriteria(item,i){
        //解析item/
        //parms.condition 条件
        //parms.param 系统参数
        //parms.infId 口信息
        //parms.infType 
        let parms ={};
        console.log(item);
        let arr = item.split(" ");
        if( item.indexOf('param')!='-1'){
            parms.criterionType2 = 1;
            parms.param = item.substring(item.indexOf('param.')-0+6,item.indexOf(' ') );
            parms.value = arr[arr.length-1];
            
        }else if ( item.indexOf('axis')!='-1' ){//轴信息
            parms.criterionType2 = 2;
            parms.axis = item.substring(item.indexOf('axis.')-0+5,item.indexOf(' ') );

            if(item.indexOf('alreadyGoHome') != '-1'){
                parms.alreadyGoHome = arr[arr.length-1];
                parms.axisState = 1 ;
            }else if(item.indexOf('realTimeMPos')!= '-1'){
                parms.realTimeMPos = arr[arr.length-1];
                parms.axisState = 2 ;
            }else if(item.indexOf('isIdle')!= '-1'){
                parms.isIdle = arr[arr.length-1];
                parms.axisState = 3;
            }
        }else if(item.indexOf('running')!='-1'){
            parms.criterionType2 = 4;
            parms.workMode = arr[arr.length-1];
        }else{//口信息
            if(item.indexOf('in')!='-1'){
                parms.infType = 1;
                parms.infId = item.substring(item.indexOf('in.')-0+3,item.indexOf(' ') );
            }else if(item.indexOf('out')!='-1'){
                parms.infType = 2;
                parms.infId = item.substring(item.indexOf('out.')-0+4,item.indexOf(' ') );
            }else if(item.indexOf('ain')!='-1'){
                parms.infType = 3;
                parms.infId = item.substring(item.indexOf('ain.')-0+4,item.indexOf(' ') );
            }else if(item.indexOf('aout')!='-1'){
                parms.infType = 4;
                parms.infId = item.substring(item.indexOf('aout.')-0+5,item.indexOf(' ') );
            }
            parms.criterionType2 = 3;
            parms.value = arr[arr.length-1];
        }
        if(arr.includes('gt')){
            parms.condition = 1
        }else if( arr.includes('ge') ){
            parms.condition = 2
        }else if( arr.includes('lt') ){
            parms.condition = 3
        }else if( arr.includes('le') ){
            parms.condition = 4
        }else if( arr.includes('eq') ){
            parms.condition = 5
        }
        console.log(parms);

        this.setState({
            defaultData:parms,
            mode:'2',
            edit_index:i,
        })

    }
    render() {
        const { formData, onSubmit, onCancel, defaultData, ...rest } = this.props
        const { confirmLoading,mode } = this.state
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        let self = this;
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
                        this.setState({ criterionList:[]}) }}
                    onOk={this.handleSubmit.bind(this)}
                >
                    <Form>
                        <Form.Item
                                label="条件类型"
                                labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                            >
                                {getFieldDecorator('criteriaType', {initialValue:defaultData&&defaultData.criteriaType?defaultData.criteriaType+'':'',rules: [{ required: true, message: '请选择条件类型!' }],})(
                                    <Select  style={{ width: 210 }} onChange={this.handleSelectChange.bind(this,'criteriaType')}>
                                        {
                                            this.props.criteriaType.map(function(item){
                                                return(
                                                    <Option value={item.type} key={item.type}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                       

                        <Form.Item
                            label="条件名称"
                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('criteriaName',{initialValue:defaultData&&defaultData.criteriaName?defaultData.criteriaName:'', rules: [{required: true, message: 'Please select your value!' }],})(
                               <Input />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="超时时间"
                            labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                        >
                            {getFieldDecorator('loopWaiting',{ initialValue:defaultData&&defaultData.loopWaiting?defaultData.loopWaiting:'', })(
                            <Input />
                            )}
                        </Form.Item>
                        
                        <div style={{ 'paddingLeft':'30px' }}>
                            {
                                this.state.criterionList && this.state.criterionList.length>0?
                                    this.state.criterionList.map((item,i)=>{
                                        return(
                                            <div key={i} style={{ 'margin':'10px 0' }}>
                                                { item }
                                                <Popconfirm
                                                    title="确定删除此条件项?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={  self._delCriteria.bind(self,i)  }
                                                >
                                                    <Button style={{ 'margin':'0 10px' }} type="danger"  icon="delete"/> 
                                                </Popconfirm>
                                                <Button onClick={ self._editCriteria.bind(self,item,i) }  type="edit"  icon="edit"/> 
                                            </div>
                                        )
                                    })
                                :
                                null
                            }
                            <Button  className='icon_plus' onClick={ ()=>this.setState({mode:'1',defaultData:{} }) }  icon="plus" >
                                添加条件项
                            </Button> 
                        </div>


                    </Form>

                </Modal>

                <ModalAddCriteria 
                    title="添加条件项"
                    visible={ !!mode }
                    onCancel={ this.handlers2._onCancel.bind(this) }
                    onSubmit={this.handlers2._submit.bind(this)}
                    onChange={this.handlers2.onChange.bind(this)}
                    paramList={ this.props.paramList }
                    axisList={ this.props.axisList }
                    infObj={this.state.infObj}
                    // infList={this.props.infList}
                    condition={this.props.condition}
                    criterionType2={this.props.criterionType2}
                    criteriaType={this.props.criteriaType}
                    defaultData={ this.state.defaultData }
                    
                />
            </div>
        )
    }
}


const ModalAddCondition1 = Form.create()(ModalAddCondition);
export default ModalAddCondition1