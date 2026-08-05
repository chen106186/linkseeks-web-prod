import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { View, WebView } from '@tarojs/components'
import styles from './index.module.scss'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
export type KuaiDi100Item = string
let i = 0
const KuaiDi100 = () => {
  const { nu }: any = getCurrentInstance()?.router?.params
  const webHandle = () => {
    if (i) {
      i = 0
      Router.navigateBack()
    } else {
      i += 1
    }
  }
  return (
    <View className={styles.container}>
      <WebView src={`https://m.kuaidi100.com/app/query/?coname=indexall&nu=${nu}`} onLoad={webHandle} />
    </View>
  )
}
export default GlobalWrapper(KuaiDi100)
