/**
 * @Description: 地址卡片组件
 */
import React from 'react'
import styles from './index.less'

export type AsAddressType = {
  /**
   * 地址id
   */
  id: number
  /**
   * 姓名
   */
  name: string
  /**
   * 联系电话
   */
  phone: string
  /**
   * 详细地址
   */
  detailed: string
}

interface AddressInfoProps {
  /**
   * 数据
   */
  data: AsAddressType
}

const AddressInfo: React.FC<AddressInfoProps> = (props: AddressInfoProps) => {
  const { data } = props
  return (
    <div className={styles.addressInfo}>
      <p className={styles['addressInfo-head']}>
        {data?.name || ''} / {data?.phone || ''}
      </p>
      <p className={styles['addressInfo-foot']}>{data?.detailed || ''}</p>
    </div>
  )
}

export default AddressInfo
