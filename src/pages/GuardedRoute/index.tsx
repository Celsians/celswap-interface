import React from 'react'
import { Route, Redirect, RouteComponentProps, RouteChildrenProps } from 'react-router-dom'
import * as H from 'history'

export interface Props {
  location?: H.Location
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
  render?: (props: RouteComponentProps<any>) => React.ReactNode
  children?: ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode
  path?: string | string[]
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
  auth?: boolean
}

const GuardedRoute: React.FC<Props> = ({ component: Component, auth, ...rest }) => {
  if (!Component) return null

  return (
    <>
      <Route {...rest} render={props => (auth === true ? <Component {...props} /> : <Redirect to="/swap" />)} />
    </>
  )
}

export default GuardedRoute
