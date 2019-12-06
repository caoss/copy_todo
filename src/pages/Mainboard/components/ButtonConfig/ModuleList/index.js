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
        mgIds:[]
    }
  }

  componentDidMount() {
      
  }
 

  componentWillReceiveProps(nextProps) {
      console.log('Props-------------',this.props,nextProps);
      if( ( nextProps.formData&&!this.props.formData) || (nextProps.formData&&this.props.formData&&this.props.formData.id!=nextProps.formData.id)){
          if( nextProps.formData.mgIds ){
              this.setState({
                mgIds:JSON.parse(nextProps.formData.mgIds)
              })
          }else{
            this.setState({
                mgIds:[]
              })
          }
      }
  }
  _selectAxis(id){
    this.state.mgIds.push(id);
    this.setState({
        mgIds:this.state.mgIds.concat([])
      },()=>{
          console.log('mgIds',this.state.mgIds);
      })
  }

  _delAxis(id){
    let index = this.state.mgIds.indexOf(id);
    this.state.mgIds.splice(index,1);
    this.setState({
        mgIds:this.state.mgIds.concat([])
      },()=>{
          console.log('mgIds',this.state.mgIds);
      })
  }

  _subMGAxis(){
    let {mgIds} = this.state;
    
    let obj = this.props.formData;
    if(mgIds.length>0){
        obj.mgIds = JSON.stringify(mgIds);
    }else{
        message.error('选择模组')
        return;
    }
    const { mainboardStore } = this.props.store
    const softwareId = global.softwareId;
        mainboardStore
        .editButton({ id: this.props.id, softwareId,...obj })
        .then(res => {
            if (res.code === '0') {
                message.success(res.message)
                this.props._callBack();
              } else {
                message.error(res.message)
              }
        })
        
  }
  
renderContent() {
    let self = this;
    let moduleList = this.props.data;
    const { mainboardStore } = this.props.store
    let axisList= mainboardStore.axisList;

    let { mgIds } = this.state;
 
    console.log('form', this.props.formData);
    return (
        <div style={{ width:'100%'}}>
            <Row type="flex">
                <Col span={6} className='cusk'>
                    <h3>
                        待选模组
                        <i>(双击选择)</i>
                    </h3>
                    <div className='cusk2'>
                        {
                            
                            moduleList  && moduleList.length >0?
                                moduleList.map(function(item,i){
                                    if( !mgIds.includes(item.id)){
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
                        已选模组
                    </h3>
                    <div className='cusk2 sel'>

                        {
                            
                            moduleList  && moduleList.length >0?
                                moduleList.map(function(item,i){
                                    if( mgIds.includes(item.id)){
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
