/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
// import i18n from 'i18next'
import RenderAttrs from './renderAttrs'
import './index.scss'

class WorkflowNodeConfigurations extends Component {
  static propTypes = {
    // workspaceRef: PropTypes.any,
    // selectedItem: PropTypes.object,
    // workflow: PropTypes.object,
    // descriptors: PropTypes.object,
    attrs: PropTypes.object,
    onChange: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.attrs && nextProps.attrs) {
      if (this.props.attrs !== nextProps.attrs) {
        nextProps.form.resetFields()
      }
    }
  }

  render() {
    const { form, attrs } = this.props
    return <RenderAttrs form={form} attrs={attrs} />
  }
}

const NewWorkflowNodeConfigurations = Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const { onChange, selectedItem } = props
    onChange(selectedItem, changedValues, allValues)
  }
})(WorkflowNodeConfigurations)

export default class WorkflowNodeConfigurationsCon extends Component {
  static propTypes = {
    workspaceRef: PropTypes.any,
    selectedItem: PropTypes.object,
    workflow: PropTypes.object,
    descriptors: PropTypes.object,
    onChange: PropTypes.func
  }

  state = {
    attrs: {}
  }

  componentWillMount() {
    this.handlers.selectedItemChange(this.props.selectedItem)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedItem && nextProps.selectedItem) {
      this.handlers.selectedItemChange(nextProps.selectedItem)
    }
  }

  handlers = {
    onChange: (ele, changedValues, allValues) => {
      const { selectedItem } = this.props
      const model = selectedItem.model
      Object.keys(changedValues).map(key => {
        if (key === 'model') {
          Object.keys(changedValues[key]).map(subKey => {
            if (subKey === 'name') {
              model.setName(changedValues[key][subKey])
            } else if (subKey === 'x') {
              model.setModelBox({ x: changedValues[key][subKey] })
            } else if (subKey === 'y') {
              model.setModelBox({ y: changedValues[key][subKey] })
            }
          })
        }
      })
    },
    selectedItemChange: selectedItem => {
      const { model } = selectedItem
      const modelForm = this.handlers.createModel(model)

      const attrs = Object.assign({}, modelForm)
      this.setState({
        attrs
      })
    },
    createModel(model) {
      const name = model.getName()
      const bbox = model.getModelBox()

      return {
        model: {
          name: '基本属性',
          forms: [
            {
              type: 'text',
              valueKey: 'name',
              label: '名称',
              value: name
            },
            {
              type: 'number',
              disabled: true,
              valueKey: 'width',
              label: '宽度',
              value: bbox.width,
              span: 12
            },
            {
              type: 'number',
              disabled: true,
              valueKey: 'height',
              label: '高度',
              value: bbox.height,
              span: 12
            },
            {
              type: 'number',
              valueKey: 'x',
              label: 'x',
              value: bbox.x,
              span: 12
            },
            {
              type: 'number',
              valueKey: 'y',
              label: 'y',
              value: bbox.y,
              span: 12
            }
          ]
        }
      }
    }
  }

  render() {
    const { selectedItem } = this.props
    const { descriptor } = selectedItem.model.attributes

    return (
      <div className="attr">
        <div className="h-name">硬件类型：{descriptor.type}</div>
        {/* <Divider /> */}
        <NewWorkflowNodeConfigurations
          attrs={this.state.attrs}
          onChange={(ele, changedValues, allValues) => {
            console.log(ele)
            this.handlers.onChange(ele, changedValues, allValues)
          }}
        />
      </div>
    )
  }
}
