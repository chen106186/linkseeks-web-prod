import React, { FC, ReactNode, useMemo } from 'react'
import useAccess from '@apps/services/auth/useAccess'
interface AuthButtonProps {
  type: 'add' | 'edit' | 'detail' | 'custom'
  children: React.ReactElement

  /**
   * 组件权限code， 当type为custom时，该属性生效
   */
  code?: string
}

const AuthButton: FC<AuthButtonProps> = (props) => {
  const { type, code, children } = props
  const { handleAccess } = useAccess()
  return handleAccess(type === 'custom' ? code! : type) ? children : null
}

export default AuthButton
