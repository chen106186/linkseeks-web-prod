import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-07 21:15:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-09 14:35:50
 * @Description: 修改退款金额
 */
import React, { useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui'
import Descriptions from '@/components/Descriptions'
import { PAY_WAY } from '@/constants/const/payWay'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { PayListItem } from '../../../../afterRecords/refundRecords/components/PayList'
import Bookshelf from '../../../../afterRecords/components/Bookshelf'
import styles from './index.module.scss'
interface RouteParams {
  /**
   * 数据
   */
  payList: PayListItem[]
}
const RefundEditReturnmount = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const { payList = [] } = params
  const [list] = useState(payList)
  const intl = useIntl()
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={intl.formatMessage({
            id: 'refundTodo.refundEditReturnmount.nav',
            defaultMessage: '退款金额',
          })}
        />
      }
    >
      <View className={styles['refund-edit-returnAmount']}>
        <View className={styles['refund-edit-returnAmount-scrollView']}>
          {list.map((item) => (
            <View key={`${item.payId}`} className={styles['refund-edit-returnAmount-list-item']}>
              <Bookshelf
                title={
                  <View className={styles['refund-edit-returnAmount-list-item-title']}>
                    <Text className={styles['refund-edit-returnAmount-list-item-name']}>{item.payNode}</Text>
                  </View>
                }
                footLeft={
                  <Text className={styles['refund-edit-returnAmount-list-item-label']}>{`${intl.formatMessage({
                    id: 'refundTodo.refundEditReturnmount.refundAmount',
                    defaultMessage: '退款金额',
                  })}：`}</Text>
                }
                footRight={
                  <Text className={styles['refund-edit-returnAmount-list-item-amount']}>
                    {intl.formatMessage({
                      id: 'currency',
                      defaultMessage: '￥',
                    })}
                    {item.refundAmount || 0}
                  </Text>
                }
                customContentStyle={{
                  paddingBottom: 8,
                }}
                ribbon={false}
              >
                <Descriptions labelWidth={66} column={1}>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'refundTodo.refundEditReturnmount.refundAmount',
                      defaultMessage: '支付金额',
                    })}
                  >
                    {`${intl.formatMessage({
                      id: 'currency',
                      defaultMessage: '￥',
                    })}${item.payAmount}`}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'refundTodo.refundEditReturnmount.payRatio',
                      defaultMessage: '支付比例',
                    })}
                  >
                    {`${item.payRatio}%`}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={intl.formatMessage({
                      id: 'refundTodo.refundEditReturnmount.payWay',
                      defaultMessage: '支付方式',
                    })}
                  >
                    {PAY_WAY[item.payWay!] || ''}
                  </Descriptions.Item>
                </Descriptions>
              </Bookshelf>
            </View>
          ))}
        </View>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RefundEditReturnmount)
