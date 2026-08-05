import React from 'react'
import styles from './index.less'

interface MallLayoutPropsType {
  backgroundColor?: string
  style?: any
}

const MallLayout: React.FC<MallLayoutPropsType> = (props) => {
  const { children, backgroundColor, style = {} } = props

  const wrapStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#F5F6F7',
    ...style,
  }

  return (
    <div className={styles.mall_layout} style={wrapStyle}>
      {children}
    </div>
  )
}

export default MallLayout
