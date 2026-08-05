import React from 'react'
import styles from './index.less'

const VerticalContainer: React.FC = (props) => {
  const { children } = props

  return <div className={styles['vertical-container']}>{children}</div>
}

export default VerticalContainer
