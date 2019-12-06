/**
 * @author
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Popconfirm, message, Checkbox, Row, Col,Icon,Tabs } from 'antd'
import AxisList from './components/AxisList/index'
import SliderCustomForm from '../../components/SliderCustomForm2/index'

const { TabPane } = Tabs;

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
        paramMode:0,
        title:'',
        id:1,
        softwareId:1,
        formData1: [
            [
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
                    type: 'number',
                    label: '脉冲当量',
                    valueKey: 'units',
                    value: 0,
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
                    type: 'number',
                    label: '扩展轴映射地址',
                    valueKey: 'extAddress ',
                    ...labelParam
                },                
                {
                    type: 'select',
                    label: '原点信号',
                    valueKey: 'datumIn',
                    value: '',
                    port: 1,
                    items: [],
                    ...labelParam
                  },
                  {
                    type: 'select',
                    label: '正向限位信号',
                    valueKey: 'fwdIn',
                    value: '',
                    port: 1,
                    items: [],
                    ...labelParam
                  },
                  {
                    type: 'select',
                    label: '负向限位信号',
                    valueKey: 'revIn',
                    value: '',
                    port: 1,
                    items: [],
                    ...labelParam
                  },
                  {
                    type: 'select',
                    port: 1,
                    label: '报警信号',
                    valueKey: 'almIn',
                    value: '',
                    items: [],
                    ...labelParam
                  },
                  {
                    type: 'select',
                    label: '使能信号',
                    valueKey: 'servoOut',
                    value: '',
                    port: 2,
                    items: [],
                    ...labelParam
                  },
                  {
                    type: 'select',
                    label: '清除报警信号',
                    valueKey: 'clearAlmOut ',
                    value: '',
                    port: 2,
                    items: [],
                    ...labelParam
                  },
            ],
            [
                {
                  type: 'number',
                  label: '安全位',
                  valueKey: 'safePosition',
                  value: '',
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
                    type: 'number',
                    label: '工作速度',
                    valueKey: 'workSpeed',
                    value: 1,
                    ...labelParam
                  },
                  {
                    type: 'number',
                    label: 'S曲线时间',
                    valueKey: 'sramp',
                    value: 0,
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
                    type: 'number',
                    label: '负向软限位',
                    valueKey: 'rsLimit',
                    value: 0,
                    ...labelParam
                  },
            ],
            [
                {
                    type: 'select',
                    label: '位置模式/扭矩模式切换输出口',
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
                    label: '扭力值模拟量口',
                    valueKey: 'torqueAOut',
                    value: 0,
                    port: 2,
                    items: [],
                    ...labelParam
                },
           
            {
                type: 'select',
                label: '扭力达到信号',
                valueKey: 'torqueReachIn',
                value: 1,
                items: [],
                port: 1,
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
        ]
    }
  }

  componentDidMount() {
      this._getPortList();
  }

  componentWillMount(){
  }

  _getPortList(data = {}) {
    const { mainboardStore } = this.props.store
    mainboardStore
      .getPortList({
        softwareId:global.softwareId,
        interfaceType:5,
        ...data
      }).then(res=>{
        this.portItemFst();
      })
     
  }
  handlers = {
    onSubmit1: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { portId } = this.state
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
  }
  _getIOPortList(data) {
    const { mainboardStore } = this.props.store
    const { id, softwareId } = this.state;
    mainboardStore
      .getXPortList({
        softwareId,
        cardId: id,
        interfaceType: 1,
        ...data
      })
      .then(res => {
        console.log('res------------i', res)
        console.log('formData1-------');
        const list = res
        const items = []
        for (const r of list) {
          items.push({
            label: r.interfaceName,
            value: r.id
          })
        }
        for (const r of this.state.formData1[0]) {
          if (r.port && r.port == 1) {
            r.items = items
          }
        }
        for (const r of this.state.formData1[1]) {
          if (r.port && r.port == 1) {
            r.items = items
          }
        }
        for (const r of this.state.formData1[2]) {
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
        for (const r of this.state.formData1[0]) {
          if (r.port && r.port == 2) {
            r.items = items
          }
        }
        for (const r of this.state.formData1[1]) {
          if (r.port && r.port == 2) {
            r.items = items
          }
        }
        for (const r of this.state.formData1[2]) {
          if (r.port && r.port == 2) {
            r.items = items
          }
        }

        this.setState({
          formData1: [...this.state.formData1]
        })
      })
  }

  portItemFst(){
    const { mainboardStore } = this.props.store;
    const portData = mainboardStore.portData
    let id =  portData.list[0] && portData.list[0].id;
    let title =  portData.list[0] && portData.list[0].interfaceName;
    this.setState({
      portId: id,
      title:title,
      paramMode:0,
    })
    this._getIOPortList();
    mainboardStore.getAxisParams({ axisId: id }).then(() => {
      const axisParams = mainboardStore.axisParams
      console.log('axisParams---',axisParams);
      this.setState({
        data1: axisParams,
        paramMode:1,
      })
    })
  }
  portItemClick(data){
    const { mainboardStore } = this.props.store;
    this.setState({
      portId: data.id,
      paramMode:0,
      title:data.interfaceName,
    })
    this._getIOPortList();
    mainboardStore.getAxisParams({ axisId: data.id }).then(() => {
      const axisParams = mainboardStore.axisParams
      console.log('axisParams---',axisParams);
      this.setState({
        data1: axisParams,
        paramMode:1,
      })
    })
  }

  render() {
    const { mainboardStore } = this.props.store
    const portData = mainboardStore.portData
    const {paramMode,formData1,data1 } = this.state;
    return (
      <Card bordered={false} className="point-config">
        <Row type="flex">
            <Col span={5}  className="axiss-con">
                <div className="axiss_left">
                    <AxisList
                        data={toJS(portData.list)}
                        onItemClick={this.portItemClick.bind(this)}
                        defaultActive={0}
                    />
                </div>
            </Col> 

            <Col span={19} >

            {this.state.portId && paramMode ? (
              <div className="axis-right">
                  <SliderCustomForm
                    title="轴口参数管理"
                    title2={ this.state.title }
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
            </Col>
        </Row>
      </Card>
    )
  }
}
export default Index
