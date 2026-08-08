import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
// import GlobalHeader from '../../../../../components/GlobalHeader';
import LevelHistory from '../../components/LevelHistory'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const ActiveRecord = () => {
  const { upperMemberId, upperRoleId, isShop }: any = getCurrentInstance()?.router?.params
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({id: 'member.active.activeRecord.navigationBarTitleText',  defaultMessage: '活跃分获取记录' })
    // })
  }, [])
  return (
    <View style={styles.activeRecord}>
      {/* <GlobalHeader title="活跃分获取记录" statusBar /> */}
      <LevelHistory upperMemberId={upperMemberId} upperRoleId={upperRoleId} isShop={isShop} LevelHistory />
    </View>
  )
}
export default GlobalWrapper(ActiveRecord)
