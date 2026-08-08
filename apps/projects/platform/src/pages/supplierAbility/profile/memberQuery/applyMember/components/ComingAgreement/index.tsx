/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 10:11:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-27 10:11:58
 * @Description: 入库协议
 */
import React from 'react'
import styles from './index.less'

interface IProps {
  /**
   * 协议
   */
  richText: string
}

const ComingAgreement: React.FC<IProps> = (props: IProps) => {
  const { richText } = props
  return <div className={styles.agreement} dangerouslySetInnerHTML={{ __html: richText }} />
}

export default ComingAgreement
