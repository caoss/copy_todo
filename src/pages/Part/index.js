/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message, Checkbox, Row, Col,Icon,Tabs } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm'
import CustomTable from '../../components/CustomTable'

import Part1 from './Part1'
import Part2 from './Part2'
import Part3 from './Part3'

const { TabPane } = Tabs;

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      mode: 0,
      pagination: {},
      data: {},
      inList:[],
      outList:[],
      loading: false,
      selectMG: null,
      selectMGInfo:{},
    }
  }

  componentDidMount() {
    this._getList();
    this._getInList(1);//in
    this._getInList(2);//out
  }
  _getList(){
    const { partStore } = this.props.store
    partStore.getList().then(res=>{
        console.log('res----',res)
        resolve(res)
    });
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

    callback(key) {
    }


  render() {
    const { partStore } = this.props.store
    let partList = partStore.partList;
    let { inList,outList } = this.state;
    return (
      <Card bordered={false} className="point-config">
            <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                <TabPane tab="双控电磁阀气缸" key="1">
                    <Part1  
                        data={ partList }
                        inList={inList}
                        outList={outList}
                        _callback={this._getList.bind(this)}
                    />
                </TabPane>
                <TabPane tab="真空气压表" key="2">
                    <Part2 
                        data={ partList }
                        inList={inList}
                        outList={outList}
                        _callback={this._getList.bind(this)}
                    />
                </TabPane>
                <TabPane tab="塔灯" key="3">
                    <Part3 
                        data={ partList }
                        inList={inList}
                        outList={outList}
                        _callback={this._getList.bind(this)}
                    />
                </TabPane>
            </Tabs>
      </Card>
    )
  }
}
export default Index
