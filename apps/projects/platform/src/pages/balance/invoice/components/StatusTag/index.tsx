/*
 * @Description: 状态 tag
 */
import React from 'react'
import classNames from 'classnames'
import styles from './index.less'

export const STATUS_TYPE = ['success', 'warning', 'default', 'danger', 'primary', 'nobility']

export type StatusTagProps = {
  /**
   * 状态对应颜色
   */
  colorMap: {
    [key: number]: string
  }
  /** 状态 */
  status: number
  title: React.ReactNode
  style?: React.CSSProperties
}

const StatusTag: React.FC<StatusTagProps> = ({ colorMap, status, title, style }) => (
  <div className={styles.status_tag} style={style}>
    <div className={classNames(styles.circle)} style={{ backgroundColor: colorMap[status] }}></div>
    <span>{title}</span>
  </div>
)

export default StatusTag
