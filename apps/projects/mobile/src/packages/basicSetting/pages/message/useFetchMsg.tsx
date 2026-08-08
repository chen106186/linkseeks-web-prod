import { useEffect, useState } from 'react'
import { showLoading, showToast, hideLoading, useDidShow } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Toast } from '@apps/mobile-ui'

function useFetchMsg(api: Function) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [dataSource, setDataSource] = useState([])
  const intl = useIntl()
  const fetchData = async (postData: any, merge = false) => {
    if (loading || !hasMore) {
      return
    }
    showLoading()
    setLoading(true)
    const { data, message, code } = await api(postData)
    // console.log(data);
    setLoading(false)
    hideLoading()
    if (code !== 1000) {
      showToast({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
      return
    }
    if (dataSource.length >= data.totalCount) {
      setHasMore(false)
      return
    }
    if (merge) {
      setDataSource((prev) => prev.concat(data.data))
    } else {
      setDataSource(data.data)
    }
  }

  useDidShow(() => {
    fetchData({ current: 1, pageSize: 10 })
  })

  const handleLoadMore = (params: any) => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
    fetchData({ current: page + 1, pageSize: 10, ...params }, true)
  }

  return { loading, hasMore, dataSource, fetchData, handleLoadMore, setDataSource }
}

export default useFetchMsg
