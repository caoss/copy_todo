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
import { Form, Input, Select, InputNumber, Switch, Col, Button } from 'antd'
import './index.scss'

class CustomForm extends Component {
    static propTypes = {
        form: PropTypes.object
    }

    state = {
        errors: null
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {}

    getForm(form, formItem, layout) {
        let component = null
        const {
        disabled = false,
        label = '',
        extra,
        help,
        span,
        max,
        min,
        text,
        value,
        btnType = 'primary',
        onClick,
        placeholder,
        valuePropName,
        valueKey,
        labelCol = {
            span: 8
            // span: 5
        },
        wrapperCol = {
            span: 16
            // span: 19
        }
        } = formItem
        // 设置初始值
        let initialValue = value

        Object.keys(this.props.defaultData ? this.props.defaultData : {}).map(
            key => {
                if (key === valueKey) {
                initialValue = this.props.defaultData[key]
                }
            }
        )
    // 设置校验规则
        let rules = formItem.required
        ? 
            [
                {
                    required: true,
                    message: label
                }
            ]
        :
            []

        if (formItem.rules) {
            rules = rules.concat(formItem.rules)
        }
        switch (formItem.type) {
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
            case 'selectValue':
                component = <Button type="primary">{formItem.label}</Button>
                break
            case 'boolean':
                component = <Switch disabled={disabled} />
                break
            case 'select':
                component = (
                <Select placeholder={placeholder} disabled={disabled}>
                    {formItem.items &&
                    formItem.items.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                        {item.label}
                        </Select.Option>
                    ))}
                </Select>
                )
                break
            case 'button':
                component = (
                <Button disabled={disabled} type={btnType} onClick={onClick}>
                    {text}
                </Button>
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
                <formItem.component
                    onValidate={this.handlers.onValidate}
                    form={form}
                    configuration={formItem}
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

    if (layout === 'inline') {
        return (
            <Form.Item
            label={label}
            help={help}
            extra={extra}
            colon={false}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            >
            {form.getFieldDecorator(`${valueKey}`, {
                initialValue,
                rules,
                valuePropName:
                typeof initialValue === 'boolean'
                    ? 'checked'
                    : valuePropName || 'value'
            })(component)}
            </Form.Item>
        )
    }

    return (
      <Col key={`${valueKey}`} span={span || 24}>
        <Form.Item
          label={label}
          help={help}
          extra={extra}
          colon={false}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          {form.getFieldDecorator(`${valueKey}`, {
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

    createForm(form, data, rest) {
        return (
            <Form onSubmit={this.handlers.onSubmit} {...rest}>
                {data &&
                data.map(formItem => this.getForm(form, formItem, rest.layout))}
                <div style={{ color: 'transparent' }}>_</div>
            </Form>
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
        },
        onSubmit: e => {
            e.preventDefault()

            // this.props.form.validateFields(err => {
            //   console.log('err--------------------------', err)
            // })
        }
    }

    render() {
        const { data, form, ...rest } = this.props
        return this.createForm(form, data, { ...rest })
    }
}

export default Form.create({
    onValuesChange: (props, changedValues, allValues) => {
        const { onChange } = props
        onChange && onChange(changedValues, allValues)
    }
})(CustomForm)
