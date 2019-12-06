/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Layout } from 'antd'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return <div />
  }
}
export default Index
