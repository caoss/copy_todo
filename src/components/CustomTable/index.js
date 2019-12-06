/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import './index.scss'
import CustomForm from '../CustomForm/index'

class Index extends Component {
  state = {
    filtForm: [],
    selectedRowKeys: [],
    loading: false
  }

  componentDidMount() {
    const { columns } = this.props

    const data = []
    // 生成筛选表单
    for (const r of columns) {
      if (r.filterForm) {
        data.push({ labelCol: {}, wrapperCol: {}, ...r.filterForm })
      }
    }
    // 添加搜索按键
    if (data && data.length) {
      data.push({
        labelCol: {},
        wrapperCol: {},
        type: 'button',
        text: '搜索',
        valueKey: 'search',
        value: 'search',
        onClick: () => {
          this.validateFieldsData({ current: 1 })
        }
      })
    }
    
    // 更新数据重新渲染
    this.setState({
      filtForm: data
    })

    this.waitForWrappedComponentRef(this.formRef)
    eventBus.on('onTableChange', this.eventChangeHandler)
  }

  componentWillUnmount() {
    eventBus.off('onTableChange', this.eventChangeHandler)
  }

  eventChangeHandler = () => {
    // console.log('eventChangeHandler')
    this.validateFieldsData({ current: 1 })
  }

  validateFieldsData = page => {
    const { form } = this.formRef.props
    const { onTableChange } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        onTableChange &&
          onTableChange(page, values)
            .then(res => {
              this.setState({
                loading: false,
                selectedRowKeys: []
              })
            })
            .catch(err => {
              this.setState({
                loading: false
              })
            })
      }
    })
  }

  waitForWrappedComponentRef = formRef => {
    setTimeout(() => {
      if (formRef) {
        this.validateFieldsData({ current: 1 })
        return
      }
      this.waitForWrappedComponentRef(this.formRef)
    }, 5)
  }

  render() {
    const {
      dataSource,
      columns,
      rowSelection,
      onTableChange,
      pagination,
      ...rest
    } = this.props
    const { filtForm, loading, selectedRowKeys } = this.state
    const rowSelectionCofig = Object.assign({}, rowSelection, {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys })
        rowSelection.onChange &&
          rowSelection.onChange(selectedRowKeys, selectedRows)
      }
    })

    // console.log('rowSelectionCofig-------------', rowSelectionCofig)

    return (
      <div>
        <CustomForm
          data={filtForm}
          layout="inline"
          wrappedComponentRef={formRef => {
            this.formRef = formRef
          }}
        />
        <Table
          bordered
          {...rest}
          loading={loading}
          rowSelection={ rowSelection?rowSelectionCofig:null}
          columns={columns}
          dataSource={dataSource}
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据'
          }}
          pagination={{
            ...pagination,
            pageSizeOptions: ['10', '20', '30', '50', '100']
          }}
          onChange={e => {
            this.validateFieldsData(e)
          }}
        />
      </div>
    )
  }
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index
