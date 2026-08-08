import React from 'react'
import styles from './index.module.less'

export const Vertical: React.FC<React.PropsWithChildren> = (props) => {
  return <div className={styles.floor_line_vertical}>{props.children}</div>
}
