/**
 * @author YM
 */
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
      <div className="axis_cons">
        {data.map((col, i) => (
          <div
            style={{
              backgroundColor: activeIndex == i ? '#425BA4' : '#0f2155',
              marginTop: '24px'
            }}
            className="board-item"
            onClick={() => {
              const { onItemClick } = this.props
              this.setState({
                activeIndex: i
              })
              onItemClick && onItemClick(col)
            }}
          >
            <div className="item-left">
              <h4>{col.interfaceName}</h4>
              <span className="tag">轴口</span>
            </div>
            <div
              className="item-right"
              onClick={e => {
                const { onDelete } = this.props
                e.stopPropagation()
                onDelete && onDelete([col.id])
              }}
            >
              <img
                className="del-icon"
                src={require('../../../../assets/images/icon_delate.png')}
              />
              <span className="del-txt">删除</span>
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
