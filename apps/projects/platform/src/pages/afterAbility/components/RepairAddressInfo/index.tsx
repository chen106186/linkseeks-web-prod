/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 13:53:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-12 17:09:35
 * @Description: 维修地址
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Descriptions } from 'antd'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import styles from './index.less'

export interface RepairAddressInfoProps extends MellowCardProps {
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

const RepairAddressInfo: React.FC<RepairAddressInfoProps> = ({ info = {}, ...rest }) => {
  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.RepairAddressInfo.title', defaultMessage: '维修地址' })}
      {...rest}
    >
      <Descriptions column={1} className={styles.desc}>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'afterService.components.RepairAddressInfo.title',
            defaultMessage: '维修地址',
          })}
          labelStyle={{ width: 106 }}
        >
          <p>
            {info.receiverName || ''} {info.phone || ''}
          </p>
          <p>{info.fullAddress || ''}</p>
        </Descriptions.Item>
      </Descriptions>
    </MellowCard>
  )
}

export default RepairAddressInfo
