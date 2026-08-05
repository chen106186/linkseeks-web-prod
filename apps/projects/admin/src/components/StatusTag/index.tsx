/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-31 17:52:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-08-31 18:59:18
 * @Description: 状态 tag
 */
import React, { ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.less'

interface StatusTagProps {
  type: 'success' | 'warnning' | 'default' | 'danger' | 'primary'
  title: string | ReactNode
}

const StatusTag: React.FC<StatusTagProps> = ({ type, title }) => {
  const cls = classNames(styles.tag, styles[`tag__${type}`])
  return <span className={cls}>{title}</span>
}

export default StatusTag
