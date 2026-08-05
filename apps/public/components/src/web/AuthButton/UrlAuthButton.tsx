import React, { ReactNode, useMemo } from 'react'
import useAccess from '@apps/services/auth/useAccess'
interface UrlAuthButtonProps {
  children: ReactNode

  /**
   * 组件权限code， 当type为custom时，该属性生效
   */
  code: string
}

const UrlAuthButton = (props: UrlAuthButtonProps) => {
  const { code, children } = props
  const { handleUrlAccess } = useAccess()
  return handleUrlAccess(code) ? children : null
}

export default UrlAuthButton
