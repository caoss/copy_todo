/**
 * @author YM
 */
import React, { Component } from 'react'

class YTabs extends Component {
  state = {
    activeIndex:
      this.props.defaultActive || this.props.defaultActive == 0
        ? this.props.defaultActive
        : -1
  }

  render() {
    const { data = [], renderItem, onChange } = this.props
    const { activeIndex } = this.state
    return (
      <div>
        {data.map((item, i) => (
          <div
            style={{
              backgroundColor: activeIndex == i ? '#425BA4' : '#0f2155',
              marginTop: '24px'
            }}
            onClick={() => {
              this.setState({
                activeIndex: i
              })
              onChange && onChange(i, item)
            }}
          >
            {renderItem ? renderItem(item, i) : ''}
          </div>
        ))}
      </div>
    )
  }
}

export default YTabs
