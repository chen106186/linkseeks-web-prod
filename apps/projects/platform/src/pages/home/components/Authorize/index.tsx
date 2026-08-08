import React, { useMemo } from 'react'
import { authService } from '@apps/services'

interface Iprops {
  /**
   * 准入权限URL
   */
  url: string
  canView?: boolean
  children: React.ReactNode
}

const Authorize: React.FC<Iprops> = (props: Iprops) => {
  const { url, canView, children } = props
  const auth = authService.getAuth()
  const authUrls = useMemo(() => authService.getAuthUrlList(authService.getAuthList()), [])
  return <>{authUrls.includes(url) || canView ? children : null}</>
}

Authorize.defaultProps = {
  canView: false,
}

export default Authorize
