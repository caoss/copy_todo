/**
 * @author YM
 */
import React, { Component } from 'react'
import './App.css'
import './utils/EventEmitter'
import { withRouter } from 'react-router-dom'
import { FirstRouter } from './routes/index'
// import './libs/main'
@withRouter
class App extends Component {
  componentDidMount() {
    // console.log('router---------------componentDidMount')
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps-----------', nextProps)
  }

  componentWillUpdate(nextProps) {}

  render() {
    return <FirstRouter />
  }
}

export default App
