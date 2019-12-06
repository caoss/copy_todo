/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal,Button,List,Skeleton,Switch  } from 'antd'
import Storage from '../../utils/Storage'
import ModalAddCondition from '../ModalAddCondition'
import './index.scss'

export default class ModalCondition extends Component {
    static propTypes = {}
    constructor(props) {
        super(props)
        const self = this
        this.state = {
            conditionList:[],
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
            criterionType:[
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
            ]
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
        //     conditionList:[],
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
        if(this.props.conditionId != nextprops.conditionId){
            this.setState({
                conditionList:nextprops.conditionList
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
            this.setState({
                conditionList:this.state.conditionList.concat([parms])
            },()=>{
                Storage.saveToStorage({
                    key:this.props.conditionId,
                    value:JSON.stringify(this.state.conditionList)
                });
            })
        },
        onChange(){
            console.log('change-----------------');
        }
    }
    _delCondition(i){
        var arr = this.state.conditionList;
        arr.splice(i,1);
        this.setState({
            conditionList:arr
        },()=>{
            Storage.saveToStorage({
                key:this.props.conditionId,
                value:JSON.stringify(this.state.conditionList)
            });
        })
    }

    render() {
        let self = this;
        const { formData, onSubmit,conditionId, onCancel, ...rest } = this.props
        const { confirmLoading,mode,conditionList } = this.state
        return (
            <div>
                <Modal
                    cancelText="取消"
                    okText="确定"
                    confirmLoading={confirmLoading}
                    {...rest}
                    onCancel={onCancel}
                    onOk={() => {
                        alert(conditionId);
                    }}
                >
                    {
                        conditionList && conditionList.length>0 && conditionList.map((item,i)=>(
                            <List.Item key={i} actions={[
                                                    <Button type={item.isAnd?"primary":'default' }  shape="circle" size='small'>
                                                        {item.isAnd?'与':'或'}
                                                    </Button>
                                                    ,
                                                    <a onClick={this._delCondition.bind(this,i)}>删除</a>
                                                ]}>
                                
                                <div>
                                    {this.state.criterionType[item.criterionType-1].name }
                                    {
                                        item.criterionType==1?
                                            this.props.paramList.map(function(li){
                                                if(li.id == item.param ){
                                                    return(
                                                        li.paramDesc +' '+ self.state.condition[item.condition-1].name+' '+item.value
                                                    )
                                                }
                                            })
                                            
                                        :
                                        ''
                                    }
                                    {
                                        item.criterionType==2?
                                        (
                                            <span>
                                                {
                                                    item.alreadyGoHome?'轴已找到原点':'轴未找到原点'
                                                }
                                                {
                                                    item.isIdle?'，轴开，':'，轴关，'
                                                }
                                                轴的实时反馈位置{ item.realTimeMPos }
                                            </span>
                                        )
                                        :
                                        ''
                                    }

                                    {
                                        item.criterionType==3?
                                            this.props.infList[item.infType]&&this.props.infList[item.infType].length>0 ?
                                                this.props.infList[item.infType].map(function(li){
                                                    if(li.id == item.infId ){
                                                        return(
                                                            li.name +' '+ self.state.condition[item.condition-1].name+' '+item.value
                                                        )
                                                    }
                                                })
                                            :
                                               ( this.props.infList[item.infType]&&this.props.infList[item.infType].name?this.props.infList[item.infType].name:'') +' '+ self.state.condition[item.condition-1].name+' '+item.value
                                        :
                                        ''
                                    }
                                    {
                                        item.criterionType==4?
                                        item.workMode?'--手动':'--自动'
                                        :
                                        ''
                                    }
                                </div>

                            </List.Item>
                        ))
                    }

                    <Button type="primary" block  onClick={this.handlers._addCondition.bind(this)}>添加条件+</Button>

                </Modal>

                <ModalAddCondition 
                    title="添加条件"
                    visible={ !!mode }
                    onCancel={ this.handlers._onCancel.bind(this) }
                    formData={this.state.formData}
                    defaultData={this.state.data}
                    onSubmit={this.handlers._submit.bind(this)}
                    onChange={this.handlers.onChange.bind(this)}
                    paramList={this.props.paramList}
                    infList={this.props.infList}
                    condition={this.state.condition}
                    criterionType={this.state.criterionType}
                />
            </div>
        )
    }
}
