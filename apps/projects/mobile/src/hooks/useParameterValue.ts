import { getManageParameterManageGetPlatformParameter } from '@apps/apis'
import { useEffect, useState } from 'react'

interface ParameterValueType {
  logo: string
  appName: Array<{ language: string; value: string }>
  title: Array<{ language: string; value: string }>
  slogen: Array<{ language: string; value: string }>
  welcomeCall: Array<{ language: string; value: string }>
  welcome: Array<{ language: string; value: string }>
}

const useParameterValue = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [parameterValue, setParameterValue] = useState<ParameterValueType>()

  useEffect(() => {
    // 获取小程序配置
    try {
      setLoading(true)
      getManageParameterManageGetPlatformParameter({ code: 'A12' }, { showError: false })
        .then((res) => {
          if (res.code === 1000 && res.data?.parameterValue) {
            const parameterValue = JSON.parse(res.data?.parameterValue)
            console.log(parameterValue, 'parameterValue =>>> parameterValue')
            setParameterValue(parameterValue)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      console.log(error, 'error')
      setLoading(false)
    }
  }, [])

  return {
    loading,
    parameterValue,
  }
}

export default useParameterValue
