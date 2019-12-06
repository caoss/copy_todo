/**
 * @author YM
 */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthUtil from '../../utils/AuthUtil'

const PrivateRoute = ({ component: Component, noAuth, ...rest }) => (
  // console.log('rest-------------', auth)
  <Route
    {...rest}
    render={props =>
      noAuth || AuthUtil.isLogin() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
)

export default PrivateRoute
