import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { DELIVERIES_DATA } from '@/constants/storage'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import Receiving from '../../../components/mycommodityDetails/Receiving'
import styles from '../index.module.scss'
const MyCommodityDetailsLogistics = () => {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    getAsyncStorage(DELIVERIES_DATA).then((item) => setDataSource(item))
  }, [])
  return (
    <View className={styles.container}>
      <ScrollView>
        <View className={styles.mian}>
          <Receiving dataSource={dataSource} isLogistics />
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(MyCommodityDetailsLogistics)
