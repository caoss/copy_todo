import React, { Component } from 'react'
import { Menu, Icon, Dropdown } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import routes from '../../routes/route'
import './index.scss'

const renderMenuItem = (
  item // item.route 菜单单独跳转的路由
) => (
  <Menu.Item key={item.key}>
    <Link to={item.route || item.key}>
      {item.icon && <Icon type={item.icon} />}
      <span className="nav-text">{item.title}</span>
    </Link>
  </Menu.Item>
)

const renderSubMenu = item => (
  <Menu.SubMenu
    key={item.key}
    title={
      <span>
        {item.icon && <Icon type={item.icon} />}
        <span className="nav-text">{item.title}</span>
      </span>
    }
  >
    {item.subs.map(item => renderMenuItem(item))}
  </Menu.SubMenu>
)

const SiderMenu = ({ menus, ...props }) => (
  <Menu {...props}>
    {menus &&
      menus.map(item =>
        item.subs ? renderSubMenu(item) : renderMenuItem(item)
      )}
  </Menu>
)

class SiderCustom extends Component {
  static setMenuOpen = props => {
    const { pathname } = props.location

    return {
      openKey: pathname.substr(0, pathname.lastIndexOf('/')),
      selectedKey: pathname
    }
  }

  static onCollapse = collapsed => {
    console.log(collapsed)
    return {
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    }
  }

  state = {
    openKey: '',
    selectedKey: ''
  }

  componentDidMount() {
    const state = SiderCustom.setMenuOpen(this.props)
    this.setState(Object.assign(this.state, state))
  }

  menuClick = e => {
    this.setState({
      selectedKey: e.key
    })
  }

  openMenu = v => {
    this.setState({
      openKey: v[v.length - 1]
    })
  }

  render() {
    return (
      <div className="slider-menu">
        <div className="logo">
          <a href="/app/home/index">
            <h1>共性软件平台</h1>
          </a>
        </div>
        <SiderMenu
          menus={routes.menus}
          onClick={this.menuClick}
          theme="dark"
          mode="inline"
          selectedKeys={[this.state.selectedKey]}
          openKeys={[this.state.openKey]}
          onOpenChange={this.openMenu}
        />
      </div>
    )
  }
}

export default withRouter(SiderCustom)
