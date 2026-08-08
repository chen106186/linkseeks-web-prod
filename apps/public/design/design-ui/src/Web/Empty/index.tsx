import React from 'react'
import cx from 'classnames'
import styles from './index.less'

interface IProps {
  componentHeight?: number
  className?: string
}

const Empty: React.FC<IProps> = (props) => {
  const { componentHeight = 200, className, ...others } = props

  const classNameString = cx(styles['empty-banner'], className)

  return (
    <div
      className={classNameString}
      style={{
        height: componentHeight,
      }}
      {...others}
    />
  )
}

export default Empty
