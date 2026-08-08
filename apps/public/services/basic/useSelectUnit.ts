import { useEffect, useState } from 'react'
import { getProductSelectGetSelectUnit } from '@apps/apis'

export interface OptionItemType {
  value: string
  label: string
  disabled: boolean
}

/**
 * 单位下拉框选项
 * @returns
 */
const useSelectUnit = (type: 'default' | 'custom' = 'default') => {
  const [unitOptions, setUnitOptions] = useState<OptionItemType[]>([])

  const fetchUnitOptions = (name?: string) => {
    return new Promise((resolve) => {
      const param = {
        name: '',
      }
      if (name) {
        param.name = name
      }
      getProductSelectGetSelectUnit(param)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            if (type === 'default') {
              setUnitOptions(res.data)
            }
            resolve(res.data)
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  useEffect(() => {
    if (type === 'default') {
      fetchUnitOptions()
    }
  }, [type])

  return {
    unitOptions,
    fetchUnitOptions,
  }
}

export default useSelectUnit
