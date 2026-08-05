import { useEffect, useState, useCallback } from 'react'
import { showToast, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { Toast } from '@apps/mobile-ui'
import { requestHeaders } from '@/types/request'
import { useIntl } from '@linkseeks/i18n'

const useFetchCollection = (api: Function, mode: string, active: string, header?: requestHeaders, postParams?: any) => {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isRefresh, setIsRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [removeLoading, setRemoveLoading] = useState<boolean>(false)
  const intl = useIntl()

  const fetchData = async (postData: any) => {
    if (loading || !hasMore) {
      return
    }

    setLoading(true)
    showLoading()
    try {
      const { data, message, code } = await api(postData, { headers: header ?? {} })
      if (code !== 1000) {
        showToast({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
        return
      }
      const newData = dataSource.concat(data.data)
      setDataSource(newData)
      // page * 10 > data,totalCount 是为了解决脏数据
      if (newData.length >= data.totalCount || page * 10 > data.totalCount) {
        setHasMore(false)
      }
    } finally {
      setLoading(false)
      hideLoading()
    }
  }

  const refresh = async () => {
    if (loading) {
      return
    }
    const postData = { current: 1, pageSize: 10, ...postParams }
    setLoading(true)
    showLoading()
    try {
      const { data, message, code } = await api(postData, { headers: header ?? {} })
      if (code !== 1000) {
        showToast({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
        return
      }
      const newData = data.data
      setDataSource(newData)
      // page * 10 > data,totalCount 是为了解决脏数据
      if (newData.length >= data.totalCount || page * 10 > data.totalCount) {
        setHasMore(false)
      }
    } finally {
      setLoading(false)
      hideLoading()
    }
  }

  useEffect(() => {
    if (active === mode && page === 1 && hasMore) {
      fetchData({ current: page, pageSize: 10, ...postParams })
    }
  }, [active])

  const handleLoadMore = (params: any) => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
    fetchData({ current: page + 1, pageSize: 10, ...params })
  }

  const handleRemove = async (service: Function, postData: any, key: string, value: number) => {
    setRemoveLoading(true)
    try {
      const newData = dataSource.filter((item) => item[key] !== value)
      const { code, message } = await service(postData)
      if (code === 1000) {
        setDataSource(newData)
        Toast.show({
          title: intl.formatMessage({ id: 'card.myCollections.action.delete.success', defaultMessage: '删除成功' }),
        })
        return
      }
      showToast({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
      setDataSource(dataSource)
    } finally {
      setRemoveLoading(false)
    }
  }

  return { loading, hasMore, dataSource, fetchData, handleLoadMore, handleRemove, removeLoading, refresh }
}

export default useFetchCollection
