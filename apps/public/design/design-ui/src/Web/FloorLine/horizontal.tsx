import React from 'react'
import styles from './index.less'

const Horizontal: React.FC = (props) => {
  return <div className={styles.floor_line_horizontal}>{props.children}</div>
}

export default Horizontal
