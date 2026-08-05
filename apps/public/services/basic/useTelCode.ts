import { useMemo } from 'react'
import { useRequestApi } from '@linkseeks/hooks'
import { getCommoditySelectGetTelCode } from '@apps/apis'

interface TelCodeReturn {
  telColOptions: {
    label: string
    value: string
    phoneLength: number
  }[]
  getTelPattern: (telCode: keyof typeof TEL_REGEXP, list?: OptionsItem[]) => RegExp
}

interface OptionsItem {
  label: string
  value: string
  disabled: boolean
  phoneLength: number
}

/** 手机号正则判断 */
const TEL_REGEXP = {
  '+86': /^[1-9]\d{10}$/,
  '+852': /^[5-9]\d{7}$/,
  '+886': /^[0-9]\d{9}$/,
  '+82': /^[0-9]\d{10}$/,
  '+853': /^[6]\d{7}$/,
  '+81': /^[0-9]\d{10}$/,
  '+1': /^[0-9]\d{9}$/,
  '+44': /^[0-9]\d{9}$/,
}

/**
 * 获取手机区号数据
 */
const useTelCode = (): TelCodeReturn => {
  const { data } = useRequestApi(getCommoditySelectGetTelCode)

  const telColOptions = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item) => ({
        ...item,
        label: `${item.value} ${item.label}`,
        value: item.label,
      }))
    }
    return []
  }, [data])

  const getTelPattern = (telCode: keyof typeof TEL_REGEXP, list?: OptionsItem[]) => {
    const currentTelOption = (list || telColOptions).find((item) => item.value === telCode)
    return new RegExp(`^\\d{${currentTelOption?.phoneLength || 11}}$`)
  }

  return {
    telColOptions,
    getTelPattern,
  }
}

export default useTelCode
