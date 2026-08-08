import React, { CSSProperties, useMemo } from 'react'
import cx from 'classnames'
import { Tooltip } from 'antd'

interface Iprops {
  imageUrl: string
  width: number | string
  height: number | string
  style: CSSProperties
  className: any
  visible: boolean
}

const Advertisement: React.FC<Iprops> = (props: Iprops) => {
  const { imageUrl, width = '100%', height = 176, style = {}, visible = true, className, ...other } = props
  const cacheWidth = useMemo(() => (typeof width === 'number' ? `${width}px` : width), [width])
  const cacheHeight = useMemo(() => (typeof height === 'number' ? `${height}px` : height), [height])

  const classNames = cx(className)
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState } = other as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }

  if (!visible) {
    return null
  }

  return (
    <div className={classNames} {...divProps}>
      {(imageUrl && <img src={imageUrl} style={{ width: cacheWidth, height: cacheHeight, ...style }} />) || (
        <Tooltip placement="topLeft" title="活动图片" arrowPointAtCenter>
          <div style={{ width: cacheWidth, height: cacheHeight, ...style }}></div>
        </Tooltip>
      )}
    </div>
  )
}

export default Advertisement
