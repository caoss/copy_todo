/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Tabs, message, Card, Button, Popconfirm } from 'antd'
import ModalCustomForm from '../../../../../components/ModalCustomForm/index'
import CustomTable from '../../../../../components/CustomTable'

const TabPane = Tabs.TabPane

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      mode: 0,
      data: {},
      pagination: {},
      activeIndex: 0,
      panes: [
        { title: '工程师参数配置', key: 1 },
        { title: '点位配置', key: 2 },
        { title: '按钮配置', key: 3 }
      ],
      columns: [
        {
          title: '参数名称',
          dataIndex: 'param',
          filterForm: {
            type: 'text',
            label: '参数名称',
            valueKey: 'param',
            value: ''
          }
        },
        {
          title: '参数值',
          dataIndex: 'paramVal'
        },
        {
          title: '参数描述',
          dataIndex: 'paramDesc'
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
                    mode: 2
                  })
                }}
              >
                编辑
              </Button>
            </div>
          )
        }
      ],
      formData: [
        {
          type: 'text',
          label: '参数名称',
          valueKey: 'param',
          required: true,
          value: ''
        },
        {
          type: 'text',
          label: '参数值',
          valueKey: 'paramVal',
          value: '',
          required: true
        },
        {
          type: 'textarea',
          label: '参数描述',
          valueKey: 'paramDesc',
          value: '',
          required: true
        },
        {
            type: 'select',
            label: '值类型',
            valueKey: 'valType',
            required:true,
            items:[
                { label:'整型',value:1 },
                { label:'浮点型',value:2 },
                { label:'字符型',value:3 },
                { label:'布尔型',value:4 },
                { label:'文件路径',value:5 },
            ]
          },
      ]
    }
  }

  componentDidMount() {
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { mode, data } = this.state
       const softwareId = global.softwareId;
        if (!err) {
          if (mode === 1) {
            mainboardStore
              .createParams({ ...values, softwareId,paramType:this.props.type })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  this.setState({
                    pagination: { current: 1 }
                  })
                  eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          } else {
            mainboardStore
              .editParams({ softwareId, id: data.id,paramType:this.props.type,...values })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          }
        }
      }),
    onTableChange: (page, params) => {
      const { mainboardStore } = this.props.store
      const { search = '', ...rest } = params
     const softwareId = global.softwareId;
      const pagination = Object.assign({}, this.state.pagination, page)
      this.setState({ pagination })
      return new Promise((r, j) => {
        mainboardStore
          .getParamsList({
            ...rest,
            softwareId,
            pageNum: pagination.current,
            paramType:this.props.type,
            pageSize: pagination.pageSize ? pagination.pageSize : 10
          })
          .then(res => {
            r(res)
          })
          .catch(err => {
            j(err)
          })
      })
    },
  }
  render() {
    const { mainboardStore } = this.props.store
    const {
      formData,
      columns,
      mode,
      data,
      pagination,
    } = this.state
    const paramsData = mainboardStore.paramsData
    const paginationData = Object.assign({}, pagination, {
      total: paramsData.total,
      showSizeChanger: true
    })
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selection = selectedRows
      }
    }
    return (
    <div style={{ 'background':'#fff',padding:'20px' }}>
        <div className="right">
            <Card bordered={false} style={{ backgroundColor: '#FFF' }}>
                <div style={{ paddingBottom: '24px' }}>
                    <Button
                    type="primary"
                    style={{ marginRight: '8px' }}
                    onClick={() => {
                        this.setState({ mode: 1, data: {} })
                    }}
                    >
                    增加参数
                    </Button>
                </div>
                <CustomTable
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={paramsData.list}
                    pagination={paginationData}
                    onTableChange={this.handlers.onTableChange}
                />
            </Card>
        </div>
    
        <ModalCustomForm
          title="参数管理"
          visible={!!mode}
          destroyOnClose
          onCancel={() => {
            this.setState({ mode: 0 })
          }}
          onSubmit={this.handlers.onSubmit}
          formData={formData}
          defaultData={data}
        />
      </div>
    )
  }
}
export default Index
