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
import ModalCustomForm from '../../components/ModalCustomForm';


const { TabPane } = Tabs;

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    let self = this;
    this.state = {
      pagination: {},
      data: {},
      loading: false,
      currentI:true,
      itemId:'',
      cardId:'',
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
        {
            title: '操作',
            dataIndex: 'id',
            key: 'x',
            render: (id, row, index) => (
              <div>
                <Button
                  type="primary"
                  style={{ marginRight: '8px' }}
                  onClick={() => {
                    self.setState({
                      data: row,
                      mode: 2,
                      itemId:row.id,
                      cardId:row.cardId,
                    })
                  }}
                >
                  编辑
                </Button>

                <Button
                  type="primary"
                  style={{ marginRight: '8px' }}
                  onClick={
                    self._setInvert.bind(self,row)
                  }
                >
                  {this.state.currentI?'切换反转':'切换开关'}
                </Button>

              </div>
            )
          }
      ],
      formData: [
        {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 1,
            items: [{ label: 'I口', value: 1 }, { label: 'O口', value: 2 }],
            disabled: true
          },
          {
            type: 'select',
            label: '反转标志',
            valueKey: 'invertFlag',
            value: 0,
            items: [{ label: '不反转', value: 0 }, { label: '反转', value: 1 }]
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
      ],
      formData_o: [
        {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 2,
            items: [{ label: 'I口', value: 1 }, { label: 'O口', value: 2 }],
            disabled: true
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
        ],
    }
  }

  componentDidMount() {
        this.getData(1);
  }
  
  componentWillUnmount(){
}

  callback(key) {
    if(key==1){
        this.setState({
            currentI:true,
        })
        this.getData(key)
    }else if(key ==2 ){
        this.setState({
            currentI:false,
        })
        this.getData(key)
    }
  }
  _setInvert(row){
      let id = row.id;
      let self = this;
      const { mainboardStore } = this.props.store
      if(this.state.currentI){
        let invertFlag = row.invertFlag?0:1;
        mainboardStore.setIinvert({id,invertFlag}).then(res=>{
            if (res.code === '0') {
                let key =  this.state.currentI?1:2;
                setTimeout(function(){
                    self.getData(key);
                },1000)
            }
        });
      }else{
        let value = row.value=='on'?'off':'on';
        mainboardStore.setOinvert({infId:id,value}).then(res=>{
            if (res.code === '0') {
                let key =  this.state.currentI?1:2;
                setTimeout(function(){
                    self.getData(key);
                },1000)
            }
        });
      }
  }

  getData(type){
    const { mainboardStore } = this.props.store
        mainboardStore.getIoMsg({
            interfaceType:type
        }).then(res=>{
            console.log(res);
            if(res && res.code!='0'){
                message.error(res.msg)
            }
        });
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { id } = this.props
        const { itemId,cardId,currentI } = this.state

        if (!err) {
          console.log('value--------', values)
            mainboardStore
              .editPort({ ...values, cardId, id: itemId })
              .then(res => {
                if (res.code === '0') {
                    let key =  currentI?1:2;
                    this.getData(key);
                  r(res)
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
        }
      }),
  }

  render() {
    const { mainboardStore } = this.props.store
    const { formData,formData_o, columns, mode, data, pagination,currentI} = this.state

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


                <ModalCustomForm
                title="版本"
                visible={!!mode}
                destroyOnClose
                onCancel={() => {
                    this.setState({ mode: 0 })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={currentI?formData:formData_o}
                defaultData={data}
                />

            </Card>
        </div>
    )
  }
}
export default Index
