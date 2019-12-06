/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Card, Button, Popconfirm, message, Cascader, Row, Col } from 'antd'
import ModalCustomForm from '../../../../components/ModalCustomForm'
import CustomTable from '../../../../components/CustomTable'

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
      selectValue: null,
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          isLeaf: false
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          isLeaf: false
        }
      ],
      columns: [
        {
          title: '点位名称',
          dataIndex: 'pointName'
        },
        {
          title: '位置',
          dataIndex: 'position'
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'x',
          render: (id, row, index) => (
            <div>
              <Popconfirm
                title="确定删除点位?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  // console.log('data, row, index', data, row, index)
                  self.handlers.removeAxisPoint([row.id])
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
          label: '点位名称',
          valueKey: 'pointName',
          required: true
        },
        {
          type: 'number',
          label: '位置',
          valueKey: 'position',
          required: true,
          value: 0
        }
      ]
    }
  }

  componentDidMount() {
      console.log('point');
    // this._getVersionList()
    this._getMainboardList();
    this._getPointList();

  }

  _getPointList(){
    const { mainboardStore } = this.props.store
    const { softwareId } = this.props
    mainboardStore.getPointList( { softwareId } ).then(() => {
    })
  }
  
  _getMainboardList() {
    const { mainboardStore } = this.props.store
    const { softwareId } = this.props
    mainboardStore.getMainboardList({ softwareId }).then(() => {
      const list = mainboardStore.mainboardData.list
      const data = []
      for (const r of list) {
        console.log('r------------------', r)
        data.push({
          value: r.id,
          label: r.remark,
          isLeaf: false
        })
      }

      this.setState({
        options: data
      })
    })
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { mode, data } = this.state
        const axisId = this.state.selectValue ? this.state.selectValue[1] : null
        if (!err) {
          if (mode === 1) {
            mainboardStore
              .createAxisPoint({ axisId, ...values })
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
              .editAxisPoint({ id: data.id, axisId, ...values })
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
    removeAxisPoint: idList => {
      const { mainboardStore } = this.props.store
      mainboardStore.removeAxisPoint({ idList }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          eventBus.emit('onTableChange')
        } else {
          message.error(res.message)
        }
      })
    },
    onTableChange: (page, params) => {
      const { mainboardStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      const axisId = this.state.selectValue ? this.state.selectValue[1] : null
      this.setState({ pagination })
      return new Promise((r, j) => {
        mainboardStore
          .getAxisPointList({
            ...rest,
            axisId,
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
    },
    loadData: selectedOptions => {
      console.log('los----------', selectedOptions)
      const { mainboardStore } = this.props.store
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      mainboardStore
        .getAxisPortList({
          cardId: targetOption.value,
          interfaceType: 5
        })
        .then(() => {
          targetOption.loading = false
          const axisPortData = mainboardStore.axisPortData
          for (const r of axisPortData.list) {
            if (!targetOption.children) {
              targetOption.children = []
            }
            targetOption.children.push({
              label: r.interfaceName,
              value: r.id
            })
          }
          this.setState({
            options: [...this.state.options]
          })
        })
    },
    onSelectChange: (value, selectedOptions) => {
      console.log('value----------------', value, selectedOptions)
      // this.state.selectValue = value
      this.setState(
        {
          selectValue: value
        },
        () => {
          eventBus.emit('onTableChange')
        }
      )
    }
  }

  render() {
    const { mainboardStore } = this.props.store
    const { formData, columns, mode, data, pagination } = this.state
    const axisPointData = mainboardStore.axisPointData
    const paginationData = Object.assign({}, pagination, {
      total: axisPointData.total,
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
      <Card bordered={false} className="point-config">
        <Row type="flex">
          <Col span={6}>
            <div style={{ marginBottom: '16px' }}>轴选择</div>
            <Cascader
              options={this.state.options}
              loadData={this.handlers.loadData}
              onChange={this.handlers.onSelectChange}
              changeOnSelect
            />
          </Col>
          {this.state.selectValue && this.state.selectValue.length == 2 ? (
            <Col span={18}>
              <div style={{ paddingBottom: '24px' }}>
                <Button
                  type="primary"
                  style={{ marginRight: '8px' }}
                  onClick={() => {
                    this.setState({ mode: 1, data: {} })
                  }}
                >
                  增加点位
                </Button>
                <Popconfirm
                  title="确定批量删除点位?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => {
                    const { selection } = this
                    if (selection && selection.length) {
                      const idList = []
                      for (const r of selection) {
                        idList.push(r.id)
                      }

                      this.handlers.removeAxisPoint(idList)
                    }
                  }}
                >
                  <Button type="danger">批量删除</Button>
                </Popconfirm>
              </div>
              <CustomTable
                rowSelection={rowSelection}
                columns={columns}
                dataSource={axisPointData.list}
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
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Card>
    )
  }
}
export default Index
