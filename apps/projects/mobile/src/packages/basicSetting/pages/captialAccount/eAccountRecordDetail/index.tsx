import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import cx from 'classnames'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Image, Text } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail } from '@apps/apis'
import { getTypeImg } from '../../../utils'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const EAccountRecordDetail = () => {
  const detail = (getCurrentInstance().preloadData ||
    {}) as unknown as GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.jiaoyimingxi', defaultMessage: '交易明细' }) })
  }, [])
  return (
    <View className={styles['eAccountRecordDetail']}>
      <ScrollView className={styles['eAccountRecordDetail_container']}>
        <View className={styles['eAccountRecordDetail_listContainer']}>
          <View className={styles['listContainerBg']}>
            <View className={styles['listHeader']}>
              <View className={styles['listHeaderTitle']}>
                <Image className={styles['icon']} src={getTypeImg(detail?.tradeType)} />
                <View className={styles['listHeaderText']}>
                  <Text className={styles['listHeaderTextTitle']}>{detail?.tradeType}</Text>
                </View>
              </View>
              <Text className={styles['listItemHeaderAmount']}>{detail.chgAmount}</Text>
            </View>
          </View>
        </View>

        <View className={styles['eAccountRecordDetail_listContainer']}>
          <View className={styles['listContainerBg']}>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.shanghuzhifuhao',
                      defaultMessage: '商户支付号',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.bizOrderNo}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.jiaoyiliushuihao',
                      defaultMessage: '交易流水号',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.tradeNo}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.biangengjine',
                      defaultMessage: '变更金额',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.chgAmount}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.yuanshijine',
                      defaultMessage: '原始金额',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.oriAmount}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.xianyoujine',
                      defaultMessage: '现有金额',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.curAmount}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.biangengshijian',
                      defaultMessage: '变更时间',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.changeTime}</Text>
              </View>
            </View>
            <View className={styles['listItem']}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.jiaoyileixing',
                      defaultMessage: '交易类型',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.tradeType}</Text>
              </View>
            </View>
            <View className={cx(styles['listItem'], styles['listItemLast'])}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.biangengzileixing',
                      defaultMessage: '变更子类型',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.type}</Text>
              </View>
            </View>
            <View className={cx(styles['listItem'], styles['listItemLast'])}>
              <View className={styles['listItemLeft']}>
                <View className={styles['listItemText']}>
                  <Text className={styles['listItemTextTitle']}>
                    {intl.formatMessage({
                      id: 'pay.fenzhangbeizhu',
                      defaultMessage: '分账备注',
                    })}
                  </Text>
                </View>
              </View>
              <View className={styles['listItemRight']}>
                <Text className={styles['listItemTextAmount']}>{detail?.remark}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(EAccountRecordDetail)
