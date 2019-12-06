/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Tabs, message, Card } from 'antd'
import ModalCustomForm from '../../../../components/ModalCustomForm/index'
import Scrollbar from '../../../../components/Common/Scrollbar'
import IOList from '../IOList/index'
import AxisList from '../AxisList/index'
import SliderCustomForm from '../../../../components/SliderCustomForm/index'

const TabPane = Tabs.TabPane
@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const labelParam = {
      wrapperCol: {
        span: 16
      },
      labelCol: {
        span: 8
      }
    }
    this.state = {
      mode: 0,
      paramMode: 0,
      optionType: 1,
      data: {},
      data1: {},
      activeIndex: 5,
      portId: null,
      showAxis: false,
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
          value: 5,
          items: [
            { label: 'I口', value: 1 },
            { label: 'O口', value: 2 },
            { label: '轴口', value: 5 }
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
      formData1: [
        {
          type: 'select',
          label: '轴类型',
          valueKey: 'axisType',
          value: 4,
          items: [
            { label: '正常流水', value: 1 },
            { label: '虚拟轴', value: 0 },
            { label: '脉冲方向方式的步进或伺服', value: 1 },
            {
              label: '模拟信号控制方式的伺服',
              value: 2
            },
            { label: '正交编码器', value: 3 },
            { label: '步进+编码器', value: 4 },
            { label: '脉冲方向方式的编码器，可用于手轮输入', value: 6 },
            { label: '脉冲方向方式步进或伺服+EZ 信号输入', value: 7 },
            { label: 'ZCAN扩展脉冲方向方式步进或伺服', value: 8 },
            { label: 'ZCAN扩展正交编码器', value: 9 },
            { label: 'ZCAN扩展脉冲方向方式的编码器', value: 10 },
            { label: 'ECAT脉冲类型', value: 65 },
            { label: 'ECAT速度闭环', value: 66 },
            { label: 'ECAT力矩闭环', value: 67 },
            { label: 'ECAT自定义操作，只读取编码器', value: 70 }
          ],
          ...labelParam
        },
        {
          type: 'select',
          label: '轴方向',
          valueKey: 'axisDirection',
          value: 'X:Left',
          items: [
            { label: 'X轴:向左', value: 'X:Left' },
            { label: 'X轴:向右', value: 'X:Right' },
            { label: 'Y轴:向上', value: 'Y:Up' },
            {
              label: 'Y轴:向下',
              value: 'Y:Down'
            },
            { label: 'Z轴:向前', value: 'Z:Fwd' },
            { label: 'Z轴:向后', value: 'Z:Back' },
            { label: '旋转轴:顺时针', value: 'R:Clockwise' },
            { label: '旋转轴:逆时针', value: 'R:Inverse' }
          ],
          ...labelParam
        },
        {
          type: 'select',
          label: '脉冲输出模式',
          valueKey: 'invertStep',
          value: 0,
          items: [
            { label: '脉冲加方向模式', value: 0 },
            { label: '双脉冲模式', value: 4 }
          ],
          ...labelParam
        },
        {
          type: 'select',
          label: '回原点模式',
          valueKey: 'homeMode',
          value: 14,
          items: [{ label: '原点+反找模式, 负向回零', value: 14 }],
          ...labelParam
        },
        {
          type: 'number',
          label: '回零速度',
          valueKey: 'homeSpeed',
          value: 0,
          ...labelParam
        },
        {
          type: 'select',
          port: 1,
          label: '报警信号对应输入口',
          valueKey: 'almIn',
          value: '',
          items: [],
          ...labelParam
        },
        {
          type: 'select',
          label: '原点信号对应输入口',
          valueKey: 'datumIn',
          value: '',
          port: 1,
          items: [],
          ...labelParam
        },
        {
          type: 'select',
          label: '正向限位信号对应输入口',
          valueKey: 'fwdIn',
          value: '',
          port: 1,
          items: [],
          ...labelParam
        },
        {
          type: 'number',
          label: '正向软限位',
          valueKey: 'fsLimit',
          value: 0,
          ...labelParam
        },
        {
          type: 'select',
          label: '负向限位信号对应输入口',
          valueKey: 'revIn',
          value: '',
          port: 1,
          items: [],
          ...labelParam
        },
        {
          type: 'number',
          label: '负向软限位',
          valueKey: 'rsLimit',
          value: 0,
          ...labelParam
        },
        {
          type: 'select',
          label: '使能信号对应输出口',
          valueKey: 'servoOut',
          value: '',
          port: 2,
          items: [],
          ...labelParam
        },
        {
          type: 'number',
          label: '轴S曲线时间',
          valueKey: 'sramp',
          value: 0,
          ...labelParam
        },
        {
          type: 'number',
          label: '轴脉冲当量',
          valueKey: 'units',
          value: 0,
          ...labelParam
        },
        {
          type: 'number',
          label: '工作速度',
          valueKey: 'workSpeed',
          value: 1,
          ...labelParam
        },
        {
            type: 'select',
            label: '扭力值对应模拟量输出口',
            valueKey: 'torqueAOut',
            value: 0,
            port: 2,
            items: [],
            ...labelParam
          },
        {
            type: 'select',
            label: '工作模式(位置模式/扭矩模式)切换对应输出口',
            valueKey: 'torqueModeOut',
            value: 0,
            items: [
              { label: '脉冲加方向模式', value: 0 },
              { label: '双脉冲模式', value: 4 }
            ],
            ...labelParam
          },
        {
            type: 'select',
            label: '扭力达到对应输入口',
            valueKey: 'torqueReachIn',
            value: 0,
            items: [
              { label: '脉冲加方向模式', value: 0 },
              { label: '双脉冲模式', value: 4 }
            ],
            ...labelParam
          },
          {
            type: 'select',
            label: '清除报警信号对应输出口',
            valueKey: 'clearAlmOut ',
            value: '',
            port: 2,
            items: [],
            ...labelParam
          },


        {
            type: 'number',
            label: '扩展轴映射地址',
            valueKey: 'extAddress ',
            ...labelParam
        },
        {
            type: 'number',
            label: 'mpos反转标志',
            valueKey: 'reverseMPos',
            value: 0,
            ...labelParam
        },
      ]
    }
  }

  componentDidMount() {
    const { id } = this.props
    if (id) {
      this._getPortList({ interfaceType: this.state.activeIndex })
      this._getIOPortList()
    }
    eventBus.on('AxisList', this._getPortList.bind(this))
  }

  _getIOPortList(data) {
    const { mainboardStore } = this.props.store
    const { id, softwareId } = this.props
    mainboardStore
      .getXPortList({
        softwareId,
        cardId: id,
        interfaceType: 1,
        ...data
      })
      .then(res => {
        console.log('res------------i', res)
        const list = res
        const items = []
        for (const r of list) {
          items.push({
            label: r.interfaceName,
            value: r.id
          })
        }
        for (const r of this.state.formData1) {
          if (r.port && r.port == 1) {
            r.items = items
          }
        }

        this.setState({
          formData1: [...this.state.formData1]
        })
      })
      
    mainboardStore
      .getXPortList({
        softwareId,
        cardId: id,
        interfaceType: 2,
        ...data
      })
      .then(res => {
        const list = res
        const items = []
        for (const r of list) {
          items.push({
            label: r.interfaceName,
            value: r.id
          })
        }
        for (const r of this.state.formData1) {
          if (r.port && r.port == 2) {
            r.items = items
          }
        }

        this.setState({
          formData1: [...this.state.formData1]
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps')
    if (nextProps.id && nextProps.id != this.props.id) {
      this._getPortList({
        interfaceType: this.state.activeIndex,
        cardId: nextProps.id
      })
      this.state.portId = null
    }
  }

  _getPortList(data = {}) {
    const { mainboardStore } = this.props.store
    const { id, softwareId } = this.props
    this.setState({
      showAxis: false
    })
    mainboardStore
      .getPortList({
        softwareId,
        cardId: id,
        interfaceType: this.state.activeIndex,
        ...data
      })
      .then(() => {
        this.setState({
          showAxis: true
        })
      })
  }

  handlers = {
    onSubmit1: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { id } = this.props
        const { optionType, portId } = this.state

        if (!err) {
          mainboardStore
            .createAxisParams({ ...values, axisId: portId })
            .then(res => {
              if (res.code === '0') {
                r(res)
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
      }),
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { id } = this.props
        const { optionType, itemId } = this.state

        if (!err) {
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
      const { mainboardStore } = this.props.store
      this.setState({
        portId: data.id
      })
      this._getIOPortList()
      mainboardStore.getAxisParams({ axisId: data.id }).then(() => {
        console.log('data------------', data)
        const axisParams = mainboardStore.axisParams
        this.setState({
          data1: axisParams,
          paramMode:1,
        })
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
      data,
      mode,
      formData1,
      paramMode,
      data1,
      showAxis
    } = this.state
    const { mainboardStore } = this.props.store
    const portData = mainboardStore.portData

    return (
      <div className="axis">
        <div className="axis-content">
          <div>
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
          </div>

          <div className="axis-config">
            {showAxis ? (
              <AxisList
                data={toJS(portData.list)}
                onDelete={this.handlers.removePort}
                onItemClick={this.handlers.portItemClick}
              />
            ) : (
              ''
            )}

            {this.state.portId && portData.list.length ? (
              <div className="axis-right">
                  <SliderCustomForm
                    title="轴口参数管理"
                    visible={!!paramMode}
                    destroyOnClose
                    onCancel={() => {
                      this.setState({ paramMode: 0 })
                    }}
                    onSubmit={this.handlers.onSubmit1}
                    formData={formData1}
                    defaultData={data1}
                  />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <ModalCustomForm
          title="轴口管理"
          visible={!!mode}
          destroyOnClose
          labelWidth={200}
          onCancel={() => {
            this.setState({ mode: 0 })
          }}
          onSubmit={this.handlers.onSubmit}
          formData={formData}
          defaultData={data}
        />
      </div>
    )
  }
}
export default Index
