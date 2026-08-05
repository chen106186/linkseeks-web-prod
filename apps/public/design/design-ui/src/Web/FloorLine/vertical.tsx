import React from 'react'
import styles from './index.less'

const Vertical: React.FC = (props) => {
  return <div className={styles.floor_line_vertical}>{props.children}</div>
}

export default Vertical
