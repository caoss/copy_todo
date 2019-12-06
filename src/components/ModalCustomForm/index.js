/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, message } from 'antd'
import './index.scss'
import CustomForm from '../CustomForm/index'

export default class ModalCustomForm extends Component {
  static propTypes = {}

  state = {
    errors: null,
    confirmLoading: false
  }

  componentDidMount() {}

  handlers = {}

  render() {
    const { formData, onSubmit, onCancel, defaultData, ...rest } = this.props
    const { confirmLoading } = this.state
    return (
      <Modal
        cancelText="取消"
        okText="确定"
        confirmLoading={confirmLoading}
        {...rest}
        onCancel={onCancel}
        onOk={() => {
          const { form } = this.formRef.props
          form.validateFields((err, values) => {
            if (!err) {
              // console.log('Received values of form: ', values)
              if (onSubmit) {
                this.setState({
                  confirmLoading: true
                })
                const r = onSubmit(err, values)
                  .then(res => {
                    console.log('res-----------', res)
                    this.setState({
                      confirmLoading: false
                    })
                    onCancel && onCancel()
                    message.success(res.message)
                  })
                  .catch(err => {
                    console.log('err-----------', err)
                    this.setState({
                      confirmLoading: false
                    })
                    message.error(err.message ? err.message : err.msg?err.msg:'网络错误')
                  })
              }
            }
          })
        }}
      >
        <CustomForm
          wrappedComponentRef={formRef => {
            this.formRef = formRef
          }}
          data={formData}
          defaultData={defaultData}
        />
      </Modal>
    )
  }
}
