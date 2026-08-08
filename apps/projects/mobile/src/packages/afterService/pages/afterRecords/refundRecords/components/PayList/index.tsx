/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-17 16:38:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 17:02:40
 * @Description: 支付信息
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Descriptions from '@/components/Descriptions'
import Empty from '@/components/Empty'
import styles from './index.module.scss'

export interface PayListItem {
  /**
   * 支付id
   */
  payId?: number | undefined
  /**
   * 支付外部状态：1.待支付2.待确认支付结果3.确认到账4.确认未到账
   */
  externalState?: number | undefined
  /**
   * 支付次数
   */
  payCount?: number | undefined
  /**
   * 支付环节
   */
  payNode?: string | undefined
  /**
   * 支付比例
   */
  payRatio?: number | undefined
  /**
   * 支付金额
   */
  payAmount?: number | undefined
  /**
   * 支付方式：1.线上支付2.线下支付3.授信额度支付4.货到付款支付
   */
  payWay?: number | undefined
  /**
   * 支付方式名称
   */
  payWayName?: string | undefined
  /**
   * 支付渠道：0.积分支付1.支付宝2.微信3.银联4.余额支付5.线下支付线上确认6.授信额度支付7.货到付款
   */
  channel?: number | undefined
  /**
   * 支付渠道名称
   */
  channelName?: string | undefined
  /**
   * 支付时间
   */
  payTime?: string
  /**
   * 退款金额
   */
  refundAmount?: number | undefined
  /**
   * 交易支付id
   */
  transactionPayId?: string | undefined
  /**
   * 支付配置：1.平台代收2.会员直接到账
   */
  payRuleId?: number | undefined
}

interface IProps {
  /**
   * 数据
   */
  data: PayListItem[]
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
}

const PayList: React.FC<IProps> = (props: IProps) => {
  const { data = [], customStyle } = props

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'refundRecords.components.payList.title', defaultMessage: '支付信息' })}
      style={customStyle}
    >
      {data.length > 0 ? (
        <View className={styles['payList-steps']}>
          <View className={styles['payList-steps-line']} />
          <View className={styles['payList-steps-container']}>
            {data.map((item, index) => (
              <View className={styles['payList-steps-item']} key={item.payId}>
                <View className={styles['payList-steps-item-left']}>
                  <Text className={styles['payList-steps-item-title']}>
                    {intl.formatMessage({
                      id: 'refundRecords.components.payList.step',
                      defaultMessage: '订单支付后支付',
                    })}
                    {`(${item.payRatio}%)`}
                  </Text>
                  <Descriptions column={1}>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'refundRecords.components.payList.payAmount',
                        defaultMessage: '支付金额',
                      })}
                    >
                      {`${intl.formatMessage({ id: 'currency' })}${item.payAmount}`}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'refundRecords.components.payList.payWayName',
                        defaultMessage: '支付方式',
                      })}
                    >
                      {item.payWayName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={intl.formatMessage({
                        id: 'refundRecords.components.payList.payTime',
                        defaultMessage: '支付时间',
                      })}
                      customStyle={{ marginBottom: pxTransform(0) }}
                    >
                      {item.payTime || ''}
                    </Descriptions.Item>
                  </Descriptions>
                </View>
                <View className={styles['payList-steps-item-right']}>
                  <Text className={styles['payList-steps-item-extra']}>
                    {`${intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}${item.refundAmount}`}
                  </Text>
                  <Text className={styles['payList-steps-item-extra-desc']}>
                    {intl.formatMessage({
                      id: 'refundRecords.components.payList.refundAmount',
                      defaultMessage: '退款金额',
                    })}
                  </Text>
                </View>
                <View className={styles['payList-steps-item-circle']}>
                  <Text className={styles['payList-steps-item-circle-num']}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Empty description="" />
      )}
    </MellowCard>
  )
}

PayList.defaultProps = {
  customStyle: {},
}

export default PayList
