/**
 * @author 
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Row,Col,Button, message } from 'antd'
import { toJS } from 'mobx';

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
        selAxis:[]
    }
  }

  componentDidMount() {
  }
 

  componentWillReceiveProps(nextProps) {
    //   console.log('nextProps-------------',nextProps);
      if(nextProps.data){
          if( nextProps.data.axisIds ){
              this.setState({
                selAxis:JSON.parse(nextProps.data.axisIds)
              })
          }else{
            this.setState({
                selAxis:[]
              })
          }
      }
  }
  _selectAxis(id){
    this.state.selAxis.push(id);
    this.setState({
        selAxis:this.state.selAxis.concat([])
      },()=>{
          console.log('selAxis',this.state.selAxis);
      })
  }

  _delAxis(id){
    let index = this.state.selAxis.indexOf(id);
    this.state.selAxis.splice(index,1);
    this.setState({
        selAxis:this.state.selAxis.concat([])
      },()=>{
          console.log('selAxis',this.state.selAxis);
      })
  }


  _subMGAxis(){
    let {selAxis} = this.state;
    let obj = this.props.data;
    if(selAxis.length>0){
        obj.axisIds = JSON.stringify(selAxis);
    }else{
        message.error('选择轴')
    }
    const { moduleGroupStore } = this.props.store
        moduleGroupStore.editMG(obj,this.props.id).then(res=>{
            if (res.code === '0') {
                  message.success(res.message)
                } else {
                  message.error(res.message)
                }
        });
  }
  
renderContent() {
    let self = this;
    let moduleList = this.props.data;
    const { mainboardStore } = this.props.store
    let axisList= mainboardStore.axisList;
    let { selAxis } = this.state;
    return (
        <div style={{ width:'100%'}}>
            <Row type="flex">
                <Col span={6} className='cusk'>
                    <h3>
                        待选
                        <i>(双击选择)</i>
                    </h3>
                    <div className='cusk2'>
                        {
                            
                            moduleList  && moduleList.length >0?
                                moduleList.map(function(item,i){
                                    if( !selAxis.includes(item.id)){
                                        return(
                                            <div onDoubleClick={self._selectAxis.bind(self,item.id)} className='axis_li' key={item.id} >{item.mgName}</div>
                                        )
                                    }
                                })
                            :
                            null
                        }
                    </div>
                </Col> 

                <Col span={6} className='cusk'>
                    <h3>
                        已选
                    </h3>
                    <div className='cusk2 sel'>

                        {
                            
                            moduleList  && moduleList.length >0?
                                moduleList.map(function(item,i){
                                    if( selAxis.includes(item.id)){
                                        return(
                                            <div onDoubleClick={self._delAxis.bind(self,item.id)} className='axis_li' key={item.id} >{item.mgName}</div>
                                        )
                                    }
                                })
                            :
                            null
                        }
                        
                    </div>
                </Col>
                <Col span={6} >
                    <Button type="primary" onClick={this._subMGAxis.bind(this)}>确认</Button>
                </Col>
            </Row>
        </div>
    )
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}
export default Index
