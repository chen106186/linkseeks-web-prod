import { useLocation, useQuery } from '@linkseeks/router-core'
import { useMemo } from 'react'

export enum PageStatus {
  ADD,
  EDIT,
  PREVIEW,
}

export const usePageStatus = () => {
  const { preview, id = '', ...rest } = useQuery()
  const location = useLocation()
  const isDetail = useMemo(() => {
    return location.pathname.split('/').pop() === 'detail'
  }, [location.pathname])
  // 默认预览状态
  let pageStatus = PageStatus.PREVIEW
  if (preview === '1') {
    pageStatus = PageStatus.PREVIEW
  } else {
    if (id) {
      pageStatus = PageStatus.EDIT
    } else {
      pageStatus = PageStatus.ADD
    }
  }

  return {
    pageStatus,
    id,
    preview,
    isDetail,
    ...rest,
  }
}
