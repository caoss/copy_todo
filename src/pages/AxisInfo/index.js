/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Table, Card, Button, Popconfirm, message } from 'antd'
import { timeFormat } from '../../utils/Utils'
import SystemUtils from '../../utils/SystemUtil'
import CustomTable from '../../components/CustomTable'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      pagination: {},
      data: {},
      loading: false,
      columns: [
        {
          title: '轴名称',
          dataIndex: 'axisName',
        },
        {
          title: '轴状态',
          dataIndex: 'axisStatus',
        },
        {
          title: '是否过原点',
          render: (id, row, index) => (
            <div>
              { row.alreadyGoHome?'是':'否' }
            </div>
          )
        },
        {
          title: '是否使能',
          render: (id, row, index) => (
            <div>
              { row.servoOn?'是':'否' }
            </div>
          )
        },
        {
          title: '实时MPos',
          dataIndex: 'realTimeMPos',
        },
        {
          title: '实时DPos',
          dataIndex: 'realTimeDPos',
        },
        {
            title: '是否报警',
            render: (id, row, index) => (
              <div>
                { row.almOn?'是':'否' }
              </div>
            )
          },
        {
            title: '是否空闲',
            render: (id, row, index) => (
              <div>
                { row.idle?'是':'否' }
              </div>
            )
          },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        // {
        //   title: '操作',
        //   dataIndex: 'id',
        //   key: 'x',
        //   render: (id, row, index) => (
        //     <div>
        //       <Popconfirm
        //         title="确定删除版本?"
        //         okText="Yes"
        //         cancelText="No"
        //         onConfirm={() => {
        //           // console.log('data, row, index', data, row, index)
        //           self.handlers.removeVersion([row.id])
        //         }}
        //       >
        //         <Button type="danger" style={{ marginRight: '8px' }}>
        //           删除
        //         </Button>
        //       </Popconfirm>
              
        //     </div>
        //   )
        // }
      ]
    }
  }

  componentDidMount() {
    // this._getVersionList()
    let self = this;
    const { mainboardStore } = this.props.store
    this.t = setInterval(function(){
        mainboardStore.getAxisMsg().then(res=>{
            console.log(res);
            if(res && res.code!='0'){
                message.error(res.msg)
                clearInterval(self.t)
            }
        });
    },1000)
  }

  componentWillUnmount(){
      clearInterval(this.t)
  }


  render() {
    const { mainboardStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state

    const axisMsg = mainboardStore.axisMsg
    
    return (
        <div className="workflow-page">
            <Card bordered={false} style={{
               background:'#fff',
               height:'100%',
               overflow:'scroll'
             }}>
                <Table
                    bordered
                columns={columns}
                dataSource={axisMsg.list}
                />
            </Card>
        </div>
    )
  }
}
export default Index
