/**
 * @author YM
 */
import React from 'react'
import { Menu, Icon, Avatar, Dropdown, Badge } from 'antd'
import './index.scss'
import AuthUtil from '../../utils/AuthUtil'
import SystemUtil from '../../utils/SystemUtil'

class HeaderBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

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

  render() {
    const { onTrigger, collapsed } = this.props
    const menu = (
      <Menu className="menu">
        <Menu.ItemGroup title="" className="menu-group">
          <Menu.Item onClick={this.handlers.user}>
            <Icon type="user" />
            <span>个人中心</span>
          </Menu.Item>
          <Menu.Item onClick={this.handlers.setting}>
            <Icon type="setting" />
            <span>用户设置</span>
          </Menu.Item>
          <Menu.Item onClick={this.handlers.logout}>
            <Icon type="logout" />
            <span>退出登录</span>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
    return (
      <div className="header-con">
        <span className="trigger" onClick={onTrigger}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <div className="header-right">
          {/* <Badge
            count={10}
            overflowCount={5}
            className="space"
            style={{ height: '100%' }}
          >
            <Icon type="bell" style={{ fontSize: '22px' }} />
          </Badge> */}

          <Dropdown overlay={menu}>
            <span
              style={{
                padding: '0 60px 0 24px',
                display: 'inline-block',
                height: '100%'
              }}
            >
              <Avatar src={require('./images/avatar.jpg')} />
              <span style={{ marginLeft: '8px' }}>user</span>
            </span>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default HeaderBar
