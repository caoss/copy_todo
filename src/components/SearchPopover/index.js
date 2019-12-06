/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Popover, Button } from 'antd'

class Index extends Component {
  static propTypes = {}

  state = {}

  componentDidMount() {
    console.log(this.props)
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  createDefaultContent() {
    return <div>content</div>
  }

  render() {
    const { title, content, children } = this.props

    return (
      <div>
        <Popover
          placement="bottomLeft"
          content={content || this.createDefaultContent()}
        >
          {children || <Button type="primary">查询</Button>}
        </Popover>
      </div>
    )
  }
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index
