import React, { useState } from 'react'
import cx from 'classnames'
import { Tooltip } from 'antd'

interface Iprops {
  children: React.ReactNode
  visible: boolean
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

const WebCustomCommodity: React.FC<Iprops> = (props: Iprops) => {
  const { children, className, visible, ...other } = props
  const classNameStr = cx(className)

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
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

  if (!visible) return null

  return (
    <Tooltip placement="topLeft" title={'自定义区域'} arrowPointAtCenter>
      <div className={classNameStr} style={{ width: '1200px', margin: '0 auto', minHeight: '50px' }} {...divProps}>
        {renderComponent()}
      </div>
    </Tooltip>
  )
}

export default WebCustomCommodity
