/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './index.scss'

class Index extends Component {
  componentDidMount() {
    console.log('this----', this)
  }

  render() {
    const {
      direction,
      wrap,
      justify,
      align,
      alignContent,
      className,
      children,
      prefixCls,
      style,
      ...restProps
    } = this.props

    const wrapCls = classnames(prefixCls, className, {
      [`${prefixCls}-dir-row`]: direction === 'row',
      [`${prefixCls}-dir-row-reverse`]: direction === 'row-reverse',
      [`${prefixCls}-dir-column`]: direction === 'column',
      [`${prefixCls}-dir-column-reverse`]: direction === 'column-reverse',

      [`${prefixCls}-nowrap`]: wrap === 'nowrap',
      [`${prefixCls}-wrap`]: wrap === 'wrap',
      [`${prefixCls}-wrap-reverse`]: wrap === 'wrap-reverse',

      [`${prefixCls}-justify-start`]: justify === 'start',
      [`${prefixCls}-justify-end`]: justify === 'end',
      [`${prefixCls}-justify-center`]: justify === 'center',
      [`${prefixCls}-justify-between`]: justify === 'between',
      [`${prefixCls}-justify-around`]: justify === 'around',

      [`${prefixCls}-align-start`]: align === 'start',
      [`${prefixCls}-align-center`]: align === 'center',
      [`${prefixCls}-align-end`]: align === 'end',
      [`${prefixCls}-align-baseline`]: align === 'baseline',
      [`${prefixCls}-align-stretch`]: align === 'stretch',

      [`${prefixCls}-align-content-start`]: alignContent === 'start',
      [`${prefixCls}-align-content-end`]: alignContent === 'end',
      [`${prefixCls}-align-content-center`]: alignContent === 'center',
      [`${prefixCls}-align-content-between`]: alignContent === 'between',
      [`${prefixCls}-align-content-around`]: alignContent === 'around',
      [`${prefixCls}-align-content-stretch`]: alignContent === 'stretch'
    })

    return (
      <div className={wrapCls} style={style} {...restProps}>
        {this.props.children ? this.props.children : ''}
      </div>
    )
  }
}

Index.propTypes = {
  prefixCls: PropTypes.string,
  align: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'between',
    'around',
    'stretch'
  ]),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
  direction: PropTypes.oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse'
  ]),
  alignContent: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'between',
    'around',
    'stretch'
  ]),
  style: PropTypes.object,
  children: PropTypes.node
}

Index.defaultProps = {
  prefixCls: 'y',
  align: 'center',
  justify: 'center',
  direction: 'row'
}

export default Index
