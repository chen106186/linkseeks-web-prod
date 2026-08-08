import { usePageStatus } from '@/hooks/usePageStatus'
import { useEffect, useState } from 'react'

/**
 * 初始化表单数据, 可传入给NiceForm的initialValues
 * @param service 必须保证返回数据中有data属性 并且匹配NiceForm
 */
export const useInitValue = (service) => {
  const { id } = usePageStatus()
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    if (id) {
      service({ id }).then(({ data }) => {
        setState(data)
      })
    }
  }, [])

  return state
}
