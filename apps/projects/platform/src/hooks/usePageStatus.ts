import { useLocation, useQuery } from '@linkseeks/router-core'

export enum PageStatus {
  ADD,
  EDIT,
  PREVIEW,
  /**
   * 变更
   */
  VARIATION,
}

type resultData = {
  id: string
  pageStatus: PageStatus
  lastTypeParams: string
  preview: any
  version?: string | string[]
} & {
  [key: string]: any
}

export const usePageStatus = (): resultData => {
  const { pathname } = useLocation()
  const { preview, id = '', version = '', ...rest } = useQuery()
  const lastTypeParams = pathname.substr(pathname.lastIndexOf('/'))
  // 默认预览状态
  let pageStatus = PageStatus.PREVIEW
  if (preview === '1') {
    pageStatus = PageStatus.PREVIEW
  } else {
    if (id) {
      pageStatus = lastTypeParams === '/variation' ? PageStatus.VARIATION : PageStatus.EDIT
    } else {
      pageStatus = PageStatus.ADD
    }
  }

  return {
    pageStatus,
    id,
    version,
    preview,
    lastTypeParams,
    ...rest,
  }
}
