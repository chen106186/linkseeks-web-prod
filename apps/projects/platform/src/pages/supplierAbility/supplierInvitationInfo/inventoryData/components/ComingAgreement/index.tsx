/*
 * @Description: 入库协议
 */
import React from 'react'
import styles from './index.less'
import NoData from '@/components/NoData'

interface IProps {
  /**
   * 协议
   */
  richText: string
}

const ComingAgreement: React.FC<IProps> = (props: IProps) => {
  const { richText } = props
  return richText ? <div className={styles.agreement} dangerouslySetInnerHTML={{ __html: richText }} /> : <NoData />
}

export default ComingAgreement
