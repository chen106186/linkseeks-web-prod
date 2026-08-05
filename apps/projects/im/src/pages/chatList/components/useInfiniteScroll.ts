import { useMount, useRequestApi } from '@linkseeks/hooks'
import { useEffect, useMemo, useRef, useState } from 'react'

const itemsPerPage = 10

const defaultParams = {
  current: 1,
  pageSize: 10,
}
export const useInfiniteScroll = (apiFunction, refreshDeps: any) => {
  const containerRef = useRef<any>({})
  const [mergeData, setMergeData] = useState<{ totalCount: number; data: any[] }>({ totalCount: 0, data: [] })
  const [prevDeps, setPrevDeps] = useState<any[]>(refreshDeps)
  const [current, setCurrent] = useState<number>(1) // 添加 current 状态
  const { data, run } = useRequestApi<any, any>(apiFunction, {
    debounceWait: 150,
    onSuccess({ code, data: newData }) {
      if (code === 1000) {
        // 否则累加数据
        setMergeData((prev) => ({
          totalCount: newData.totalCount,
          data: [...prev.data, ...newData.data],
        }))
        setCurrent((prev) => prev + 1) // 增加 current
      }
    },
  })

  const refreshInitData = (refreshDeps) => {
    setPrevDeps(refreshDeps)
    setCurrent(1)
    setMergeData({ totalCount: 0, data: [] })
    run(refreshDeps || defaultParams)
  }
  const loadMoreData = async () => {
    const currentItemCount = mergeData.data.length
    const totalItemCount = mergeData?.totalCount || 0 // 假设接口返回的总数字段为 total

    if (currentItemCount < totalItemCount) {
      run({ ...prevDeps, current: current + 1 }) // 使用 current 状态
    } else {
      console.log('没有更多了', currentItemCount, totalItemCount)
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      // 检查是否滚动到底部
      if (scrollTop + clientHeight + 30 >= scrollHeight) {
        loadMoreData()
      }
    }
  }
  useEffect(() => {
    const container = containerRef.current
    if (container && !containerRef.current.IS_READY) {
      containerRef.current.IS_READY = true
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container && containerRef.current?.IS_READY) {
        containerRef.current.IS_READY = false
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [mergeData])

  return { containerRef, data: mergeData, refreshInitData }
}
