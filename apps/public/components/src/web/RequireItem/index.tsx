import React from 'react'
import cx from 'classnames'
import './index.less'

interface RequireItemPropsType {
  style?: React.CSSProperties
  className?: string
  label: string | React.ReactNode
  brief?: string | React.ReactNode
  isRequire?: boolean
  width?: number
}

const RequireItem: React.FC<RequireItemPropsType> = (props) => {
  const { width = 180, label, className, style, isRequire = false, brief } = props

  return (
    <label
      style={{
        width: width,
        ...style,
      }}
      className={cx('require-item', className)}
    >
      <div className={cx('require-item-body', isRequire ? 'require' : '')}>
        <span>{label}</span>
        {brief && brief}
      </div>
    </label>
  )
}

export default RequireItem
