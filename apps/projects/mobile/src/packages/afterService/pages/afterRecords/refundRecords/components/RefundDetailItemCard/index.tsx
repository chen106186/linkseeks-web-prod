/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 15:24:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 15:24:45
 * @Description: 退款明细信息项Card
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import MellowCard from '@/components/MellowCard'
import Descriptions from '@/components/Descriptions'
import Label from '@/components/Label'
import { DetailItem } from '../RefundList'
import styles from './index.module.scss'

interface LogisticsCardProps {
  /**
   * 数据
   */
  data: DetailItem
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 是否是选中的
   */
  isActive?: boolean
}

const LogisticsCard: React.FC<LogisticsCardProps> = (props: LogisticsCardProps) => {
  const { data = {}, customStyle, isActive } = props

  const intl = useIntl()

  return (
    <View className={classNames(styles['refund'], isActive ? styles['refund-active'] : '')} style={customStyle}>
      <MellowCard
        title={<View className={styles['refund-status']}>{data.outerStatusName}</View>}
        extra={
          <Label
            type="default"
            name={intl.formatMessage({
              id: 'refundRecords.components.refundDetailItemCard.payCount',
              index: data.payCount,
            })}
          />
        }
        headStyle={{
          borderBottomWidth: pxTransform(0),
        }}
        bodyStyle={{
          paddingTop: pxTransform(0),
        }}
      >
        <View className={styles['refund-payNode']}>{`${data.payNode}`}</View>
        <Descriptions column={1}>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'refundRecords.components.refundDetailItemCard.refund',
              defaultMessage: '退款',
            })}
            customLabelStyle={{ fontSize: pxTransform(12) }}
            customStyle={{
              marginBottom: pxTransform(0),
            }}
          >
            <View className={styles['refund-amount']}>
              {`${intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}${data.refundAmount}`}
            </View>
          </Descriptions.Item>
        </Descriptions>
      </MellowCard>
    </View>
  )
}

LogisticsCard.defaultProps = {
  customStyle: {},
  isActive: false,
}

export default LogisticsCard
