import { useEffect, useState } from 'react'
import { showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Toast } from '@apps/mobile-ui'

type T = any
const useFetchCollection = (api: Function, status: number, param?: Omit<T, 'mode'>) => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [totalCount, setTotalcount] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const intl = useIntl()
  const getDatas = async (getData: any) => {
    setLoading(true)
    try {
      const { data, message, code } = await api({ ...getData, status, ...param })
      if (code !== 1000) {
        showToast({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
        return
      }
      let datas = data.data.map((item: any) => ({
        ...item,
        status,
        newGet: new Date().getTime() - item.creatTime < 24 * 60 * 60 * 1000,
        willOver: item.effectiveTimeEnd - new Date().getTime() < 24 * 60 * 60 * 1000,
      }))
      if (param?.isShop) {
        datas = datas.filter((v) => Number(v.belongType) === 2)
      }
      let newData = [...datas]
      if (getData?.current && getData?.current > 1) {
        newData = dataSource.concat(datas)
      }
      setDataSource(newData)
      setTotalcount(data.totalCount)
      // page * 10 > data,totalCount 是为了解决脏数据
      if (newData.length >= data.totalCount || page * 10 > data.totalCount) {
        setHasMore(false)
      }
    } finally {
      setLoading(false)
    }
  }
  const fetchData = (getData: any) => {
    if (loading || !hasMore) {
      return
    }
    getDatas(getData)
  }
  const refreshData = () => {
    if (loading) {
      return
    }
    const getData = { current: 1, pageSize: 10 }
    getDatas(getData)
  }
  useEffect(() => {
    fetchData({ current: page, pageSize: 10 })
  }, [])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
    fetchData({ current: page + 1, pageSize: 10 })
  }
  return { dataSource, totalCount, loading, hasMore, handleLoadMore, refreshData }
}

export default useFetchCollection
