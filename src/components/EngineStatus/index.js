/**
 * @author CSS
 */
import React from 'react'
import { Popconfirm, Divider, Button,Card } from 'antd'
import './index.scss'
import { inject, observer } from 'mobx-react'

global.messages = [];
global.getmessage = function(data) {
    console.log('data------------',data);
    global.messages.unshift(data);
}

@inject('store')
@observer
class EngineStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        messages:global.messages,
    }
  }

  componentDidMount() {
    this.getEngineStatus();
  }

  getEngineStatus(){
    const { mainboardStore } = this.props.store
    setInterval(function(){
        mainboardStore.getEngineStatus();
    },1000);
  }
  render() {
    const { mainboardStore } = this.props.store
    let messages = global.messages
    return (
      <div className="header-con">
        <Card style={{ width: 300,marginTop:'60px' }}>
            <p style={{ marginBottom:'10px' }}><b>工作模式：</b>{mainboardStore.engineStatus['workMode'] }</p>
            <p style={{ marginBottom:'10px' }}><b>引擎状态：</b>{mainboardStore.engineStatus['engineStatus'] }</p>
            <p><b>机台状态：</b>{mainboardStore.engineStatus['machineStatus'] }</p>
        </Card>
            <div className='message'>
                    <Divider>通知栏</Divider>
                    {
                        messages && messages.length>0?
                        <div>
                            <Popconfirm
                               title="确定清空?"
                               okText="Yes"
                               cancelText="No"
                               onConfirm={()=>{
                                   global.messages = [];
                               }}
                           >
                               <Button  style={{ marginBottom: '10px' }} className='icon_edit' type="danger"  icon="delete"/> 
                           </Popconfirm>
                               
                               {
                                   messages.map((item,i)=>{
                                       return(
                                           <p key={i}>{item}</p>
                                           )
                                       })
                               }
                        </div>
                        :
                        null
                    }
                </div>
      </div>
    )
  }
}

export default EngineStatus
