import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { ScrollView, View } from '@apps/mobile-ui'
import { getManageMobileInformationMobileHistory } from '@apps/apis'
import NewCard from '../../components/newsCard'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const HistoryList = () => {
  const [firstCategoryList, setFirstCategoryList] = useState<any>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const intl = useIntl()
  const renderItem = (item: any) => <NewCard Item={item} key={item?.id} />
  const gethistoryList = () => {
    getManageMobileInformationMobileHistory().then((res: any) => {
      if (res.code === 1000) {
        setRefreshing(false)
        setFirstCategoryList(res.data)
      }
    })
  }
  usePageInit()
  useEffect(() => {
    gethistoryList()
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'companyNews.lishi',  defaultMessage: '历史' }) });
  }, [])
  const onRefresh = () => {
    setRefreshing(true)
    gethistoryList()
  }
  return (
    <View className={styles.Container}>
      <ScrollView
        className="scroll"
        scrollY
        lowerThreshold={1}
        refresherEnabled
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        <View
          style={{
            height: pxTransform(10),
          }}
        ></View>
        {firstCategoryList?.map((item) => {
          return renderItem(item)
        })}
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(HistoryList)
