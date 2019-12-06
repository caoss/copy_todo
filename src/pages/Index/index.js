/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Layout, Icon } from 'antd'
// import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import Router from '../../routes/index'
// import SliderMenu from '../../components/SliderMenu'
import HeaderBar from '../../components/HeaderBar'
import EngineStatus from '../../components/EngineStatus'
import routesConfig from '../../routes/route'


const { Content, Footer, Header, Sider } = Layout

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      breadcrumb: [],
      collapsed: false,
      right_width:300,
    }
  }

  componentDidMount() {
    const { appStore } = this.props.store
    appStore.getSoftWareMsg().then(res=>{
        if(res && res.autoId){
            const {autoId,developer,id,resetId,versionName,versionNum} = res;
            global.softwareId = id;
            global.developer = developer;
            global.autoId = autoId;
            global.resetId = resetId;
            global.versionName = versionName;
            global.versionNum = versionNum;
            document.title = global.versionName ;
        }
    })
    this._setBreadcrumb(this.props.location.pathname)
  }

  componentWillReceiveProps(nextProps) {
    // 当点击面包屑导航时，侧边栏要同步响应
    const pathname = nextProps.location.pathname
    if (this.props.location.pathname !== pathname) {
      this._setBreadcrumb(pathname)
    }
  }

  _setBreadcrumb(pathname) {
    Object.keys(routesConfig).map(key => {
      routesConfig[key].map(item => {
        const data = [item.title]
        if (item.key === pathname) {
          this.setState({
            breadcrumb: data
          })
          return
        }

        item.subs &&
          item.subs.map(sItem => {
            if (sItem.key === pathname) {
              data.push(sItem.title)
              this.setState({
                breadcrumb: data
              })
            }
          })
      })
    })
  }
  _togRight(){
    this.setState({
        right_width:this.state.right_width==300?0:300
    })
  }

  render() {
    const { collapsed } = this.state
    return (
        
        // <Layout className="layout" >
        //     <Header style={{ padding: 0,zIndex:9 }} >
        //     11111111
        //     </Header>
            
        //     <Layout>
        //         <Content style={{ border:'1px solid red' }}>
        //             22222222222
        //         </Content>
        //         <Sider width={300} style={{ background:'#fff' }} >
        //             333333333
        //         </Sider>

        //     </Layout>

        // </Layout>


    <Layout className="layout" >
        <Header style={{ padding: 0,zIndex:9 }} >
         <HeaderBar
           onTrigger={() => {
             this.setState({
               collapsed: !collapsed
             })
           }}
           collapsed={collapsed}
         />
        </Header>
        
        <Layout>
            <Content>
                {/* <CustomBreadcrumb arr={this.state.breadcrumb} /> */}

                <Router />
                <div className={ this.state.right_width==300?"tog_rht":"tog_rht acttog" }  onClick={this._togRight.bind(this)}>
                    {
                       this.state.right_width==300?
                        <Icon type="right" />
                        :
                        <Icon type="left" />
                    }
                </div>
            </Content>
            <Sider width={this.state.right_width}>
                <EngineStatus/>
            </Sider>
        </Layout>

    </Layout>










    //   <Layout className="index">

    //     <Sider className="slider-menu" collapsed={collapsed}>
    //       <SliderMenu />
    //     </Sider>

    //     <Layout>
    //       <Header style={{ padding: 0 }}>
    //         <HeaderBar
    //           onTrigger={() => {
    //             this.setState({
    //               collapsed: !collapsed
    //             })
    //           }}
    //           collapsed={collapsed}
    //         />
    //       </Header>
    //       <Content>
    //         <CustomBreadcrumb arr={this.state.breadcrumb} />
    //         <Router />
    //       </Content>
    //       {/* <Footer>Footer</Footer> */}
    //     </Layout>

    //   </Layout>


    )
  }
}
export default Index


    