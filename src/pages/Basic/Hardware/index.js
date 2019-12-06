/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Card, Button, Popconfirm, message } from 'antd'
import SystemUtils from '../../../utils/SystemUtil'
import ModalCustomForm from '../../../components/ModalCustomForm'
import CustomTable from '../../../components/CustomTable'

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
      loading: false,
      columns: [
        {
          title: '硬件名称',
          dataIndex: 'hardwareName'
          // filterForm: {
          //   type: 'text',
          //   label: '版本名称',
          //   valueKey: 'versionName',
          //   value: ''
          // }
        },
        {
          title: '品牌',
          dataIndex: 'brandName'
          // filterForm: {
          //   type: 'text',
          //   label: '版本编号',
          //   valueKey: 'versionNum',
          //   value: ''
          // }
        },
        {
          title: '型号',
          dataIndex: 'modelNum'
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
              <Popconfirm
                title="确定删除版本?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  // console.log('data, row, index', data, row, index)
                  self.handlers.removeHardware([row.id])
                }}
              >
                <Button type="danger" style={{ marginRight: '8px' }}>
                  删除
                </Button>
              </Popconfirm>
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
          label: '硬件名称',
          valueKey: 'hardwareName',
          required: true
        },
        {
          type: 'select',
          label: '硬件类型',
          valueKey: 'hardwareType',
          required: true,
          value: 1,
          items: [
            { label: '以太网运动控制卡', value: 1 },
            { label: 'IO扩展卡', value: 2 },
            { label: '模拟量扩展卡', value: 3 },
            { label: '电机', value: 4 },
            { label: '气缸', value: 5 },
            { label: 'PLC', value: 6 }
          ]
        },
        {
          type: 'text',
          label: '品牌',
          valueKey: 'brandName',
          required: true
        },
        {
          type: 'text',
          label: '型号',
          valueKey: 'modelNum',
          required: true
        },
        {
          type: 'textarea',
          label: '备注',
          valueKey: 'remark'
        }
      ]
    }
  }

  componentDidMount() {
    // this._getVersionList()
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { hardwareStore } = this.props.store
        const { mode, data } = this.state
        if (!err) {
          if (mode === 1) {
            hardwareStore
              .createHardware(values)
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
            hardwareStore
              .editHardware({ id: data.id, ...values })
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
    removeHardware: idList => {
      const { hardwareStore } = this.props.store
      hardwareStore.removeHardware({ idList }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          eventBus.emit('onTableChange')
        } else {
          message.error(res.message)
        }
      })
    },
    onTableChange: (page, params) => {
      const { hardwareStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      this.setState({ pagination })
      return new Promise((r, j) => {
        hardwareStore
          .getHardwareList({
            ...rest,
            pageNum: pagination.current,
            pageSize: pagination.pageSize ? pagination.pageSize : 10
          })
          .then(res => {
            r(res)
          })
          .catch(err => {
            j(err)
          })
      })
    }
  }

  render() {
    const { hardwareStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state
    const hardwareData = hardwareStore.hardwareData
    const paginationData = Object.assign({}, pagination, {
      total: hardwareData.total,
      showSizeChanger: true
    })
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selection = selectedRows
      }
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name
      // })
    }
    return (
      <Card bordered={false}>
        <div style={{ paddingBottom: '24px' }}>
          <Button
            type="primary"
            style={{ marginRight: '8px' }}
            onClick={() => {
              this.setState({ mode: 1, data: {} })
            }}
          >
            创建硬件
          </Button>
          <Popconfirm
            title="确定批量删除版本?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              const { selection } = this
              if (selection && selection.length) {
                const idList = []
                for (const r of selection) {
                  idList.push(r.id)
                }

                this.handlers.removeHardware(idList)
              }
            }}
          >
            <Button type="danger">批量删除</Button>
          </Popconfirm>
        </div>
        <CustomTable
          rowSelection={rowSelection}
          columns={columns}
          dataSource={hardwareData.list}
          pagination={paginationData}
          onTableChange={this.handlers.onTableChange}
        />
        <ModalCustomForm
          title="版本"
          visible={!!mode}
          destroyOnClose
          onCancel={() => {
            this.setState({ mode: 0 })
          }}
          onSubmit={this.handlers.onSubmit}
          formData={formData}
          defaultData={data}
        />
      </Card>
    )
  }
}
export default Index
