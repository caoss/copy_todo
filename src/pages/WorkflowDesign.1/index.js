/**
 * @author YM
 */
import React, { Component } from "react";
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import "./index.scss";
import { Card, Icon, Modal,Layout,Button,message,Checkbox ,Popconfirm} from "antd";
const { Header, Sider, Content } = Layout;
import Storage from "../../utils/Storage";
import ModalCustomForm from '../../components/ModalCustomForm2'
import ModalAddCondition from '../../components/ModalAddCondition'

import TGMG from './components/TogMg'
import MGItem from './components/MGItem'



import { relative } from "path";
import img1 from './img/1.png';
import img2 from './img/2.png';
import img3 from './img/3.png';
import img4 from './img/4.png';
import img5 from './img/5.png';
import img6 from './img/6.png';
import img7 from './img/7.png';
import img8 from './img/8.png';
import img9 from './img/9.png';
import img10 from './img/10.png';
import img11 from './img/11.png';
import img12 from './img/12.png';
import img13 from './img/13.png';
import c_1 from './img/c_1.png';
import c_2 from './img/c_2.png';
import c_3 from './img/c_3.png';
import icon_auto from './img/icon_auto.png';
import icon_reset from './img/icon_reset.png';

@inject('store')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
        console.log('constructor');
        this.imgs= [
            img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12,img13
        ];
        this.imgs_c =[ c_1,c_2,c_3 ];
        this.state = {
            btn_toggle:false,
            work_title:'',
            collapsed: false,
            checkedSteps:[],
            selAxisList:[],
            partIds:[],
            disabledDel:true,
            part1List:[],
            part2List:[],
            versionName:'水胶贴合样机',
            id:global.softwareId,
            // autoId:global.autoId,
            // resetId:global.resetId,
            actionId:'',
            mode:false,
            editId:'',
            conditionMode:false,
            inList:[],
            outList:[],
            actionsType:[
                {
                    name:'组合动作(串行)',
                    stepType:1
                },
                {
                    name:'组合动作(并行)',
                    stepType:2
                },
                {
                    type:'axisAllStop',//不需要其它条件
                    name:'所有轴减速停止',
                    stepType:3
                },
                {
                    type:'axisGoHome',//需要选择轴口
                    name:'回原点',
                    stepType:4
                },
                {
                    type:'axisMove',//需要选择轴口，目标类型 1:原点, 2:安全位, 3:自定义点位，非必需;点位标识，非必需,speed 速度，非必需
                    name:'轴点位移动',
                    stepType:5
                },
                {
                    type:'axisMoveTorque',
                    name:'轴点位移动(扭矩模式)',
                    stepType:6
                },
                {
                    type:'setOut',
                    name:'Out信号设置',
                    stepType:7
                },
                {
                    type:'timeDelay',
                    name:'延时',
                    stepType:8
                },
                {
                    type:'cylinderMove',
                    name:'气缸运动',
                    stepType:9
                },
                {
                    type:'vacuumOp',
                    name:'真空气压表操作',
                    stepType:10
                },
                {
                    type:'setProcessVar',
                    name:'流程变量赋值',
                    stepType:11
                },
                {
                    type:'axisMoveRelative',
                    name:'轴相对移动',
                    stepType:12
                },
                {
                    type:'ccd',
                    name:'CCD通信',
                    stepType:13
                },

            ],
            condition:[
                {
                    name:'大于',
                    value:'1',
                },
                {
                    name:'大于等于',
                    value:'2',
                },
                {
                    name:'小于',
                    value:'3',
                },
                {
                    name:'小于等于',
                    value:'4',
                },
                {
                    name:'等于',
                    value:'5',
                },
            ],
            actionParams:{},
            defaultData:{},
            criteriaDData:{},
            editCriteraId:'',
            //条件
            criterionType2:[
                {
                    name:'系统参数',
                    type:'1'
                },
                {
                    name:'轴信息',
                    type:'2'
                },
                {
                    name:'口信息',
                    type:'3'
                },
                {
                    name:'当前工作模式',
                    type:'4'
                },
            ],
            //条件
            criteriaType:[
                {
                    name:'前置条件',
                    type:'1'
                },
                {
                    name:'开始条件',
                    type:'2'
                },
                {
                    name:'结束条件',
                    type:'3'
                },
            ],
            
        };

    }
    toggle = () => {
        this.setState({
        collapsed: !this.state.collapsed
        });
    };

    componentDidMount() {
        this.state.id = global.softwareId
        // this.state.autoId = global.autoId
        // this.state.resetId = global.resetId
        // this.state.actionId = this.props.location.state&&this.props.location.state.actId?this.props.location.state.actId:global.autoId

        // this.getStepList();//获取动作流程

        this.getAxisList();//this.axisPortData['list']=>轴列表

        this.getOutList();//this.ioPortData['list']=>OUT列表

        this.getParamsList();
        // this.getPortList( { interfaceType:4 } )
        this._getPartList( { partType:1} );
        this._getPartList( { partType:2} );

        this._getModuleGroupList();

        this._getInList(1);

        this._getParamsList();

    }

    componentWillReceiveProps(nextProps) {
        // if(nextProps && this.props && nextProps.location.state.actId && this.props.location.state.actId && nextProps.location.state.actId != this.props.location.state.actId){
        //     this.setState({
        //         actionId:nextProps.location.state.actId
        //     },()=>{
        //         this.getStepList();
        //     })
            
        // }
    }

    
    _getInList(type){
        const { mainboardStore } = this.props.store
        mainboardStore.getIOPortList({interfaceType:type}).then(res=>{
            console.log('getIOPortList',res);
            if(type  == 1){
                this.setState({
                    inList:res 
                })
            }else if(type == 2){ 
                this.setState({
                    outList:res 
                })
            }
        });
    }

    _getModuleGroupList(){
        const { moduleGroupStore } = this.props.store
        return new Promise(function (resolve, reject) {
            moduleGroupStore.getList().then(res=>{
                console.log('ressssss',res);
                resolve(res)
            });
        });
    }

    _getPartList(params){
        const { partStore } = this.props.store
        partStore.getList(params).then(res=>{
            if(params.partType==1){
                this.setState({
                    part1List:res
                })
            }else{
                this.setState({
                    part2List:res
                })
            }
        })
    }
    getParamsList(){
        const { mainboardStore } = this.props.store
        const  softwareId  = this.state.id;
        mainboardStore.getParamsList({softwareId,pageNo:1,pageSize:20});
    }
    getPortList(params){
        const { mainboardStore } = this.props.store
        const  softwareId  = this.state.id;

        return new Promise(function (resolve, reject) {
            mainboardStore.getPortList({softwareId,...params}).then(res=>{
                resolve(res)
            });
        });
    }

    _getParamsList(){
        const { mainboardStore } = this.props.store
        const softwareId = global.softwareId;
        mainboardStore
        .getParamsList({
          softwareId,
          paramType:2,
        })
    }
    //获取轴信息
    getAxisInfo(axisId){
        const { mainboardStore } = this.props.store

        return new Promise(function (resolve, reject) {
            mainboardStore.getAxisInfo(axisId).then(res=>{
                resolve(res)
            });
        });

    }

    //获取轴列表interfaceType5
    getAxisList(){
        const { mainboardStore } = this.props.store
        const  softwareId  = this.state.id;
        mainboardStore.getAxisPortList({ softwareId,interfaceType:5 });
    }

    //先选择轴再----获取点位列表
    getPointList(axisId){
        //point/detail/list
        // axisPointList
        const { mainboardStore } = this.props.store
        return new Promise(function (resolve, reject) {
            mainboardStore.getAxisPointData({ axisId }).then(res=>{
                console.log('getAxisPointData',res);
                resolve(res)
            });
        });
    }
    //获取Out位列表interfaceType2
    getOutList(){
        const { mainboardStore } = this.props.store
        const  softwareId  = this.state.id;
        mainboardStore.getIOPortList({ softwareId,interfaceType:2 });
    }

    //获取动作流程列表
    getStepList(){
        const  softwareId  = this.state.id;
        let  actionId  = this.state.actionId;
        const { mainboardStore } = this.props.store
        mainboardStore.getStepList({ softwareId,parentId:actionId});
    }

    componentWillUnmount() {}

    //添加动作
    _addCondition( params,obj ){
        this.setState({
            actionParams:params,
            mode:true,
            defaultData:{},
            editId:'',
            getParentSMsg:obj
        })
    }


    _changeAction(type){
        this.setState({
            actionId:type==1?this.state.autoId:this.state.resetId
        },()=>{
            this.getStepList();
        })
    }

    _delSteps(obj){
        const { mainboardStore } = this.props.store
        mainboardStore.delSteps({ idList:this.state.checkedSteps }).then(res=>{
            if (res.code === '0') {
                message.success(res.message)
                this.getStepList();
            } else {
                message.error(res.message)
            }
        });
    }
    
    _delStep(id,obj){
        const { mainboardStore } = this.props.store
        mainboardStore.delSteps({ idList:[id] }).then(res=>{
            if (res.code === '0') {
                message.success(res.message)
                this.setState({
                    getParentSMsg:obj,
                },()=>{
                    this.getCriteria();
                })
            } else {
                message.error(res.message)
            }
        });
    }
    _edit(item,obj){
        console.log(item,obj);
        this.setState({
            defaultData:item,
            mode:1,
            editId:item.id,
            getParentSMsg:obj
        })
    }

    // 动作
    handlers = {
        _addCondition(){
            this.setState({
                mode:true
            })
        },
        _onCancel(){
            this.setState({
                mode:false,
                defaultData:{},
            })
        },
        _submit(parms){

            const softwareId  = this.state.id;

            const parentId  = this.state.actionId;
            
            parms.softwareId = softwareId;
            
            if(!this.state.actionParams.parentId){
                parms.parentId = parentId;
            }

            let self = this;
            let obj = Object.assign({},this.state.actionParams,parms)
            
            const { mainboardStore } = this.props.store

            obj.enableFlag = obj.enableFlag?1:0;

            if( obj.stepType ==4){
                obj.extParams = JSON.stringify({axisId:obj.axis}) ;
            }else if( obj.stepType ==5){
                obj.extParams = JSON.stringify({axisId:obj.axis,pointId:obj.pointId,speed:obj.speed,destType:obj.destType}) ;
            }else if( obj.stepType ==6){
                obj.extParams = JSON.stringify({axisId:obj.axis,torquePercent:obj.torquePercent,fitDist:obj.fitDist}) ;
            }else if( obj.stepType ==7){
                obj.extParams = parms.extParams;
            }else if( obj.stepType ==8){
                obj.extParams =  JSON.stringify({delay:obj.delay});
            }else if( obj.stepType ==9){
                obj.extParams =  JSON.stringify({partId:obj.partId,destType:obj.destType});
            }else if( obj.stepType ==10){
                obj.extParams =  JSON.stringify({partId:obj.partId,value:obj.value});
            }else if( obj.stepType ==12){
                obj.extParams =  JSON.stringify({infIn:obj.infIn,speed:obj.speed,dist:obj.dist,axisId:obj.axis});
            }else if( obj.stepType ==11){
                obj.extParams =  JSON.stringify({paramId:obj.paramId,value:obj.value});
            }else if( obj.stepType ==13){
                obj.extParams =  JSON.stringify({cubeId:obj.cubeId,moveMode:obj.moveMode,signal:obj.signal,ngCmd:obj.ngCmd,okCmd:obj.okCmd});
            }

            if(!this.state.editId){
                return new Promise(function (resolve, reject) {
                    mainboardStore.addStep(obj).then(res=>{
                        if (res.code === '0') {
                            message.success(res.message)
                            self.getCriteria();
                        } else {
                            message.error(res.message)
                        }
                        resolve(res)
                    });
                });
            }else{
                let editId = this.state.editId;
                let { index1,index2,index3,index4,type} = this.state.getParentSMsg;
                obj.parentId = this.state.defaultData.parentId;
                let  stepList = mainboardStore.stepList;
                if(!type){
                    if(index1>0){
                        obj.prevId = stepList[ index1-1 ]['id'] ;
                    }
                }else if( type =='2'){
                    if(index2>0){
                        obj.prevId = stepList[ index1 ]['steps'][index2-1]['id'] ;
                    }
                }else if( type == '3'){
                    if(index3>0){
                        obj.prevId = stepList[ index1 ]['steps'][index2]['steps'][index3-1]['id'] ;
                    }
                }else if( type == '4'){
                    if(index4>0){
                        obj.prevId =  stepList[ index1 ]['steps'][index2]['steps'][index3]['steps'][index4-1]['id'];
                    }
                }
                return new Promise(function (resolve, reject) {
                    mainboardStore.editStep(obj,editId).then(res=>{
                        if (res.code === '0') {
                            message.success(res.message)
                            self.getCriteria();
                            self.setState({
                                defaultData:{}
                            })
                        } else {
                            message.error(res.message)
                        }
                        resolve(res)
                    });
                });
            }

        },
        onChange(){
            console.log('change-----------------');
        }
    }
onChange(id,e){
    let checkedSteps = this.state.checkedSteps;
    if(e.target.checked){
        checkedSteps.push(id)
    }else{
        var index = checkedSteps.indexOf(id);
        if (index > -1) {
            checkedSteps.splice(index, 1);
        }
    }
    if(checkedSteps.length<=0){
        this.setState({
            disabledDel:true,
        })
    }else{
        this.setState({
            disabledDel:false,
            checkedSteps:checkedSteps
        })
    }
}


//条件
handlers2 = {
    _addCondition(){
        this.setState({
            mode:true
        })
    },
    _onCancel(){
        this.setState({
            conditionMode:false
        })
    },
    _submit(parms){
        console.log('parms-----',parms,this.state.stepId)
        const { mainboardStore } = this.props.store
        let self = this;
        if( this.state.editCriteraId ){//编辑
            return new Promise(function (resolve, reject) {
                mainboardStore.editCriteria({ stepId: self.state.editCriteraId,...parms }).then(res=>{
                    if (res && res.code === '0') {
                        resolve(res)
                        message.success(res.message)
                        self.getCriteria();
                    } else {
                        message.error('有误')
                    }
                });
            });

        }else{//添加
            return new Promise(function (resolve, reject) {
                mainboardStore.addCriteria({ stepId: self.state.stepId,...parms }).then(res=>{
                    if (res && res.code === '0') {
                        resolve(res)
                        message.success(res.message)
                       self.getCriteria();
                    } else {
                        message.error('有误')
                    }
                });
            });
        }
           
    },
    onChange(){
        console.log('change-----------------');
    }
}

//条件
_addCriteria(item,params){
    console.log(params);
    this.setState({
        conditionMode:true,
        stepId:item.id,
        editCriteraId:'',
        criteriaDData:{},
        getParentSMsg:params,
    }) 
}

getCriteria(){//操作完成之后
    let {getParentSMsg} = this.state;
    if( getParentSMsg && getParentSMsg.id ){
        let { id,index,i,i3,type } = getParentSMsg;
        if(type==2){
            this._expAction(id,index);
        }else if(type==3){
            console.log('type==3',id,index,i3);
            this._expAction2(id,index,i3);
        }else if(type==4){
            this._expAction3(id,index,i3,i);
        }
    }else{
        this.getStepList();
    }
}
_editCriteria(item,params){
    console.log('item',item,params);
    this.setState({
        criteriaDData:item,
        conditionMode:1,
        editCriteraId:item.stepId,
        getParentSMsg:params,
    })
}
_delCriteria(item,params){
    let {criteriaType,stepId } = item;
    const { mainboardStore } = this.props.store
    mainboardStore.delCriteria({ criteriaType,stepId }).then(res=>{
        if (res && res.code === '0') {
            message.success(res.message)
            this.setState({
                getParentSMsg:params,
            },()=>{
                this.getCriteria();
            })
        } else {
            message.error('有误')
        }
    });
}

_shrinkAction(index){
    const { mainboardStore } = this.props.store
    mainboardStore._shrinkAction({index});
}

_expAction(id,index){
    console.log('asdfasdfasfaf-----------------------');
    const { mainboardStore } = this.props.store
    const  softwareId  = this.state.id;
    mainboardStore.getStepList_2({ softwareId,parentId:id,index}).then((res)=>{
        console.log( 'getStepList_2',res);
    });
}

_expAction2(id,index,i){
    console.log('id,index,i',id,index,i)
    const { mainboardStore } = this.props.store
    const  softwareId  = this.state.id;
    mainboardStore.getStepList_3({ softwareId,parentId:id,index,i}).then((res)=>{
        console.log( 'getStepList_3',res);
    });
}
_shrinkAction2(index,i){
    const { mainboardStore } = this.props.store
    mainboardStore._shrinkAction2({index,i});
}


_expAction3(id,index,i,i3){
    const { mainboardStore } = this.props.store
    const  softwareId  = this.state.id;
    mainboardStore.getStepList_4({ softwareId,parentId:id,index,i,i3}).then((res)=>{
        console.log( 'getStepList_4',res);
    });
}

_shrinkAction3(index,i,i3){
    const { mainboardStore } = this.props.store
    mainboardStore._shrinkAction3({index,i,i3});
}
step_config(id){
    if(!id){
        message.error('参数不能为空');
        return;
    }
    const { mainboardStore } = this.props.store
    mainboardStore.step_config({stepId:id});
}

_changeEnable(parms){
    const { mainboardStore } = this.props.store
    mainboardStore.setEnable(parms);
}

    _checkID(id,selAxisList,partsList,type,name){
        console.log( id,selAxisList,partsList,type,name );
        this.setState({
            actionId:id,
            selAxisList:JSON.parse(selAxisList),
            partsList:JSON.parse(partsList),
            work_title:`${name}-${type==1?'自动':'复位'}`
        },()=>{
            this.getStepList();
        })
    }

    _tog_btn(){
        this.setState({
            btn_toggle:!this.state.btn_toggle
        })
    }
  render() {
    let self = this;
    let { mode , disabledDel,defaultData,conditionMode } =this.state;
    const { mainboardStore,partStore,moduleGroupStore } = this.props.store
    let  stepList = mainboardStore.stepList;
    let modeleList = moduleGroupStore.modeleList;

    return (
            <div style={{background:'#fff'}}>
            
                <div className='workflow_left act'>
                    {
                        modeleList.map((item)=>{
                            return(
                                <div>
                                    <MGItem data={ item } _checkID={this._checkID.bind(this)} />
                                </div>
                            )
                        })
                    }
                </div>       
                <div className={ this.state.btn_toggle?"workflow-page2 act":"workflow-page2" } >
                    {/* 
                        切换模组
                    */}
                    <TGMG 
                        data={this.state.btn_toggle } 
                        _tog={ this._tog_btn.bind(this) }
                    />
                   
                    {
                        this.state.work_title
                        ?
                            <div className='work_title'>
                                { this.state.work_title }
                            </div>
                        :
                            null
                    }

                    <div
                        style={{
                        padding:'30px',
                        background:'#fff',
                        height:'100%',
                        overflow:'scroll'
                    }}
                    >
                    <Popconfirm
                        title="确定删除?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={ this._delSteps.bind(this)}
                        >
                        <Button disabled={disabledDel} style={{ marginBottom: '16px' }} type="danger">批量删除</Button>
                    </Popconfirm>
        
                        {
                            stepList && stepList.length>0?
                                <Button type="primary" onClick={this._addCondition.bind(this,{ prevId:stepList[stepList.length-0-1]['id'] })} style={{ 'margin':'20px' }}>添加动作+</Button>
                            :
                                <Button type="primary" onClick={this._addCondition.bind(this,'')} style={{ 'margin':'20px' }}>添加动作+</Button>
        
                        }

                        <Button type="primary" onClick={this.step_config.bind(this,this.state.actionId)}>调试</Button>
                        
                        <div className='list'>
        
                            {
                                stepList && stepList.length>0?
                                    stepList.map((item,index)=>{
                                        return(
                                            
                                            <div className='line' key={item.id}>
                                                <div className='step_li'>
                                                    <Checkbox onChange={self.onChange.bind(self,item.id)}></Checkbox>
        
                                                    <img className='actionIcon' src={this.imgs[item.stepType-1] } />
        
                                                    { item.stepName?item.stepName:'没有名字' }
        
                                                    <Button className='icon_edit' onClick={ self._edit.bind(self, toJS(item),{index1:index}  ) }  icon="form" /> 
        
                                                    <Button className='icon_edit' onClick={ self._addCriteria.bind(self, toJS(item)) }  icon="plus" >
                                                        条件
                                                    </Button> 
        
                                                    {
                                                        item.stepType == 1 || item.stepType == 2?
                                                            <span>
        
                                                                <Button className='icon_edit' onClick={ self._addCondition.bind(self,{parentId:item.id},{id:item.id,index,type:2} ) }  icon="plus" >
                                                                    动作
                                                                </Button>
        
                                                                {
                                                                    item.expand?
                                                                    <Button className='icon_edit' onClick={ self._shrinkAction.bind(self,index ) }  icon="shrink" />
                                                                    :
                                                                    <Button className='icon_edit' onClick={ self._expAction.bind(self, item.id,index ) }  icon="arrows-alt" />
                                                                }
                                                            </span>
                                                        :
                                                        null
                                                    }
        
                                                    <Popconfirm
                                                        title="确定删除?"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onConfirm={self._delStep.bind(self,item.id)}
                                                    >
                                                        <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                    </Popconfirm>
        
                                                    <Button className='icon_carrary' onClick={self.step_config.bind(self,item.id)} type='primary' >
                                                        调试
                                                    </Button> 
        
                                                    {
                                                        item.enableFlag?
                                                            <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:0,id:item.id,i1:index})} type='primary' >
                                                                关闭使能
                                                            </Button> 
                                                        :
                                                            <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:1,id:item.id,i1:index})} type='primary' >
                                                                使能
                                                            </Button> 
                                                    }
        
                                                </div>
                                                    {/* 二级动作 */}
                                                <div className={ item.expand?'':'hide' }>
                                                    {
                                                        item.steps && item.steps.length>0 ?
                                                            item.steps.map( (step_li,step_i)=>{
                                                                return(
                                                                    <div className='li2' key={ step_i }>
        
                                                                        <img className='actionIcon' src={this.imgs[step_li.stepType-1] } />
        
                                                                        { step_li.stepName?step_li.stepName:'没有名字' }
        
                                                                        <Button className='icon_edit' onClick={ self._edit.bind(self, toJS(step_li),{id:item.id,index,type:2,index1:index,index2:step_i})}  icon="form" /> 
        
                                                                        <Button className='icon_edit' onClick={ self._addCriteria.bind(self, toJS(step_li),{id:item.id,index,type:2}) }  icon="plus" >
                                                                            条件
                                                                        </Button>
        
                                                                        {
                                                                            // 只有动作1，2才可以添加动作，和展开
                                                                            step_li.stepType == 1 || step_li.stepType == 2?
                                                                                <span>
                                                                                <Button className='icon_edit' onClick={ self._addCondition.bind(self,{ parentId:step_li.id },{id:step_li.id,index,type:3,i3:step_i}  ) }  icon="plus" >
                                                                                    动作
                                                                                </Button>
        
                                                                                {/* 展开 */}
        
        
                                                                                    {
                                                                                        step_li.expand?
                                                                                        <Button className='icon_edit' onClick={ self._shrinkAction2.bind(self,index,step_i ) }  icon="shrink" />
                                                                                        :
                                                                                        <Button className='icon_edit' onClick={ self._expAction2.bind(self, step_li.id,index,step_i) }  icon="arrows-alt" />
                                                                                    }
                                                                                </span>
                                                                            :
                                                                            null
                                                                        }
                                                                        <Popconfirm
                                                                            title="确定删除轴点位?"
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                            onConfirm={self._delStep.bind(self,step_li.id,{id:item.id,index,type:2})}
                                                                        >
                                                                            <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                        </Popconfirm>
                                                                        <Button className='icon_carrary' onClick={self.step_config.bind(self,step_li.id)} type='primary' >
                                                                            调试
                                                                        </Button> 
        
                                                                        {
                                                                            step_li.enableFlag?
                                                                                <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:0,id:step_li.id,i1:index,i2:step_i})} type='primary' >
                                                                                    关闭使能
                                                                                </Button> 
                                                                            :
                                                                                <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:1,id:step_li.id,i1:index,i2:step_i})} type='primary' >
                                                                                    使能
                                                                                </Button> 
                                                                        }
        
        
                                                                        {/* 三级 */}
                                                                        <div className={ step_li.expand?'':'hide' }>
                                                                            {
                                                                                step_li.steps && step_li.steps.length>0 ?
                                                                                    step_li.steps.map( (li3,i3)=>{
                                                                                        return(
                                                                                            <div className='li2' key={ i3 }>
                                                                                                <img className='actionIcon' src={this.imgs[li3.stepType-1] } />
                                                                                                —— { li3.stepName?li3.stepName:'没有名字' }
                                                                                                <Button className='icon_edit' onClick={ self._edit.bind(self, toJS(li3),{id:step_li.id,index,type:3,i3:step_i,index1:index,index2:step_i,index3:i3}) }  icon="form" /> 
                                                                                                                                                                                    {/* 传父级的ID，i3也传上一级的 */}
                                                                                                <Button className='icon_edit' onClick={ self._addCriteria.bind(self, toJS(li3),{id:step_li.id,index,type:3,i3:step_i}) }  icon="plus" >
                                                                                                    条件
                                                                                                </Button> 
                                                                                                {
                                                                                                    li3.stepType == 1 || li3.stepType == 2?
                                                                                                        <span>
                                                                                                        <Button className='icon_edit' onClick={ self._addCondition.bind(self,{ parentId:li3.id },{ id:li3.id,index,type:4,i3:step_i,i:i3 }) }  icon="plus" >
                                                                                                            动作
                                                                                                        </Button>
                                                                                                        {/* 展开 */}
                                                                                                        
                                                                                                        {
                                                                                                            li3.expand?
                                                                                                            <Button className='icon_edit' onClick={ self._shrinkAction3.bind(self,index,step_i,i3 ) }  icon="shrink" />
                                                                                                            :
                                                                                                            <Button className='icon_edit' onClick={ self._expAction3.bind(self, li3.id, index, step_i, i3) }  icon="arrows-alt" />
                                                                                                        }
                                                                                                        </span>
                                                                                                    :
                                                                                                    null
                                                                                                }
                                                                                                <Popconfirm
                                                                                                    title="确定删除?"
                                                                                                    okText="Yes"
                                                                                                    cancelText="No"
                                                                                                    onConfirm={self._delStep.bind(self,li3.id,{id:step_li.id,index,type:3,i3:step_i})}
                                                                                                >
                                                                                                    <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                                                </Popconfirm>
                                                                                                <Button onClick={self.step_config.bind(self,li3.id)}   className='icon_carrary' type='primary' >
                                                                                                    调试
                                                                                                </Button> 
        
                                                                                                {
                                                                                                    li3.enableFlag?
                                                                                                        <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:0,id:li3.id,i1:index,i2:step_i,i3})} type='primary' >
                                                                                                            关闭使能
                                                                                                        </Button> 
                                                                                                    :
                                                                                                        <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:1,id:li3.id,i1:index,i2:step_i,i3})} type='primary' >
                                                                                                            使能
                                                                                                        </Button> 
                                                                                                }
                                                                                                {/* 四级 */}
                                                                                                <div className={ li3.expand?'':'hide' }>
                                                                                                    {
                                                                                                        li3.steps&& li3.steps.length>0?
                                                                                                            li3.steps.map((li4,i4)=>{
                                                                                                                return(
                                                                                                                    <div className='li2' key={ i4 }>
                                                                                                                        <img className='actionIcon' src={this.imgs[li4.stepType-1] } />
                                                                                                                        —— { li4.stepName?li4.stepName:'没有名字' }
                                                                                                                        <Button className='icon_edit' onClick={ self._edit.bind(self, toJS(li4),{ id:li3.id,index,type:4,i3:step_i,i:i3,index1:index,index2:step_i,index3:i3,index4:i4 }) }  icon="form" /> 
                                                                                                                        <Button className='icon_edit' onClick={ self._addCriteria.bind(self, toJS(li4),{ id:li3.id,index,type:4,i3:step_i,i:i3 }) }  icon="plus" >
                                                                                                                            条件
                                                                                                                        </Button> 
                                                                                                                        {
                                                                                                                            li4.stepType == 1 || li4.stepType == 2?
                                                                                                                                <span>
                                                                                                                                <Button className='icon_edit' onClick={ self._addCondition.bind(self,{ parentId:li4.id }) }  icon="plus" >
                                                                                                                                    动作
                                                                                                                                </Button>
                                                                                                                                {/* 展开 */}
                                                                                                                                {/* <Button className='icon_edit' onClick={ self._expAction3.bind(self, li4.id,index,step_i,i4) }  icon="arrows-alt" /> */}
                                                                                                                                </span>
                                                                                                                            :
                                                                                                                            null
                                                                                                                        }
                                                                                                                        <Popconfirm
                                                                                                                            title="确定删除轴点位?"
                                                                                                                            okText="Yes"
                                                                                                                            cancelText="No"
                                                                                                                            onConfirm={self._delStep.bind(self,li4.id,{ id:li3.id,index,type:4,i3:step_i,i:i3 })}
                                                                                                                        >
                                                                                                                            <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                                                                        </Popconfirm>
                                                                                                                        <Button  onClick={self.step_config.bind(self,li4.id)}  className='icon_carrary' type='primary' >
                                                                                                                            调试
                                                                                                                        </Button>
        
                                                                                                                        {
                                                                                                                            li4.enableFlag?
                                                                                                                                <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:0,id:li4.id,i1:index,i2:step_i,i3,i4})} type='primary' >
                                                                                                                                    关闭使能
                                                                                                                                </Button> 
                                                                                                                            :
                                                                                                                                <Button className='icon_clo' onClick={self._changeEnable.bind(self,{type:1,id:li4.id,i1:index,i2:step_i,i3,i4})} type='primary' >
                                                                                                                                    使能
                                                                                                                                </Button> 
                                                                                                                        }
        
                                                                                                                        <ul className='criteria'>
                                                                                                                            {
                                                                                                                                li4.criteriaList && li4.criteriaList.length>0?
                                                                                                                                    li4.criteriaList.map( (cr_li,i)=>{
        
                                                                                                                                        return(
                                                                                                                                            <li className='li2' key={ i }>
                                                                                                                                                <img className='actionIcon' src={this.imgs_c[cr_li.criteriaType-1] } />
                                                                                                                                                —— { cr_li.criteriaName }
                                                                                                                                                <Button onClick={ self._editCriteria.bind(self,toJS(cr_li),{ id:li3.id,index,type:4,i3:step_i,i:i3 })}   size='small' className='icon_edit'  icon="form" /> 
                                                                                                                                                <Popconfirm
                                                                                                                                                    title="确定删除此条件?"
                                                                                                                                                    okText="Yes"
                                                                                                                                                    cancelText="No"
                                                                                                                                                    onConfirm={  self._delCriteria.bind(self, toJS(cr_li),{ id:li3.id,index,type:4,i3:step_i,i:i3 })  }
                                                                                                                                                >
                                                                                                                                                    <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                                                                                                </Popconfirm>
                                                                                                                                                {/* <Button size='small' className='icon_edit'  icon="arrows-alt" />  */}
                                                                                                                                            </li>
                                                                                                                                        )
                                                                                                                                    } )
                                                                                                                                :
                                                                                                                                null
                                                                                                                            }
                                                                                                                        </ul>
                                                                                                                        </div>
        
                                                                                                                )
                                                                                                            })
                                                                                                        :
                                                                                                        <div className='noMore'>无</div>
                                                                                                    }
                                                                                                </div>
        
                                                                                                <ul className='criteria'>
                                                                                                    {
                                                                                                        li3.criteriaList && li3.criteriaList.length>0?
                                                                                                            li3.criteriaList.map( (cr_li,i)=>{
                                                                                                                return(
                                                                                                                    <li className='li2' key={ i }>
                                                                                                                        <img className='actionIcon' src={this.imgs_c[cr_li.criteriaType-1] } />
                                                                                                                        —— { cr_li.criteriaName }
                                                                                                                        <Button onClick={ self._editCriteria.bind(self,toJS(cr_li),{id:step_li.id,index,type:3,i3:step_i})}   size='small' className='icon_edit'  icon="form" /> 
                                                                                                                        <Popconfirm
                                                                                                                            title="确定删除此条件?"
                                                                                                                            okText="Yes"
                                                                                                                            cancelText="No"
                                                                                                                            onConfirm={  self._delCriteria.bind(self, toJS(cr_li),{id:step_li.id,index,type:3,i3:step_i})  }
                                                                                                                        >
                                                                                                                            <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                                                                        </Popconfirm>
                                                                                                                        {/* <Button size='small' className='icon_edit'  icon="arrows-alt" />  */}
                                                                                                                    </li>
                                                                                                                )
                                                                                                            } )
                                                                                                        :
                                                                                                        null
                                                                                                    }
                                                                                                </ul>
                                                                                            </div>
                                                                                        
                                                                                        )
                                                                                    } ) 
                                                                                :
                                                                                <div className='noMore'>无</div>
                                                                            }
        
                                                                        </div>
        
                                                                        <ul className='criteria'>
                                                                            {
                                                                                step_li.criteriaList && step_li.criteriaList.length>0?
                                                                                    step_li.criteriaList.map( (cr_li,i)=>{
                                                                                        return(
                                                                                            <li className='li2' key={ i }>
                                                                                                <img className='actionIcon' src={this.imgs_c[cr_li.criteriaType-1] } />
                                                                                                —— { cr_li.criteriaName }
                                                                                                <Button onClick={ self._editCriteria.bind(self,toJS(cr_li),{id:item.id,index,type:2})}   size='small' className='icon_edit'  icon="form" /> 
                                                                                                <Popconfirm
                                                                                                    title="确定删除此条件?"
                                                                                                    okText="Yes"
                                                                                                    cancelText="No"
                                                                                                    onConfirm={  self._delCriteria.bind(self, toJS(cr_li),{id:item.id,index,type:2})  }
                                                                                                >
                                                                                                    <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                                                </Popconfirm>
                                                                                                {/* <Button size='small' className='icon_edit'  icon="arrows-alt" />  */}
                                                                                            </li>
                                                                                        )
                                                                                    } )
                                                                                :
                                                                                null
                                                                            }
                                                                            </ul>
                                                                    </div>
                                                                )
                                                            } ) 
                                                        :
                                                        <div className='noMore'>无</div>
                                                    }
        
                                                </div>
        
                                                <ul className='criteria'>
                                                {
                                                    item.criteriaList && item.criteriaList.length>0?
                                                        item.criteriaList.map( (cr_li,i)=>{
                                                            return(
                                                                <li className='li2' key={ i }>
                                                                    <img className='actionIcon' src={this.imgs_c[cr_li.criteriaType-1] } />
                                                                    —— { cr_li.criteriaName }
                                                                    <Button onClick={ self._editCriteria.bind(self,toJS(cr_li))}   size='small' className='icon_edit'  icon="form" /> 
                                                                    <Popconfirm
                                                                        title="确定删除此条件?"
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                        onConfirm={  self._delCriteria.bind(self, toJS(cr_li))  }
                                                                    >
                                                                        <Button className='icon_edit' type="danger"  icon="delete"/> 
                                                                    </Popconfirm>
                                                                    {/* <Button size='small' className='icon_edit'  icon="arrows-alt" />  */}
                                                                </li>
                                                            )
                                                        } )
                                                    :
                                                    null
                                                }
                                                </ul>
                                            </div>
                                        )
                                    })
                                :
                                <div className='noMore'>无</div>
                            }
                        </div>
                        {
                            stepList && stepList.length>0?
                                <Button type="primary" onClick={this._addCondition.bind(this,{ prevId:stepList[stepList.length-0-1]['id'] })} style={{ 'margin':'20px' }}>添加动作+</Button>
                            :
                                <Button type="primary" onClick={this._addCondition.bind(this,'')} style={{ 'margin':'20px' }}>添加动作+</Button>
        
                        }
        
                        <ModalCustomForm 
                            title={defaultData && defaultData.id ? "编辑动作" :'添加动作'}
                            visible={ !!mode }
                            onCancel={ this.handlers._onCancel.bind(this) }
                            onSubmit={this.handlers._submit.bind(this)}
                            actionId={ this.state.actionId }
                            selAxisList={ this.state.selAxisList }
                            partsList={ this.state.partsList }
                            axisList={ toJS(mainboardStore.axisPortData['list'])}
                            axisPointList={ toJS(mainboardStore.axisPointList)}
                            outInfList={toJS(mainboardStore.ioPortData['list'])}
                            actionsType={this.state.actionsType}
                            getPointList={this.getPointList.bind(this)}
                            getAxisInfo={this.getAxisInfo.bind(this)}
                            defaultData={ this.state.defaultData }
                            partList={ this.state.part1List}
                            partList2={ this.state.part2List}
                            inList={ this.state.inList }
                            paramsData={ toJS(mainboardStore.paramsData.list) }
                            destroyOnClose
                        />
        
                        
                        <ModalAddCondition 
                            title={this.state.editCriteraId?"编辑条件":'添加条件' } 
                            visible={ !!conditionMode }
                            onCancel={ this.handlers2._onCancel.bind(this) }
                            onSubmit={this.handlers2._submit.bind(this)}
                            onChange={this.handlers2.onChange.bind(this)}
                            paramList={ toJS(mainboardStore.paramsData['list']) }
                            getPortList={this.getPortList.bind(this)}
                            condition={this.state.condition}
                            criterionType2={this.state.criterionType2}
                            criteriaType={this.state.criteriaType}
                            axisList={ toJS(mainboardStore.axisPortData['list'])}
                            defaultData={ this.state.criteriaDData }
                            editCriteraId={this.state.editCriteraId}
                            destroyOnClose
                        />
        
        
                    </div>
                </div>
            </div>
    );
  }
}
export default Index;
