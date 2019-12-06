/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Table, Card, Button, Popconfirm, message } from 'antd'
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
          title: '版本名称',
          dataIndex: 'versionName',
          filterForm: {
            type: 'text',
            label: '版本名称',
            valueKey: 'versionName',
            value: ''
          }
        },
        {
          title: '版本编号',
          dataIndex: 'versionNum',
          filterForm: {
            type: 'text',
            label: '版本编号',
            valueKey: 'versionNum',
            value: ''
          }
        },
        {
          title: '创建时间',
          dataIndex: 'releaseTime'
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
                  self.handlers.removeVersion([row.id])
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
              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={() => {
                  // SystemUtils.push({
                  //   pathname: '/module-design',
                  //   state: { id: data.id }
                  // })
                  SystemUtils.push(`/app/basic/module/${row.id}`)
                  // window.open(`/app/basic/module/${row.id}`)
                }}
              >
                模组管理
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={() => {
                  // SystemUtils.push('/workflow')
                  window.open(`/workflow?id=${row.id}`)
                }}
              >
                流程设计
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  // SystemUtils.push({
                  //   pathname: '/module-design',
                  //   state: { id: data.id }
                  // })
                  window.open(`/module-design?id=${row.id}`)
                }}
              >
                拓扑设计
              </Button>
            </div>
          )
        }
      ],
      formData: [
        {
          type: 'text',
          label: '版本名称',
          valueKey: 'versionName',
          required: true
        },
        {
          type: 'text',
          label: '版本编号',
          valueKey: 'versionNum',
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
        const { versionStore } = this.props.store
        const { mode, data } = this.state
        if (!err) {
          if (mode === 1) {
            versionStore
              .createVersion(values)
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
            versionStore
              .editVersion({ id: data.id, ...values })
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
    removeVersion: idList => {
      const { versionStore } = this.props.store
      versionStore.removeVersion({ idList }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          eventBus.emit('onTableChange')
        } else {
          message.error(res.message)
        }
      })
    },
    onTableChange: (page, params) => {
      const { versionStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      this.setState({ pagination })
      return new Promise((r, j) => {
        versionStore
          .getVersionList({
            ...rest,
            pageNum: pagination.current,
            pageSize: pagination.pageSize
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
    const { versionStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state
    const versionData = versionStore.versionData
    const paginationData = Object.assign({}, pagination, {
      total: versionData.total,
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
            创建版本
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

                this.handlers.removeVersion(idList)
              }
            }}
          >
            <Button type="danger">批量删除</Button>
          </Popconfirm>
        </div>
        <CustomTable
          rowSelection={rowSelection}
          columns={columns}
          dataSource={versionData.list}
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
