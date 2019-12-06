/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal,Button,List,Skeleton,Switch  } from 'antd'
import Storage from '../../utils/Storage'
import ModalCustomForm from '../ModalCustomForm2'
import './index.scss'

export default class ModalCondition extends Component {
    static propTypes = {}
    constructor(props) {
        super(props)
        const self = this
        this.state = {
            actionList:[],
            actionsType:[
                {
                    type:'axisAllStop',//不需要其它条件
                    name:'所有轴减速停止'
                },
                {
                    type:'axisGoHome',//需要选择轴口
                    name:'回原点',
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
        }
    }
    state = {
        errors: null,
        confirmLoading: false,
        mode:false,
    }

    componentDidMount() {
        // 条件
        // let criteria = {
        //     id:'',
        //     type:'',
        //     name:'',
        //     loopWaiting:'',
        //     actionList:[],
        // }
        //条件1： 系统参数，下拉列表

        //条件2：轴信息  轴是否已找到原点（true/false）
                // 轴的实时反馈位置 input
                // 轴的状态（true/false）

        //条件3：口信息 
                //下拉联动---口的类型
                //四种I/O口--下拉选项

        //条件4： 当前工作模式---（true/false）
    }
    componentWillReceiveProps(nextprops){
        // console.log('nextprops',nextprops)
        // console.log('props',this.props)
        if(this.props.actionId != nextprops.actionId){
            this.setState({
                actionList:nextprops.actionList
            })
        }
    }

    handlers = {
        _addCondition(){
            this.setState({
                mode:true
            })
        },
        _onCancel(){
            this.setState({
                mode:false
            })
        },
        _submit(parms){
            console.log(parms);
            this.setState({
                actionList:this.state.actionList.concat([parms])
            },()=>{
                Storage.saveToStorage({
                    key:this.props.actionId,
                    value:JSON.stringify(this.state.actionList)
                });
            })
        },
        onChange(){
            console.log('change-----------------');
        }
    }
    _delCondition(i){
        var arr = this.state.actionList;
        arr.splice(i,1);
        this.setState({
            actionList:arr
        },()=>{
            Storage.saveToStorage({
                key:this.props.actionId,
                value:JSON.stringify(this.state.actionList)
            });
        })
    }

    _getPonitsTxt(id,points){
        var str ='';
        this.props.axisList.map(function(item){
            if(item.id == id){
                if(item.pointList.axisPoint&&item.pointList.axisPoint.length>0){
                    item.pointList.axisPoint.map(function(li){
                        points.forEach(function(li2){
                            if(li.id == li2){
                                str += li.pointName
                            }
                        })
                    })
                }else{
                    str = item.pointList.axisPoint.pointName
                }
            }
        })
        return str;
    }
    render() {
        let self = this;
        const { formData, onSubmit,actionId, onCancel,axisList,outInfList, ...rest } = this.props
        const { confirmLoading,mode,actionList,actionsType } = this.state
        return (
            <div>
                <Modal
                    cancelText="取消"
                    okText="确定"
                    confirmLoading={confirmLoading}
                    {...rest}
                    onCancel={onCancel}
                    onOk={onCancel}
                >
                    {
                        actionList.map((item,i) => {
                            return(
                                <List.Item key={i} actions={[
                                    <a onClick={this._delCondition.bind(this,i)}>删除</a>
                                ]}>
                                    {
                                        actionsType.map(li=>{
                                            if( item.actionsType == li.type){
                                                return(
                                                    li.name
                                                )
                                            }
                                        })
                                    }
                                    {/* 回原点- */}
                                    {
                                        item.actionsType=='axisGoHome' || item.actionsType=='axisMove' || item.actionsType=='axisMoveTorque'?
                                            <span>
                                                {
                                                    axisList.map(li=>{
                                                        if(li.id == item.axis){
                                                            return(
                                                                '--'+li.name
                                                            )
                                                        }
                                                    })
                                                }
                                            </span>
                                        :
                                        ''
                                    }
                                    {
                                        item.actionsType=='axisMove'?
                                        <span>
                                            { item.actionTargetType=='1'?'--原点':(item.actionTargetType=='2'?'--安全位':'') }
                                            {   item.actionTargetType == '3'?
                                                    this._getPonitsTxt(item.axis,item.points)
                                                :
                                                 null   
                                            }
                                            速度--{item.speed}
                                        </span>
                                        :
                                        ''
                                    }

                                    {
                                        item.actionsType=='axisMoveTorque'?
                                        <span>
                                            {
                                                this._getPonitsTxt(item.axis,item.points)
                                            }
                                            压合量--{item.fitDist}
                                            扭力百分比--{item.torquePercent}
                                        </span>
                                        :
                                        ''
                                    }
                                            
                                    {
                                        item.actionsType=='setOut'?
                                            <span>
                                                {
                                                    outInfList.map(li=>{
                                                        if(li.id == item.infId){
                                                            return(
                                                                '--'+li.name
                                                            )
                                                        }
                                                    })
                                                }
                                                {
                                                    item.value?'--开':'--关'
                                                }
                                            </span>
                                        :
                                        ''
                                    }
                                    {
                                        item.actionsType=='timeDelay'?
                                            <span>
                                                { item.delayTime }
                                            </span>
                                        :
                                        ''
                                    }
                                            
                                </List.Item>
                            )
                        })
                    }

                    <Button type="primary" block  onClick={this.handlers._addCondition.bind(this)}>添加动作+</Button>
                </Modal>

                <ModalCustomForm 
                    title="添加动作"
                    visible={ !!mode }
                    onCancel={ this.handlers._onCancel.bind(this) }
                    onSubmit={this.handlers._submit.bind(this)}
                    actionId={ this.props.actionId }
                    axisList={this.props.axisList}
                    outInfList={this.props.outInfList}
                    actionsType={this.state.actionsType}
                />
            </div>
        )
    }
}
