import { getManageParameterManageGetPlatformParameter } from '@apps/apis'
import { useEffect, useState } from 'react'

interface ParameterValueType {
  language: string
  value: string
}

/**
 * 查看平台配置的全局logo图片
 * @returns
 */
const useGlobalLogo = () => {
  const [logo, setLogo] = useState<string>()

  useEffect(() => {
    const fetchGlobalLogo = () => {
      getManageParameterManageGetPlatformParameter({ code: 'A10' }).then((res) => {
        if (res.code === 1000 && res.data) {
          setLogo(res.data.parameterValue)
        }
      })
    }
    fetchGlobalLogo()
  }, [])

  return {
    logo,
  }
}

export default useGlobalLogo
