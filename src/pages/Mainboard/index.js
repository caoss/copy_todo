/**
 * @author 
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Tabs, message,Icon } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm/index'
import YTabs from '../../components/Common/YTabs'
import IOConfig from './components/IOConfig/index'
import AxisConfig from './components/AxisConfig/index'
import ParamsConfig from './components/ParamsConfig/index'

const TabPane = Tabs.TabPane
@inject('store')
@observer
class Index extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      mode: 0,
      hasConfigModal: false,
      data: {},
      softwareId: null,
      cardId: null,
      panes: [
        { title: 'I/O口配置', key: '1' },
        { title: '轴口配置', key: '2' }
      ],
      ioPanes: [{ title: 'I口', key: '1' }, { title: 'O口', key: '2' }],
      formData: [
        {
          type: 'select',
          label: '硬件类型',
          valueKey: 'hardwareId',
          required: true,
          items: [],
          value: ''
        },
        {
          type: 'text',
          label: 'ip地址',
          valueKey: 'ip',
          required: true,
          value: ''
        },
        {
          type: 'textarea',
          label: '描述',
          valueKey: 'remark',
          value: '',
          required: true
        }
      ]
    }
  }

  componentDidMount() {
    const { hardwareStore, mainboardStore } = this.props.store
    // const { id } = this.props.location.state
    const id = global.softwareId;
    this.state.softwareId = global.softwareId;
    hardwareStore.getHardwareList().then(() => {
      const list = hardwareStore.hardwareData.list
      const data = []
      for (const r of list) {
        data.push({
          label: r.hardwareName,
          value: r.id
        })
      }

      for (const r of this.state.formData) {
        if (r.valueKey == 'hardwareId') {
          r.items = data
        }
      }
    })
    this._getMainboardList()
  }

  _getMainboardList() {
    const { mainboardStore } = this.props.store
    const { softwareId } = this.state
    mainboardStore.getMainboardList({ softwareId })
  }

  handlers = {
    onSubmit: (err, values) =>
      new Promise((r, j) => {
        const { mainboardStore } = this.props.store
        const { mode, data, softwareId } = this.state
        if (!err) {
          if (mode === 1) {
            mainboardStore
              .createMainboard({ ...values, softwareId })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  this._getMainboardList()
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
          } else if(mode === 2) {

            console.log( values );
            mainboardStore
              .editMainboard({ ...values, softwareId,id:this.state.cardId })
              .then(res => {
                if (res.code === '0') {
                  r(res)
                  this._getMainboardList()
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
            hardwareStore
              .editHardware({ id: data.id, ...values })
              .then(res => {
                if (res.code === '0') {
                  r(res)
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

    removeMainboard: idList => {
      const { mainboardStore } = this.props.store
      mainboardStore.removeMainboard({ idList }).then(res => {
        if (res.code === '0') {
          this._getMainboardList()
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
    },

    onTabsChange: activeIndex => {
      console.log('activeIndex-----------------------', activeIndex)
      // eventBus
      if (activeIndex == '1') {
        eventBus.emit('IOList')
      } else if (activeIndex == '2') {
        eventBus.emit('AxisList')
      }
    },

    onLeftTabsChange: (activeIndex, data) => {
      // console.log('activeIndex,data------------------', activeIndex, data.id)
      this.state.cardId = data.id
      this.setState({
        cardId: data.id
      })
    }
  }

  render() {
    const { formData, data, mode, hasConfigModal } = this.state
    const { mainboardStore } = this.props.store
    const mainboardData = mainboardStore.mainboardData

    return (
      <div className="mainboard">

        <div className="mainboard-bg">

          <nav className="nav">
            <h3 style={{ paddingLeft: '24px' }}>主卡配置</h3>
          </nav>
          
          <div className="mainBoard_bot">  
            {mainboardData.total ? (
                <div className="board-manage">
                <div className="board-left">
                    <div className="btn-con">
                    {/* <div
                        className="btn"
                        onClick={() => {
                        this.setState({ mode: 1 })
                        }}
                    >
                        <span className="btn-content">
                        <img
                            src={require('../../assets/images/icon_add_min.png')}
                        />
                        <p>添加</p>
                        </span>
                    </div> */}

                    {/* <div
                        className="btn"
                        onClick={() => {
                        this.setState({
                            hasConfigModal: true
                        })
                        }}
                    >
                        <span className="btn-content">
                        <img src={require('../../assets/images/icon_jion.png')} />
                        <p>参数配置</p>
                        </span>
                    </div> */}
                    </div>
                        <YTabs
                        data={mainboardData.list}
                        onChange={this.handlers.onLeftTabsChange}
                        renderItem={(d, i) => (
                            <div className="board-item">
                            <div className="item-left">
                                <h4>{d.remark}</h4>
                                <span className="tag">运动控制卡</span>
                            </div>

                            <div
                                style={{cursor:'pointer'}}
                                className="item-right"
                                onClick={() => {
                                    this.setState({
                                        mode: 2,
                                        data: d,
                                        cardId:d.id
                                    })
                                }}
                            >
                                <Icon type="edit" style={{color:'#fff'}} />
                                <span className="eidt-txt">编辑</span>
                            </div> 
                            {/* <div
                                className="item-right"
                                onClick={() => {
                                this.handlers.removeMainboard([d.id])
                                }}
                            >
                                <img
                                className="del-icon"
                                src={require('../../assets/images/icon_delate.png')}
                                />
                                <span className="del-txt">删除</span>
                            </div>  */}

                            </div>
                        )}
                        />
                </div>

                <div className="board-right">
                    {this.state.cardId ? (
                    <Tabs
                        size="large"
                        onChange={this.handlers.onTabsChange}
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        backgroundColor: '#061134'
                        }}
                    >
                        {this.state.panes.map(pane => {
                        let component = null
                        if (pane.key == '1') {
                            component = (
                            <IOConfig
                                id={this.state.cardId}
                                softwareId={this.state.softwareId}
                            />
                            )
                        } else {
                            component = (
                            <AxisConfig
                                id={this.state.cardId}
                                softwareId={this.state.softwareId}
                            />
                            )
                        }

                        return (
                            <TabPane
                            tab={pane.title}
                            key={pane.key}
                            closable={pane.closable}
                            style={{ height: '100%' }}
                            >
                            {component}
                            </TabPane>
                        )
                        })}
                    </Tabs>
                    ) : (
                    ''
                    )}
                </div>
                </div>
            ) : (
                <div className="create-con">
                <div
                    className="add-con"
                    onClick={() => {
                    this.setState({ mode: 1 })
                    }}
                >
                    <img src={require('../../assets/images/icon_add.png')} />
                    <span>添加一块主板</span>
                </div>
                </div>
            )}
          </div>  
        </div>

        <ModalCustomForm
            title="版本"
            visible={!!mode}
            destroyOnClose
            onCancel={() => {
                this.setState({ mode: 0 })
            }}
            onSubmit={this.handlers.onSubmit}
            formData={formData}
            defaultData={data}
        />

        {/* <div className="config-btn-pos">
          <span
            onClick={() => {
              this.setState({
                hasConfigModal: !this.state.hasConfigModal
              })
            }}
          >
            <img
              src={
                hasConfigModal
                  ? require('../../assets/images/btn_down.png')
                  : require('../../assets/images/btn_up.png')
              }
            />
          </span>
        </div>

        <div
          className="config-modal"
          style={{ bottom: hasConfigModal ? '0' : '-100%' }}
        >
          {hasConfigModal ? <ParamsConfig softwareId={softwareId} /> : ''}
        </div> */}
      </div>
    )
  }
}
export default Index
