import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Tabs, message } from 'antd'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex:
        this.props.defaultActive || this.props.defaultActive == 0
          ? this.props.defaultActive
          : -1
    }
  }

  componentDidMount() {}

  
  componentWillReceiveProps(nextProps) {
    // if (
    //   nextProps.data &&
    //   JSON.stringify(this.props.data) != JSON.stringify(nextProps.data)
    // ) {
    //   return true
    // }
  }

  renderContent() {
    const { data } = this.props
    const { activeIndex } = this.state
    return (
      <div className="">
        {data.map((col, i) => (
          <div
            style={{margin:'20px',cursor:'pointer'}}
            key={i}
            onClick={() => {
              const { onItemClick } = this.props
              this.setState({
                activeIndex: i
              })
              onItemClick && onItemClick(col)
            }}
          >
            <div className="item-left">
              <h4
                style={{
                    color: activeIndex == i ? '#425BA4' : '#0f2155',
                  }}
              >{col.interfaceName}</h4>
            </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return <div className="axis-list">{this.renderContent()}</div>
  }
}
export default Index
