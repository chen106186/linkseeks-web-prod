import { getManageParameterManageGetPlatformParameter } from '@apps/apis'
import { useEffect, useState } from 'react'

interface ParameterValueType {
  language: string
  value: string
}

/**
 * 查看平台配置的全局版权信息
 * @returns
 */
const useCopyRight = (locale: string = 'zh-CN') => {
  const [copyRightText, setCopyRightText] = useState<string>()
  const [copyRightUrl, setCopyRightUrl] = useState<string>()

  useEffect(() => {
    const fetchCopyRight = () => {
      getManageParameterManageGetPlatformParameter({ code: 'A11' }).then((res) => {
        if (res.code === 1000 && res.data) {
          const parameter = JSON.parse(res.data.parameterValue) as ParameterValueType[]
          if (Array.isArray(parameter.value) && parameter.value.length > 0) {
            const currentLanguage = parameter.value.find((item) => item.language === locale)
            if (currentLanguage) {
              setCopyRightText(currentLanguage.value)
            }
          }
          if (parameter?.url) {
            setCopyRightUrl(parameter?.url)
          }
        }
      })
    }
    fetchCopyRight()
  }, [])

  return {
    copyRightUrl,
    copyRightText,
  }
}

export default useCopyRight
