import React, { ReactNode, useMemo } from 'react'
import useAccess from '@apps/services/auth/useAccess'
interface AuthBlockProps {
  /**
   * 传入权限code列表
   */
  codeArray: string[]
  /**
   * 返回已过滤的权限列表进行渲染
   */
  render: (list: string[]) => ReactNode
}

/**
 * 对某一个区域做权限控制
 */
const AuthBlock = (props: AuthBlockProps) => {
  const { codeArray, render } = props
  const { handleAccess } = useAccess()
  const _codeList = useMemo(() => codeArray.filter((item) => handleAccess(item)), [codeArray])
  return render(_codeList)
}

export default AuthBlock
