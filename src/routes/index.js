/**
 * @author YM
 */
import React, { Component } from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import routesConfig, { firstRoutesConfig } from './route'
import PrivateRoute from '../components/PrivateRoute'

const getTitle = function(routes, pathname) {
  if (routes.length) {
    for (let r of routes) {
      if (r.key === pathname) {
        return r.title ? r.title : ''
      }
    }
  } else {
    const routesKey = Object.keys(routes)
  }

  return ''
}
@withRouter
export default class CRouter extends Component {
  componentDidMount() {
    // console.log('this-----------props', this.props)
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location
    const title = getTitle(routesConfig, pathname)
  }
  render() {
    return (
      <Switch>
        {Object.keys(routesConfig).map(key => {
          const res = routesConfig[key].map(r => {
            const route = r => (
              <PrivateRoute
                exact
                noAuth={!!r.noAuth}
                path={r.route || r.key}
                component={r.component}
              />
            )
            return r.component ? route(r) : r.subs.map(r => route(r))
          })

          // console.log('res-----------------------------', res)
          return res
        })}
        {/* <Route exact render={() => <Redirect to="/404" />} /> */}
      </Switch>
    )
  }
}

@withRouter
class FirstRouter extends Component {
  componentDidMount() {
    const { pathname } = this.props.location
    const title = getTitle(firstRoutesConfig, pathname)

    if (title) {
      document.title = title
    }
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location
    const title = getTitle(firstRoutesConfig, pathname)
    if (title) {
      document.title = title
    }
  }

  render() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={() => <Redirect to="/app/home/index" push />}
        />
        {firstRoutesConfig.map(r => {
          const route = r => (
            <PrivateRoute
              key={r.key}
              noAuth={!!r.noAuth}
              path={r.route || r.key}
              component={r.component}
            />
          )
          return r.component ? route(r) : ''
        })}
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    )
  }
}

export { FirstRouter }
