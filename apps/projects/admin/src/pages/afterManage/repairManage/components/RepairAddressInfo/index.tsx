/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 13:53:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-16 17:59:26
 * @Description: 维修地址
 */
import React from 'react'
import { Descriptions } from 'antd'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

export interface RepairAddressInfoProps {
  info: {
    id: string
    // 收件人
    receiverName: string
    // 电话
    phone: string
    // 详细地址
    fullAddress: string
  }
}

const RepairAddressInfo: React.FC<RepairAddressInfoProps> = ({ info = {} }) => {
  return (
    <MellowCard title="维修地址" fullHeight>
      <Descriptions column={1} className={styles.desc}>
        <Descriptions.Item label="维修地址">
          <p>
            {info.receiverName || ''} / {info.phone || ''}
          </p>
          <p>{info.fullAddress || ''}</p>
        </Descriptions.Item>
      </Descriptions>
    </MellowCard>
  )
}

export default RepairAddressInfo
