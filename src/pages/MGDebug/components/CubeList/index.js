/**
 * @author YM
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
    if(this.props.data){
        if( this.props.data.cubeIds ){
            this.setState({
              selAxis:JSON.parse(this.props.data.cubeIds)
            })
        }else{
          this.setState({
              selAxis:[]
            })
        }
    }
      this._getCubeList();
  }
  _getCubeList(){
    const { cubeStore } = this.props.store
    return new Promise(function (resolve, reject) {
        cubeStore.getList().then(res=>{
            resolve(res)
        });
    });
}
  componentWillReceiveProps(nextProps) {
      if(nextProps.data){
          if( nextProps.data.cubeIds ){
              this.setState({
                selAxis:JSON.parse(nextProps.data.cubeIds)
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
        obj.cubeIds = JSON.stringify(selAxis);
    }else{
        message.error('选择OUT口')
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
  
//   onDoubleClick={}
  renderContent() {
    const { cubeStore } = this.props.store
    let axisList= cubeStore['cubeList'];
    let { selAxis } = this.state;
    let self = this;
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
                            axisList.map(function(item,i){
                                if( !selAxis.includes(item.id)){
                                    return(
                                        <div onDoubleClick={self._selectAxis.bind(self,item.id)} className='axis_li' key={item.id} >{item.cubeName}</div>
                                    )
                                }
                            })
                        }
                    </div>
                </Col> 

                <Col span={6} className='cusk'>
                    <h3>
                        已选
                    </h3>
                    <div className='cusk2 sel'>
                        {
                            axisList.map(function(item,index){
                                if( selAxis.includes(item.id)){
                                    return(
                                        <div className='axis_li'  onDoubleClick={self._delAxis.bind(self,item.id)}  key={item.id} >{item.cubeName}</div>
                                    )
                                }
                            })
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
