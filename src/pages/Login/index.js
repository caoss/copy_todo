/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Button, Row, Col, Card, Form, Input, Icon,Select } from 'antd'
import SystemUtil from '../../utils/SystemUtil'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
@inject('store')
@observer
class Index extends Component {
  state = {
    userName: '',
    password: ''
  }

  componentDidMount() {
    // dialog.showOpenDialog()
  }

  handlers = {
    handleSubmit: e => {
      e.preventDefault()

      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
        const { userStore } = this.props.store
        userStore.login()
        SystemUtil.push('/')
      })
    }
  }
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form
    return (
      <div className="login-page">
        <p className="title">  
            希盟工控引擎
        </p>  
        <Form onSubmit={this.handlers.handleSubmit} className="login-form">
          {/* <Form.Item>
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: 'Please input your username!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item> */}
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: 'Please input your username!' }
              ]
            })(
                <Select defaultValue="Admin" 
                    prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Username"
                onChange={this.handleChange.bind(this)}>
                    <Option value="Admin">Admin</Option>
                    <Option value="Enginer">Engineer</Option>
                    <Option value="Operator">Operator</Option>
                </Select>
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              className="login-form-button"
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const Login = Form.create({
  name: 'login',
  onValuesChange: (props, changedValues, allValues) => {}
})(Index)

export default Login
