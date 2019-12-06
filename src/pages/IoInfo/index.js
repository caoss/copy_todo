/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Table, Card, Button, Popconfirm, message,Tabs } from 'antd'
import { timeFormat } from '../../utils/Utils'
import SystemUtils from '../../utils/SystemUtil'
import CustomTable from '../../components/CustomTable'


const { TabPane } = Tabs;

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {},
      data: {},
      loading: false,
      columns: [
        {
          title: '卡名称',
          dataIndex: 'cardName',
        },
        {
          title: '线号',
          dataIndex: 'interfaceIndex',
        },
        {
          title: '口 名称',
          dataIndex: 'interfaceName',
        },
        {
          title: '是否反转',
          render: (id, row, index) => (
            <div>
              { row.invertFlag?'是':'否' }
            </div>
          )
        },
        {
          title: '值',
          width:'20px',
          render: (id, row, index) => (
            <div>
              { row.value =='on'?
                    <div style={{width:'20px',height:'20px',background:'green',borderRadius:'50%'}} ></div>
                :
                    <div style={{width:'20px',height:'20px',background:'#ddd',borderRadius:'50%'}} ></div>
                }
            </div>
          )
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
      ]
    }
  }

  componentDidMount() {
        this.getData(1);
  }
  
  componentWillUnmount(){
    clearInterval(this.t)
}

  callback(key) {
    clearInterval(this.t);
    if(key==1){
        this.getData(key)
    }else if(key ==2 ){
        this.getData(key)
    }
  }

  getData(type){
    const { mainboardStore } = this.props.store
    let self = this;
    this.t = setInterval(function(){
        mainboardStore.getIoMsg({
            interfaceType:type
        }).then(res=>{
            console.log(res);
            if(res && res.code!='0'){
                message.error(res.msg);
                clearInterval(self.t)
            }
        });
    },1000)
  }

  render() {
    const { mainboardStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state

    const ioMsg = mainboardStore.ioMsg
    
    return (
        <div className="workflow-page"> 
            <Card bordered={false} style={{
               background:'#fff',
               height:'100%',
               overflow:'scroll'
             }}>

                <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                    <TabPane tab="I口" key="1">
                    </TabPane>
                    <TabPane tab="O口" key="2">
                    </TabPane>
                </Tabs>
                <Table
                    size="small" 
                    bordered
                columns={columns}
                dataSource={ioMsg.list}
                pagination={{  // 分页
                    simple: true,
                    pageSize: 200
                }}
                />
            </Card>
        </div>
    )
  }
}
export default Index
