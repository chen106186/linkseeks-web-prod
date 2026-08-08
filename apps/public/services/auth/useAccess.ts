import { useLocation } from '@linkseeks/router-core'
import { useMemoizedFn } from '@linkseeks/hooks'
import { authService } from './index.service'

/**
 * 使用该hook会根据当前location.pathname加上对应的code，在权限列表中进行匹配
 *
 * 默认支持三种内置的快捷权限，新增，编辑，详情
 *
 * 可通过handleAccess 自定义
 */
const useAccess = () => {
  const location = useLocation()

  const handleAccess = useMemoizedFn((type: string) => {
    // 临时放开平台后台的权限控制
    // if (process.env.OUT_SOURCE === '99') {
    //   return true
    // }
    // 830版本，状态字段先不做权限控制
    if (type === 'status') {
      return true
    }
    const validatePath = location.pathname + '/' + type
    return authService.FLATTEN_AUTH_URL_LIST.includes(validatePath)
  })

  const handleUrlAccess = useMemoizedFn((url: string) => {
    // 临时放开平台后台的权限控制
    // if (process.env.OUT_SOURCE === '99') {
    //   return true
    // }
    return authService.FLATTEN_AUTH_URL_LIST.includes(url)
  })

  return {
    canAddAccess: handleAccess('add'),
    canDetailAccess: handleAccess('detail'),
    canEditAccess: handleAccess('edit'),
    handleAccess,
    handleUrlAccess,
  }
}

export default useAccess
