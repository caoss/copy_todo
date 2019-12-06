/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Tabs, message, Card, Button, Popconfirm } from 'antd'
import Params1 from './components/params1'

const TabPane = Tabs.TabPane

@inject('store')
@observer
class Index extends Component {
    constructor(props) {
        super(props)
        this.state={
            type:1
        }
    }

    componentDidMount() {}

    callback(key) {
        this.setState({
            type:key
        },()=>{
            eventBus.emit('onTableChange')
        })
    }   
  render() {
    return (
      <div style={{ 'background':'#fff',padding:'20px' }}>
            <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                <TabPane tab="工程师参数" key="1">
                </TabPane>
                <TabPane tab="流程变量" key="2">
                </TabPane>
            </Tabs>
            <Params1 type={this.state.type}/>
      </div>
    )
  }
}
export default Index
