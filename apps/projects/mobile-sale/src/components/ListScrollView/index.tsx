import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { ScrollView, View } from '@apps/mobile-ui'
import { checkMore } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'
import cs from 'classnames'
import styles from './index.module.scss'

export type UpdateRefType = {
  updateList: (params: any) => void
}

type PropsType = {
  requestApi: Function
  renderItem: ({
    item,
    index,
  }: {
    item: any
    index: any
  }) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null
  pageSize?: number
  customClassName?: string
  customStyle?: React.CSSProperties
  initParams?: Object
  initFetch?: boolean
}

const ListScrollView = (props: PropsType, ref) => {
  const intl = useIntl()
  const {
    requestApi,
    renderItem,
    pageSize = 10,
    customClassName,
    customStyle = {},
    initParams = {},
    initFetch = true,
  } = props
  const [list, setList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const pageRef = useRef<number>(1)
  const otherParamsRef = useRef<any>({})

  const getList = () => {
    return new Promise<any[]>((resolve, reject) => {
      const params: any = {
        current: pageRef.current,
        pageSize,
        ...initParams,
        ...otherParamsRef.current,
      }
      setLoading(true)
      requestApi(params)
        .then((res) => {
          if (res.code === 1000) {
            const newList = res.data.data || []
            setHasMore(checkMore(pageRef.current, pageSize, newList.length, res.data.totalCount))
            resolve(newList)
          } else {
            reject()
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  // 滚动加载更多
  const onLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getList().then((newList) => setList([...list, ...newList]))
  }

  // 更新列表
  const updateList = (params = {}, isClear = false) => {
    otherParamsRef.current = isClear ? params : { ...otherParamsRef.current, ...params }
    pageRef.current = 1 // 更新列表参数都需要将页码重置为 1
    getList().then((newList) => setList(newList))
  }

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    updateList()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  useImperativeHandle(ref, () => ({
    updateList: updateList,
  }))

  useEffect(() => {
    initFetch && updateList()
  }, [])

  return (
    <View className={cs(styles['scrollView-box'])}>
      <ScrollView
        data={list}
        renderItem={renderItem}
        horizontal={false}
        listEmptyComponent={
          <Empty description={intl.formatMessage({ id: 'common.data.empty', defaultMessage: '暂无数据' })} />
        }
        listFooterComponent={<Loading loading={loading} noMore={!hasMore} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={50}
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={() => handleRefresh()}
        className={cs(styles['scrollView'], customClassName)}
        style={customStyle}
      />
    </View>
  )
}

export default forwardRef(ListScrollView)
