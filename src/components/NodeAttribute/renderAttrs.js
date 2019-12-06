/**
 * @author YM
 */
// attrs:{
//     disabled, // 是否使能
//     icon, // 显示图标
//     extra, // 扩展参数
//     help,  //
//     description, // 描述
//     span, // 列宽
//     max, // 最大值
//     min,// 最小值
//     value, // 属性值
//     placeholder, //
//     valuePropName //属性名称
//     rules: []校验规则
//     required: true, //是否必填
//     component: node //自定义属性表单
// }
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Col,
  Tooltip,
  Collapse
} from 'antd'
import './index.scss'

const Panel = Collapse.Panel
export default class NodeConfiguration extends Component {
  static propTypes = {
    attrs: PropTypes.object,
    form: PropTypes.object
  }

  state = {
    errors: null
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedItem && nextProps.selectedItem) {
      if (this.props.selectedItem.id !== nextProps.selectedItem.id) {
        this.setState({
          errors: null
        })
      }
    }
  }

  getForm(form, key, attrConfig) {
    let component = null
    const {
      disabled = false,
      icon,
      label = '',
      extra,
      help,
      description,
      span,
      max,
      min,
      value,
      placeholder,
      valuePropName,
      valueKey
    } = attrConfig

    const initialValue = value
    // 设置校验规则
    let rules = attrConfig.required
      ? [
          {
            required: true,
            message: attrConfig.label
          }
        ]
      : []
    if (attrConfig.rules) {
      rules = rules.concat(attrConfig.rules)
    }
    switch (attrConfig.type) {
      case 'text':
        component = (
          <Input
            disabled={disabled}
            minLength={min}
            maxLength={max}
            placeholder={placeholder}
          />
        )
        break
      case 'textarea':
        component = (
          <Input.TextArea disabled={disabled} placeholder={placeholder} />
        )
        break
      case 'number':
        component = <InputNumber disabled={disabled} min={min} max={max} />
        break
      case 'boolean':
        component = <Switch disabled={disabled} />
        break
      case 'select':
        component = (
          <Select placeholder={placeholder} disabled={disabled}>
            return (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
            ) })}
          </Select>
        )
        break
      case 'tags':
        component = (
          <Select
            mode="tags"
            dropdownStyle={{ display: 'none' }}
            placeholder={placeholder}
            disabled={disabled}
          >
            {initialValue.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        )
        break
      case 'custom':
        component = (
          <attrConfig.component
            onValidate={this.handlers.onValidate}
            form={form}
            configuration={attrConfig}
            selectedItem={this.props.selectedItem}
            disabled={disabled}
          />
        )
        break
      default:
        component = (
          <Input
            minLength={min}
            maxLength={max}
            placeholder={placeholder}
            disabled={disabled}
          />
        )
    }

    return (
      <Col key={`${key}.${valueKey}`} span={span || 24}>
        <Form.Item label={label} help={help} extra={extra} colon={false}>
          {form.getFieldDecorator(`${key}.${valueKey}`, {
            initialValue,
            rules,
            valuePropName:
              typeof initialValue === 'boolean'
                ? 'checked'
                : valuePropName || 'value'
          })(component)}
        </Form.Item>
      </Col>
    )
  }

  createForm(form, attrs) {
    const customPanelStyle = {
      width: '100%',
      background: '#2A2D3E',
      color: '#FFF',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden'
    }
    const components = Object.keys(attrs).map((key, i) => (
      <Panel
        key={key}
        header={<div style={{ color: '#FFF' }}>{attrs[key].name}</div>}
      >
        {attrs[key].forms &&
          attrs[key].forms.map(formItem => this.getForm(form, key, formItem))}
      </Panel>
    ))

    return (
      <Collapse defaultActiveKey={['model']} style={customPanelStyle}>
        {components}
      </Collapse>
    )
  }

  handlers = {
    onValidate: errors => {
      this.setState({
        errors
      })
    },
    aceEditorValidator: (rule, value, callback) => {
      if (this.state.errors && this.state.errors.length) {
        callback(this.state.errors)
        return
      }
      callback()
    },
    cronValidator: (rule, value, callback) => {
      if (this.state.errors && this.state.errors.length) {
        callback(this.state.errors)
        return
      }
      callback()
    }
  }

  render() {
    const { attrs, form } = this.props
    if (!attrs || isEmpty(attrs)) {
      return null
    }
    return this.createForm(form, attrs)
  }
}
