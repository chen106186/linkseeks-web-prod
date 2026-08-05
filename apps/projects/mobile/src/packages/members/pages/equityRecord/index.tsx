import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import LevelHistory from '../../components/LevelHistory'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const EquityRecord = () => {
  const { upperMemberId, upperRoleId, isShop }: any = getCurrentInstance()?.router?.params
  const [selTab, setSelTab] = useState<number>(0)
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({id: 'member.active.equityRecord.navigationBarTitleText',  defaultMessage: '权益记录' })
    // })
  }, [])
  return (
    <View className={styles.memberPower}>
      <View className={styles['tabs-header']}>
        <View
          className={styles['tabs-title']}
          onClick={() => {
            setSelTab(0)
          }}
        >
          <Text>
            {intl.formatMessage({
              id: 'member.active.equityRecord.tab_1',
              defaultMessage: '获取',
            })}
          </Text>
          {selTab === 0 && <View className={styles['tabs-title-bottom']} />}
        </View>
        <View
          className={styles['tabs-title']}
          onClick={() => {
            setSelTab(1)
          }}
        >
          <Text>
            {intl.formatMessage({
              id: 'member.active.equityRecord.tab_2',
              defaultMessage: '使用',
            })}
          </Text>
          {selTab === 1 && <View className={styles['tabs-title-bottom']} />}
        </View>
      </View>
      <View
        className={styles['tabs-item']}
        style={{
          display: selTab === 0 ? 'flex' : 'none',
        }}
      >
        <LevelHistory upperMemberId={upperMemberId} upperRoleId={upperRoleId} isShop={isShop} RightHistory />
      </View>
      <View
        className={styles['tabs-item']}
        style={{
          display: selTab === 1 ? 'flex' : 'none',
        }}
      >
        <LevelHistory upperMemberId={upperMemberId} upperRoleId={upperRoleId} isShop={isShop} RightSpendHistory />
      </View>
    </View>
  )
}
export default GlobalWrapper(EquityRecord)
