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
        selAxis:[],
        selAxis2:[],
    }
  }

  componentDidMount() {
    if(this.props.data){
        if( this.props.data.partIds ){
            this.setState({
              selAxis:JSON.parse(this.props.data.partIds),
              selAxis2:JSON.parse(this.props.data.partIds),
            },()=>{
            })
        }else{
          this.setState({
              selAxis:[],
              selAxis2:[],
            })
        }
    }
      this._getPartList();
  }

  _getPartList(){
    const { partStore } = this.props.store
    return new Promise(function (resolve, reject) {
        partStore.getList().then(res=>{
            resolve(res)
        });
    });
}
  componentWillReceiveProps(nextProps) {
      if(nextProps.data){
        if( nextProps.data.partIds ){
            this.setState({
              selAxis:JSON.parse(nextProps.data.partIds),
              selAxis2:JSON.parse(nextProps.data.partIds),
            },()=>{
            })
        }else{
          this.setState({
              selAxis:[],
              selAxis2:[],
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
  _selectAxis2(id){
    this.state.selAxis2.push(id);
    this.setState({
        selAxis2:this.state.selAxis2.concat([])
      },()=>{
          console.log('selAxis2',this.state.selAxis2);
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

    uniq(array){
        var temp = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) == -1){
                temp.push(array[i]);
            }
        }
        return temp;
    }

  _delAxis2(id){
    let index = this.state.selAxis2.indexOf(id);
    this.state.selAxis2.splice(index,1);
    this.setState({
        selAxis2:this.state.selAxis2.concat([])
      },()=>{
          console.log('selAxis2',this.state.selAxis2);
      })
  }

  _subMGAxis(){
    let {selAxis,selAxis2} = this.state;
    let obj = this.props.data;
    let arrary = this.uniq(selAxis.concat(selAxis2));
    if(arrary.length>0){
        obj.partIds = JSON.stringify(arrary);
    }else{
        message.error('选择部件')
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
  _setCyline(id,type){
    const { partStore } = this.props.store
    partStore.edit_cylinderMove({
        destType:type,
        partId:id
    }).then(res=>{
        console.log(res.msg);
        if(res.code==='0'){
            // message.success('操作成功')
        }else{
            if(res.msg){
                message.error(res.msg);
            }
        }
    })
  }

  _setVacuumOp(id,type){
    const { partStore } = this.props.store
    partStore.edit_vacuumOp({
        value:type,
        partId:id
    }).then(res=>{
        if(res.code=='0'){
            // message.success('操作成功')
        }else{
            if(res.msg){
                message.error(res.msg);
            }
        }
    })
  }




//   onDoubleClick={}
  renderContent() {
    const { partStore } = this.props.store
    let axisList= partStore['partList'];
    let { selAxis,selAxis2 } = this.state;
    let self = this;
    return (
        <div style={{ width:'100%'}}>
            <div>
                <Row type="flex">
                    <Col span={20} className='cusk'>
                        <h3>
                            气缸
                        </h3>
                        <div className='cusk3'>
                            {
                                axisList.map(function(item,index){
                                    if( item.partType==1 && selAxis.includes(item.id)){
                                        return(
                                            <div className='axis_li' key={item.id} >
                                            <p  className='axis_txt'>
                                                {item.partName}
                                            </p>
                                            <Button
                                                        type="primary"
                                                        style={{ marginRight: '8px' }}
                                                        onClick={self._setCyline.bind(self,item.id,1)}
                                                    >
                                                        原点
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        style={{ marginRight: '8px' }}
                                                        onClick={self._setCyline.bind(self,item.id,2)}
                                                    >
                                                        动点
                                                    </Button>
                                            </div>
                                        )
                                    }
                                })
                            }
                            
                        </div>
                    </Col>
                </Row>
            </div>

            <div style={{marginTop:'50px'}}>
                <Row type="flex">

                { 
                    selAxis2 && selAxis2.length>0?
                        <Col span={20} className='cusk'>
                        <h3>
                            真空
                        </h3>
                        <div className='cusk3'>
                            {
                                axisList.map(function(item,index){
                                    if( item.partType==2 &&selAxis2.includes(item.id)){
                                        return(
                                            <div className='axis_li'  onDoubleClick={self._delAxis2.bind(self,item.id)}  key={item.id} >
                                                <p className='axis_txt'>{item.partName}</p>
                                                    <Button
                                                        type="primary"
                                                        style={{ marginRight: '8px' }}
                                                        onClick={self._setVacuumOp.bind(self,item.id,'on')}
                                                    >
                                                        开
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        style={{ marginRight: '8px' }}
                                                        onClick={self._setVacuumOp.bind(self,item.id,'off')}
                                                    >
                                                        关
                                                    </Button>
                                            </div>
                                        )
                                    }
                                })
                            }
                            
                        </div>
                    </Col>
                    :
                    ''
                }
                </Row>
            </div>
        </div>
    )
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}
export default Index
