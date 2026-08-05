import React from 'react'
import style from './index.less'
import { Tooltip } from 'antd'

export interface OverflowTextProps {
  [key: string]: any
}

const OverflowText: React.FC<OverflowTextProps> = ({ children, ...props }) => {
  return (
    <Tooltip placement="topLeft" title={children} arrowPointAtCenter>
      <div className={style['overflow-text']} {...props}>
        {children}
      </div>
    </Tooltip>
  )
}

OverflowText.defaultProps = {}

export default OverflowText
