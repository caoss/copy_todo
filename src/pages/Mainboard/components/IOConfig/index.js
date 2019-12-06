/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Tabs, message } from 'antd'
import ModalCustomForm from '../../../../components/ModalCustomForm/index'
import Scrollbar from '../../../../components/Common/Scrollbar'
import IOList from '../IOList/index'

const TabPane = Tabs.TabPane
@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 0,
      optionType: 1,
      data: {},
      activeIndex: 1,
      ioPanes: [
        { title: 'I口', key: 1 },
        { title: 'O口', key: 2 },
        { title: '模拟量输入口', key: 3 },
        {
          title: '模拟量输出口',
          key: 4
        }
      ],
      formData: [
        {
          type: 'text',
          label: '名称',
          valueKey: 'interfaceName',
          required: true,
          items: [],
          value: ''
        },
        {
          type: 'select',
          label: '类型',
          valueKey: 'interfaceType',
          value: 1,
          items: [{ label: 'I口', value: 1 }, { label: 'O口', value: 2 }],
          disabled: true
        },
        {
          type: 'select',
          label: '反转标志',
          valueKey: 'invertFlag',
          value: 0,
          items: [{ label: '不反转', value: 0 }, { label: '反转', value: 1 }]
        },
        {
          type: 'number',
          label: '下标',
          valueKey: 'interfaceIndex',
          value: 0
        },
        {
          type: 'textarea',
          label: '备注',
          valueKey: 'remark',
          value: ''
        }
      ],
      formDataO: [
        {
          type: 'text',
          label: '名称',
          valueKey: 'interfaceName',
          required: true,
          items: [],
          value: ''
        },
        {
          type: 'select',
          label: '类型',
          valueKey: 'interfaceType',
          value: 2,
          items: [{ label: 'I口', value: 1 }, { label: 'O口', value: 2 }],
          disabled: true
        },
        {
          type: 'number',
          label: '下标',
          valueKey: 'interfaceIndex',
          value: 0
        },
        {
          type: 'textarea',
          label: '备注',
          valueKey: 'remark',
          value: ''
        }
      ],
      formList: {
        '1': [
          {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 1,
            items: [{ label: 'I口', value: 1 }, { label: 'O口', value: 2 }],
            disabled: true
          },
          {
            type: 'select',
            label: '反转标志',
            valueKey: 'invertFlag',
            value: 0,
            items: [{ label: '不反转', value: 0 }, { label: '反转', value: 1 }]
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
        ],
        '2': [
          {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 2,
            items: [
              { label: 'I口', value: 1 },
              { label: 'O口', value: 2 },
              { label: '模拟量输入口', value: 3 },
              {
                label: '模拟量输出口',
                value: 4
              }
            ],
            disabled: true
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
        ],
        '3': [
          {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 3,
            items: [
              { label: 'I口', value: 1 },
              { label: 'O口', value: 2 },
              { label: '模拟量输入口', value: 3 },
              {
                label: '模拟量输出口',
                value: 4
              }
            ],
            disabled: true
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
        ],
        '4': [
          {
            type: 'text',
            label: '名称',
            valueKey: 'interfaceName',
            required: true,
            items: [],
            value: ''
          },
          {
            type: 'select',
            label: '类型',
            valueKey: 'interfaceType',
            value: 4,
            items: [
              { label: 'I口', value: 1 },
              { label: 'O口', value: 2 },
              { label: '模拟量输入口', value: 3 },
              {
                label: '模拟量输出口',
                value: 4
              }
            ],
            disabled: true
          },
          {
            type: 'number',
            label: '下标',
            valueKey: 'interfaceIndex',
            value: 0
          },
          {
            type: 'textarea',
            label: '备注',
            valueKey: 'remark',
            value: ''
          }
        ]
      }
    }
  }

  componentDidMount() {
    const { id } = this.props
    if (id) {
      this._getPortList({ interfaceType: this.state.activeIndex })
    }

    eventBus.on('IOList', this._getPortList.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.id != this.props.id) {
      this._getPortList({
        interfaceType: this.state.activeIndex,
        cardId: nextProps.id
      })
    }
  }

  _getPortList(data = {}) {
    const { mainboardStore } = this.props.store
    const { id, softwareId } = this.props
    mainboardStore.getPortList({
      cardId: id,
      softwareId,
      interfaceType: this.state.activeIndex,
      ...data
    })
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { id } = this.props
        const { optionType, itemId } = this.state

        if (!err) {
          console.log('value--------', values)
          if (optionType == 2) {
            mainboardStore
              .editPort({ ...values, cardId: id, id: itemId })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  this._getPortList({ interfaceType: this.state.activeIndex })
                  this.setState({
                    pagination: { current: 1 }
                  })
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          } else {
            mainboardStore
              .createPort({ ...values, cardId: id })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  this._getPortList({ interfaceType: this.state.activeIndex })
                  this.setState({
                    pagination: { current: 1 }
                  })
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

    removePort: idList => {
      const { mainboardStore } = this.props.store
      mainboardStore.removePort({ idList }).then(res => {
        if (res.code === '0') {
          this._getPortList({ interfaceType: this.state.activeIndex })
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
    },

    portItemClick: data => {
      this.setState({
        mode: this.state.activeIndex,
        data,
        itemId: data.id,
        optionType: 2
      })
    },

    onTabsChange: activeIndex => {
      this.state.activeIndex = parseInt(activeIndex)
      this._getPortList({ interfaceType: this.state.activeIndex })
    }
  }

  render() {
    const {
      formData,
      formDataO,
      formList,
      data,
      mode,
      activeIndex
    } = this.state
    const { mainboardStore } = this.props.store
    const portData = mainboardStore.portData

    return (
      <div className="io">
        <Tabs
          type="card"
          onChange={this.handlers.onTabsChange}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {this.state.ioPanes.map(ioPane => (
            <TabPane
              tab={ioPane.title}
              key={ioPane.key}
              closable={ioPane.closable}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <div className="btn">
                <span
                  className="btn-content"
                  onClick={() => {
                    this.setState({
                      mode: this.state.activeIndex
                    })
                  }}
                >
                  <img
                    src={require('../../../../assets/images/icon_add_min.png')}
                  />
                  <p>添加</p>
                </span>
              </div>
              <div className="io-content">
                <IOList
                  data={toJS(portData.list)}
                  onDelete={this.handlers.removePort}
                  onItemClick={this.handlers.portItemClick}
                />
              </div>
            </TabPane>
          ))}
        </Tabs>
        <ModalCustomForm
          title="IO口管理"
          visible={!!mode}
          destroyOnClose
          onCancel={() => {
            this.setState({ mode: 0 })
          }}
          onSubmit={this.handlers.onSubmit}
          formData={formList[activeIndex.toString()]}
          defaultData={data}
        />
      </div>
    )
  }
}
export default Index
