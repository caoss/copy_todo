/**
 * @author YM
 */
import React from 'react'
import { Menu, Icon, Avatar, Dropdown, Button, message } from 'antd'
import { inject, observer } from 'mobx-react'
import './index.scss'
import AuthUtil from '../../utils/AuthUtil'
import SystemUtil from '../../utils/SystemUtil'

import workflow from './images/workflow.png'
import debug from './images/debug.png'
import btns from './images/btn.jpg'
import settings from './images/settings.png'
import stop from './images/emergency.png'
import action_kz from './images/action_kz.jpg'

@inject('store')
@observer
class HeaderBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        buttons:[],
        currentMode:'工作模式切换'
    }
    this._stop = this._stop.bind(this)
  }

  componentDidMount() {
    this._getButtonList();
    this.getEngineStatus();
  }

  getEngineStatus(){
    const { mainboardStore } = this.props.store
    mainboardStore.getEngineStatus().then(res=>{
        console.log('res',res);
        if(res&&res.workMode==='手动'){
            this.setState({
                currentMode:'手动->自动'
            })
        }else if(res.workMode==='自动'){
            this.setState({
                currentMode:'自动->手动'
            })
        }
    })
  }

  _getButtonList(){
    const { mainboardStore } = this.props.store
    mainboardStore.getButtonList().then(res=>{
        this.setState({
            buttons:res
        })
    })
  }

  componentWillUnmount() {}

  handlers = {
    logout: () => {
      AuthUtil.removeUserInfo()
      SystemUtil.replace('/login')
    },
    user: () => {
      SystemUtil.push('/app/home/user')
    },
    setting: () => {
      SystemUtil.push('/app/home/setting')
    }
  }

    engineHandlers ={
        getEngineStart:()=>{
            const { mainboardStore } = this.props.store;
            mainboardStore.getEngineStart();
        },
        getEngineClose:()=>{
            const { mainboardStore } = this.props.store;
            mainboardStore.getEngineClose();
        },
        getEngineRefresh:()=>{
            const { mainboardStore } = this.props.store;
            mainboardStore.getEngineRefresh();
        }
    }
  
    handleMenuClick(e) {
        console.log('click', e);
    }
    workModeToggle(){
        const { mainboardStore } = this.props.store;
        mainboardStore.workModeToggle().then(res=>{
            console.log(res);
            if(res.code!=0){
                message.error(res.msg);
            }
            if(res&&res.data==='手动'){
                this.setState({
                    currentMode:'手动->自动'
                })
            }else if(res.data==='自动'){
                this.setState({
                    currentMode:'自动->手动'
                })
            }
        });
    }
    workFlowTrigger(buttonType){
        const { mainboardStore } = this.props.store;
        mainboardStore.workFlowTrigger({buttonType}).then(res=>{
            if(res.code!=0){
                message.error(res.msg);
            }
        });
    }
    _btnClick(id){
        const { mainboardStore } = this.props.store;
        mainboardStore.setButtonMock({
            buttonId:id
        }).then(res=>{
            console.log('res------------------',res);
            if(res && res.code=='0'){
                // message.success('操作成功')
            }else if(res.msg){
                // message.error(res.msg)
            }
        })
    }
    _stop(){
        const { mainboardStore } = this.props.store;
        mainboardStore._stop().then(res=>{
            console.log(res);
            if(res && res.code=='0'){
                // message.success('操作成功')
            }else if(res.msg){
                // message.error(res.msg)
            }
        })
    }

  render() {
    const { onTrigger, collapsed } = this.props
    let self = this;
    const menu_action = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1" onClick={()=>{   SystemUtil.push( { pathname:`/app/workflow/index`,state:{actId:autoId}  }) }}>自动流程</Menu.Item>
            <Menu.Item key="2" onClick={()=>{   SystemUtil.push( { pathname:`/app/workflow/index`,state:{actId:resetId} }) } }>复位流程</Menu.Item>
        </Menu>
    );
    const menu = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1" onClick={()=>{  SystemUtil.push(`/app/mainboard/index`) }}>卡配置</Menu.Item>
            <Menu.Item key="2" onClick={()=>{  SystemUtil.push(`/app/axisParms/index`) }}>轴配置</Menu.Item>
            <Menu.Item key="5" onClick={()=>{  SystemUtil.push(`/app/cube/index`) }}>工位管理</Menu.Item>
            <Menu.Item key="6" onClick={()=>{  SystemUtil.push(`/app/product/index`) }}>料号管理</Menu.Item>
            <Menu.Item key="6" onClick={()=>{  SystemUtil.push(`/app/part/index`) }}>部件管理</Menu.Item>
            <Menu.Item key="7" onClick={()=>{  SystemUtil.push(`/app/modulegroup/index`) }}>模组管理</Menu.Item>
            
            <Menu.Item key="3" onClick={()=>{  SystemUtil.push(`/app/point/index`) }}>点位配置</Menu.Item>
            <Menu.Item key="3" onClick={()=>{  SystemUtil.push(`/app/trace/index`) }}>轨迹表</Menu.Item>
            <Menu.Item key="4" onClick={()=>{  SystemUtil.push(`/app/button/index`) }}>按钮配置</Menu.Item>
            <Menu.Item key="2" onClick={()=>{  SystemUtil.push(`/app/params/index`) }}>参数配置</Menu.Item>
        </Menu>
    );
    const menu_yq = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1" onClick={ this.engineHandlers.getEngineStart.bind(this) }>启动</Menu.Item>
            <Menu.Item key="2" onClick={ this.engineHandlers.getEngineClose.bind(this) }>关闭</Menu.Item>
            <Menu.Item key="3" onClick={ this.engineHandlers.getEngineRefresh.bind(this) }>刷新</Menu.Item>
            {/* <Menu.Item key="5" onClick={ this.workFlowTrigger.bind(this,1)}>开始</Menu.Item>
            <Menu.Item key="6" onClick={ this.workFlowTrigger.bind(this,4)}>复位</Menu.Item>
            <Menu.Item key="7" onClick={ this.workFlowTrigger.bind(this,3)}>急停</Menu.Item> */}

        </Menu>
    );
    const menu_tj = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1" onClick={()=>{  SystemUtil.push(`/app/ioinfo2/index`) }}>IO对点</Menu.Item>
            {/* <Menu.Item key="1" onClick={()=>{  SystemUtil.push(`/app/axishander/index`) }}>轴手动</Menu.Item>
            <Menu.Item key="2" onClick={()=>{  SystemUtil.push(`/app/axisOne/index`) }}>轴单步</Menu.Item> */}
            <Menu.Item key="2" onClick={()=>{  SystemUtil.push(`/app/ccdPage/index`) }}>CCD调试</Menu.Item>
            <Menu.Item key="3" onClick={()=>{  SystemUtil.push(`/app/MGDebug/index`) }}>模组调试</Menu.Item>
            <Menu.Item key="4" onClick={()=>{  SystemUtil.push(`/app/ioinfo/index`) }}>IO监控</Menu.Item>
            <Menu.Item key="5" onClick={()=>{  SystemUtil.push(`/app/axisinfo/index`) }}>轴监控</Menu.Item>
            <Menu.Item key="6" onClick={()=>{  SystemUtil.push(`/app/craft/index`) }}>工艺参数</Menu.Item>
            <Menu.Item key="7" onClick={()=>{  SystemUtil.push(`/app/trace2/index`) }}>轨迹表</Menu.Item>
        </Menu>
    );

    const Buttons = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            {
                this.state.buttons && this.state.buttons.length>0?
                this.state.buttons.map(function(item,i){
                    return(
                        <Menu.Item key='i' onClick={ self._btnClick.bind(self,item.id)}>{item.remark}</Menu.Item>
                    )
                })
                :
                null
            }
        </Menu>
    );
    const logs = (
        <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key="1" onClick={()=>{  SystemUtil.push(`/app/worklogs/index`) }}>动作日志 </Menu.Item>
        </Menu>
    );

    return (
      <div className="header-con" style={{background:'#001529'}}>
        <Button type="primary" className='btn_l' onClick={()=>{  SystemUtil.push(`/`) }} >
            首页
        </Button>

        <Dropdown  className='btn_l' overlay={menu}>
            <Button>
                <img src={ settings }/>拓扑<Icon type="down" />
            </Button>
        </Dropdown>

        <Button className='btn_l'  onClick={()=>{   SystemUtil.push( { pathname:`/app/workflow/index` }) }}>
            <img src={ workflow } />工作流
        </Button>

        <Dropdown  className='btn_l' overlay={menu_tj}>
            <Button>
                <img src={ debug }/>调机<Icon type="down" />
            </Button>
        </Dropdown>

        <Dropdown  className='btn_l' overlay={Buttons}>
            <Button>
                <img src={ btns }/>按钮<Icon type="down" />
            </Button>
        </Dropdown>

        <Dropdown  className='btn_l' overlay={logs}>
            <Button>
                <img src={ btns }/>日志<Icon type="down" />
            </Button>
        </Dropdown>

        <Button type="" className='btn_l' onClick={ this._stop } >
            <img src={ stop }/>急停
        </Button>


        <div className="header-right">

            <Button type="" className='btn_l' onClick={ this.workModeToggle.bind(this)} >
            { this.state.currentMode }
            </Button>
            
            <Dropdown  className='btn_l' overlay={menu_yq}>
                <Button>
                <img style={{position:'relative',top:'-2px'}} src={ action_kz }/> 引擎<Icon type="down" />
                </Button>
            </Dropdown>
            <Button className='btn_l' type='danger'  onClick={()=>{    AuthUtil.removeUserInfo(); SystemUtil.replace('/login') }}>
               退出
            </Button>
        </div>
        
      </div>
    )
  }
}

export default HeaderBar
