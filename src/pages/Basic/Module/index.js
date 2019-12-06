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
      pagination: { pageSize: 10 },
      data: {},
      loading: false,
      columns: [
        {
          title: '模组名称',
          dataIndex: 'groupName'
        },
        {
          title: '版本编号',
          dataIndex: 'interfaceIds'
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
            </div>
          )
        }
      ],
      formData: [
        {
          type: 'text',
          label: '模组名称',
          valueKey: 'groupName',
          required: true
        },
        {
          type: 'text',
          label: '模组Id',
          valueKey: 'interfaceIds',
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

  componentDidMount() {}

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { moduleStore } = this.props.store
        const { mode, data } = this.state
        const { id } = this.props.match.params
        if (!err) {
          if (mode === 1) {
            moduleStore
              .createModule({
                softwareId: id,
                ...values
              })
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
            moduleStore
              .editModule({ softwareId: id, id: data.id, ...values })
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
      const { moduleStore } = this.props.store
      const { id } = this.props.match.params
      moduleStore.removeModule({ idList }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          eventBus.emit('onTableChange')
        } else {
          message.error(res.message)
        }
      })
    },
    onTableChange: (page, params) => {
      const { moduleStore } = this.props.store
      const { search = '', ...rest } = params
      const { id } = this.props.match.params
      const pagination = Object.assign({}, this.state.pagination, page)

      this.setState({ pagination })
      return new Promise((r, j) => {
        moduleStore
          .getModuleList({
            ...rest,
            softwareId: id,
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
    const { moduleStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state
    const dataSource = moduleStore.moduleData
    const paginationData = Object.assign({}, pagination, {
      total: dataSource.total,
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
            创建模组
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
          dataSource={dataSource.list}
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
