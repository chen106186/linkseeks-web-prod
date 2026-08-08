import { useMemo } from 'react'
import useQuery from './useQuery'
import { useLocation } from 'react-router-dom'

export enum PAGE_STATUS {
  ADD = 'add',
  EDIT = 'edit',
  DETAIL = 'detail',
}

export interface PageStatusOption {}

export const usePageStatus = (options?: PageStatusOption) => {
  const { preview, id = '', version = '', ...rest } = useQuery()
  const { pathname } = useLocation()
  const pageStatus: PAGE_STATUS = useMemo(() => {
    const lastTypeParams = pathname.substring(pathname.lastIndexOf('/'))
    return lastTypeParams as PAGE_STATUS
  }, [pathname])
  return {
    id,
    pageStatus,
  }
}
