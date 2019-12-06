/**
 * @author YM
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import store from './store/index'
import App from './App'
import './index.css'
import './utils/EventEmitter'
import history from './utils/History'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <LocaleProvider locale={zhCN}>
        <App />
      </LocaleProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)

// window.onbeforeunload=function(e){     
// 　　var e = window.event||e;  
// 　　e.returnValue=(" 确定已经保存了吗？");
// } 