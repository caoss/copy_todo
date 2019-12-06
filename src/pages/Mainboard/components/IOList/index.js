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
    this.state = {}
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
    const { data, cloumn = 3 } = this.props
    const newData = []
    let rowList = []
    for (let i = 0; i < data.length; i++) {
      if (i !== 0 && i % cloumn == 0) {
        newData.push(rowList)
        rowList = []
      }

      rowList.push(data[i])
    }
    newData.push(rowList)

    return (
      <div>
        {newData.map(rowData => (
          <div className="row">
            {rowData.map((col, c) => (
              <div
                className="board-item-con"
                style={{
                  width: `${100 / cloumn}%`
                }}
              >
                <div
                  className="board-item"
                  onClick={() => {
                    const { onItemClick } = this.props
                    onItemClick && onItemClick(col)
                  }}
                >
                  <div className="item-left">
                    <h4>{col.interfaceName}</h4>
                    <span className="tag">I口</span>
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
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  render() {
    return <div className="io-list">{this.renderContent()}</div>
  }
}
export default Index
