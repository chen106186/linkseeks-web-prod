import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import { setNavigationBarTitle, useRouter } from '@apps/mobile-services/utils/taro'
import { ScrollView, View } from '@apps/mobile-ui'
import EmptyLayout from '@/components/Empty'
import {
  getSupportMobileMessageAfterSalePage,
  getSupportMobileMessageCapitalPage,
  getSupportMobileMessageNoticePage,
  getSupportMobileMessagePurchasePage,
  getSupportMobileMessageSystemPage,
  getSupportMobileMessageTradePage,
} from '@apps/apis'
import MsgItem from '../components/MsgItem'
import useFetchMsg from '../useFetchMsg'
import styles from './index.module.scss'
const serviceApiObj = [
  getSupportMobileMessageSystemPage,
  getSupportMobileMessageTradePage,
  getSupportMobileMessagePurchasePage,
  getSupportMobileMessageAfterSalePage,
  getSupportMobileMessageCapitalPage,
  getSupportMobileMessageNoticePage,
]
const PlatformMsg: React.FC = () => {
  const { params } = useRouter()
  const { loading, dataSource, handleLoadMore, setDataSource } = useFetchMsg(serviceApiObj[Number(params.type)])
  const onRead = useCallback((id) => {
    setDataSource((prev) => {
      const index = prev.findIndex((_row: any) => _row.id === id)
      const current: any = [...prev]
      const target: any = {
        ...(current[index] as any),
        status: 1,
      }
      current.splice(index, 1, target as any)
      return current
    })
  }, [])
  const renderItem = ({ item }: any) => {
    const { title: titleName, content, sendTime, isRead, id } = item
    return (
      <View className={styles['message-container']} key={item}>
        <MsgItem
          onRead={onRead}
          type={Number(params.type)}
          title={titleName}
          content={content}
          sendTime={sendTime}
          isRead={isRead}
          id={id}
        />
      </View>
    )
  }
  const loadMore = () => {
    handleLoadMore({})
  }
  useEffect(() => {
    setNavigationBarTitle({
      title: decodeURI(params.title || '') || '',
    })
  }, [])
  return (
    <View className={styles['page']}>
      {dataSource.length ? (
        <View className={styles['scroll-view']}>
          <ScrollView
            className={styles['main']}
            renderItem={renderItem}
            scrollY
            refresherEnabled
            refreshing={loading}
            onRefresh={() => {
              handleLoadMore({
                current: 1,
              })
            }}
            keyExtractor={(item, index) => `msg-${index}`}
            data={dataSource}
            onEndReached={loadMore}
            onEndReachedThreshold={1}
          />
        </View>
      ) : (
        <View className={styles['message-view']}>
          <EmptyLayout />
        </View>
      )}
    </View>
  )
}
export default GlobalWrapper(PlatformMsg)
