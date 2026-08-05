import React, { useState } from 'react'
import { Tooltip } from 'antd'
import cx from 'classnames'

interface Iprops {
  className: any
  children: React.ReactNode
  /** 控制显示隐藏 */
  visible: boolean
}

const WrapCommodityList: React.FC<Iprops> = (props: Iprops) => {
  const { children, className, visible = true, ...other } = props

  const classNameStr = cx(className)

  const { onClick, onMouseOver, getOperateState } = other as any

  if (!visible) {
    return null
  }

  const divProps = {
    onClick,
    onMouseOver,
  }
  const renderComponent = () => {
    return (
      <div>
        {React.Children.map(children, (_child: any) => {
          if (_child) {
            return React.cloneElement(_child, { title: '', ...(_child?.props || {}) })
          }
          return null
        })}
      </div>
    )
  }

  return (
    <Tooltip placement="topLeft" title={'自定义模块'} arrowPointAtCenter>
      <div className={classNameStr} style={{ marginTop: '12px', minHeight: '50px' }} {...divProps}>
        {renderComponent()}
      </div>
    </Tooltip>
  )
}

export default WrapCommodityList
