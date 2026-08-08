import { useEffect, useMemo } from 'react'
import { authService } from './index.service'

const FLATTEN_AUTH_URL_LIST: string[] = []

/**
 * 权限路由校验
 */
const useAuthRouteValidate = () => {
  return authService.validateRouteAuth
}

export default useAuthRouteValidate
