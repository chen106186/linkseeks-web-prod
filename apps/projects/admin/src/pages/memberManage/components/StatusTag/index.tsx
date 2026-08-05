/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-31 17:52:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-09-08 16:32:03
 * @Description: 状态 tag
 */
import React from 'react'
import classNames from 'classnames'
import styles from './index.less'

interface StatusTagProps {
  type: 'success' | 'warnning' | 'default' | 'danger' | 'primary'
  title?: string
}

const StatusTag: React.FC<StatusTagProps> = ({ type, title }) => {
  const cls = classNames(styles.tag, styles[`tag__${type}`])
  return <span className={cls}>{title}</span>
}

export default StatusTag
