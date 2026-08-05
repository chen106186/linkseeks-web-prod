import React from 'react'
import styles from './index.module.less'

export const Horizontal: React.FC<React.PropsWithChildren> = (props) => {
  return <div className={styles.floor_line_horizontal}>{props.children}</div>
}
