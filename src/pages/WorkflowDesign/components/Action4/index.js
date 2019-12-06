/**
 * @author 
 */
import React, { Component } from 'react'
import { Icon, Modal,Layout,Button,message,Checkbox ,Popconfirm} from "antd";
import { toJS } from 'mobx'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}



  componentWillReceiveProps(nextProps) {}

  render() {
    let self = this;
    let { li3,index,step_i,i3,imgs,imgs_c,_edit,_addCriteria,_addCondition,_delStep,step_config,_changeEnable,_editCriteria,_delCriteria } = this.props; 
    return(
        <div className={ li3.expand ?'':'hide' }>
        {
            li3.steps&& li3.steps.length>0?
                li3.steps.map((li4,i4)=>{
                    return(
                        <div className='li2' key={ i4 }>
                            <img className='actionIcon' src={imgs[li4.stepType-1] } />
                            —— { li4.stepName?li4.stepName:'没有名字' }
                            <Button className='icon_edit' onClick={ _edit.bind(toJS(li4),{ id:li3.id,index,type:4,i3:step_i,i:i3,index1:index,index2:step_i,index3:i3,index4:i4 }) }  icon="form" /> 
                            <Button className='icon_edit' onClick={ _addCriteria(toJS(li4),{ id:li3.id,index,type:4,i3:step_i,i:i3 }) }  icon="plus" >
                                条件
                            </Button> 
                            {
                                li4.stepType == 1 || li4.stepType == 2?
                                    <span>
                                    <Button className='icon_edit' onClick={ _addCondition({ parentId:li4.id }) }  icon="plus" >
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
                                onConfirm={_delStep(li4.id,{ id:li3.id,index,type:4,i3:step_i,i:i3 })}
                            >
                                <Button className='icon_edit' type="danger"  icon="delete"/> 
                            </Popconfirm>
                            <Button  onClick={step_config(li4.id)}  className='icon_carrary' type='primary' >
                                调试
                            </Button>

                            {
                                li4.enableFlag?
                                    <Button className='icon_clo' onClick={_changeEnable({type:0,id:li4.id,i1:index,i2:step_i,i3,i4})} type='primary' >
                                        关闭使能
                                    </Button> 
                                :
                                    <Button className='icon_clo' onClick={_changeEnable({type:1,id:li4.id,i1:index,i2:step_i,i3,i4})} type='primary' >
                                        使能
                                    </Button> 
                            }

                            <ul className='criteria'>
                                {
                                    li4.criteriaList && li4.criteriaList.length>0?
                                        li4.criteriaList.map( (cr_li,i)=>{

                                            return(
                                                <li className='li2' key={ i }>
                                                    <img className='actionIcon' src={imgs_c[cr_li.criteriaType-1] } />
                                                    —— { cr_li.criteriaName }
                                                    <Button onClick={ _editCriteria(toJS(cr_li),{ id:li3.id,index,type:4,i3:step_i,i:i3 })}   size='small' className='icon_edit'  icon="form" /> 
                                                    <Popconfirm
                                                        title="确定删除此条件?"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onConfirm={  _delCriteria(toJS(cr_li),{ id:li3.id,index,type:4,i3:step_i,i:i3 })  }
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

    )
  }
}
export default Index
