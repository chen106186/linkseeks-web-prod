/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 15:52:21
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-02-20 15:41:12
 * @Description: 邮票展示组件
 */
import React from 'react'
import classNames from 'classnames'
import styles from './index.less'

interface StampProps {
  /**
   * 是否需要展示中间的印记条
   */
  imprinted?: boolean
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
}

const Stamp: React.FC<StampProps> & { isVirtualFieldComponent: boolean } = ({
  imprinted = false,
  customStyle,
  children,
}) => {
  return (
    <div className={classNames(styles.stamp)} style={customStyle}>
      {children}

      {imprinted && <div className={styles.imprinted} />}
    </div>
  )
}

Stamp.isVirtualFieldComponent = true

export default Stamp
