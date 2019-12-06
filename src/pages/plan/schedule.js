/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Card, Button, Popconfirm, message,Table } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm'
import CustomTable from '../../components/CustomTable'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this;
  }

  componentDidMount() {
    // this._getVersionList()
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { hardwareStore } = this.props.store
        const { mode, data } = this.state
        if (!err) {
          if (mode === 1) {
            hardwareStore
              .createHardware(values)
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
            hardwareStore
              .editHardware({ id: data.id, ...values })
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
    removeHardware: idList => {
      const { hardwareStore } = this.props.store
      hardwareStore.removeHardware({ idList }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          eventBus.emit('onTableChange')
        } else {
          message.error(res.message)
        }
      })
    },
    onTableChange: (page, params) => {
      const { hardwareStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      this.setState({ pagination })
      return new Promise((r, j) => {
        hardwareStore
          .getHardwareList({
            ...rest,
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
    }
  }

  render() {
    return (
      <Card bordered={false}>
        <div>
        <table border="1" width="100%">
          <tr className='t_header'>
            <td width="25%"> 里程碑 </td>
            <td width="25%"> Task　 </td>
            <td width="25%"> 说明　 </td>
            <td width="25%"> 计划　 </td>
          </tr>
          <tr>
            <td className='t_wight'>整体规划</td>
            <td>- </td>
            <td>线上设计平台 -> 一键打包 -> 线下调试 </td>
            <td></td>
          </tr>
          <tr>
            <td rowspan="5" className='t_wight'>
              工控引擎1.0
              (演示版)
            </td>
            <td>线上平台接口开发　 </td>
            <td>卡、口、轴、点位、工程师参数、动作 </td>
            <td></td>
          </tr>
          <tr>
            <td>工控引擎：动作条件封装 </td>
            <td>目前支持的动作:
              - 单步动作: 所有轴减速停止/轴找原点/轴点位移动/轴点位移动(扭矩模式)/Out信号设置/延时
              - 组合动作(并行)
              - 组合动作(串行)</td>
            <td></td>
          </tr>
          <tr>
            <td>工控引擎：动作条件封装</td>
            <td>动作条件说明:
              - 条件可作用于单步动作和组合动作
              - 条件判断，可设置循环等待时长
              - 条件类型: 前置条件/就绪条件, 前置条件不满足则跳过此动作, 就绪条件不满足则动作报错
              - 条件项：系统参数/口信息/轴信息/引擎运行时信息</td>
            <td></td>
          </tr>
          <tr>
            <td>总结 </td>
            <td>当前只支持1款板卡
              当前只支持单工位
              当前不支持CCD协同</td>
            <td></td>
          </tr>
          <tr>
            <td>软件调试 </td>
            <td>第一次调动作 20180321
              第一次跑流程 20180327
              第一次对外演示 20180402 </td>
            <td></td>
          </tr>

          <tr>
          <td rowspan="7" className='t_wight'>
              工控引擎1.1(单工位试用版)
            </td>
            <td>可视化配置 </td>
            <td>支持所有配置的增删改查：
              卡配置、IO配置、轴配置、按钮配置、运动参数、点位、动作流程 </td>
            <td>20190510 </td>
          </tr>
          <tr>
            <td>代码重构 </td>
            <td>
              点位设计改为多轴点位
              底层取消XML配置，改为嵌入式DB
              引擎实时加载配置变化 </td>
            <td> 20190510 </td>
          </tr>
          <tr>
            <td>功能完善 </td>
            <td>按钮监听、动作开关、动作调序、监控刷新 </td>
            <td>20180515 </td>
          </tr>
          <tr>
            <td>调机交互 </td>
            <td>
              I/O对点
              Jog运动(对方向、距离)
              点位示教
              轴手动、轴单步(速度、距离)
              IO调试(气缸...) </td>
            <td>20190531 </td>
          </tr>
          <tr>
            <td>报警处理机制 </td>
            <td> 报警处理 -> 报警清除 -> 运动恢复
              重点：局部复位，不影响全局 </td>
            <td> 	20190610 </td>
          </tr>
          <tr>
            <td>更多运动封装 </td>
            <td>单独相对运动（参数：轴、距离）
              多轴插补(参数：轴列表、位置列表、插补方式：直线/圆弧/螺旋)
              ...</td>
            <td> 20190621 </td>
          </tr>
          <tr>
            <td>更多动作条件封装 </td>
            <td>多轴坐标组合（加减）判断
              ... </td>
            <td> 20190621 </td>
          </tr>


          <tr>
            <td className='t_wight' rowspan="3">
              工控引擎1.2
              (多工位试用版)
            </td>
            <td>多工位 </td>
            <td>实现思路：共享信号量(全局级、工位级、轴级)
              难点：动作干涉 </td>
            <td> </td>
          </tr>

          <tr>
            <td>协同 </td>
            <td>送料，相机，点胶模块
              与多工位协同
              实现思路（定义服务优先级 A>B>C>D）</td>
            <td></td>
          </tr>
          <tr>
            <td>相机通信 </td>
            <td>约定交互协议，socket通信</td>
            <td>待定
              需要和视觉模块开发人员协同</td>
          </tr>

          <tr>
            <td rowspan="7" className='t_wight'>
              工控引擎2.0
              (内部投产版)
            </td>
            <td>优化 </td>
            <td>
              问题发现、修复、总结
            </td>
            <td> </td>
          </tr>
          <tr>
            <td>迭代 </td>
            <td>
              思路调整、功能优化、方案完善</td>
            <td> </td>
          </tr>
          <tr>
            <td>产能统计 </td>
            <td>
            统计报表</td>
            <td> </td>
          </tr>
          <tr>
            <td>报警统计 </td>
            <td>
            报警明细</td>
            <td> </td>
          </tr>
          <tr>
            <td>稼动率 </td>
            <td>
            停机、报警</td>
            <td> </td>
          </tr>
          <tr>
            <td>多料号 </td>
            <td>
            按料号规格关联动作、点位</td>
            <td> </td>
          </tr>
          <tr>
            <td>轨迹定义 </td>
            <td>
            DXF</td>
            <td> </td>
          </tr>

          <tr>
            <td rowspan="4" className='t_wight'> 工控引擎2.0
                (推广版)</td>
            <td> 硬件支持列表 </td>
            <td>支持更多厂商、更多型号：
                正运动 ZMC412
                正运动 ZMC308
                ...
                
                重点：插件式开发、开放SDK</td>
            <td></td>
          </tr>

          <tr>
            <td>多租户平台</td>
            <td>开放注册、license购买</td>
            <td></td>
          </tr>
          <tr>
            <td>应用市场</td>
            <td>应用集市、方案共享</td>
            <td></td>
          </tr>
          <tr>
            <td>代码保护</td>
            <td>代码混淆、防破解</td>
            <td></td>
          </tr>

        </table>
        </div>
      </Card>
    )
  }
}
export default Index
