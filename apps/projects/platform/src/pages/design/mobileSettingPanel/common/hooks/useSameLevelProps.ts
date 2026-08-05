import React, { useMemo, useEffect } from 'react'
import { useSelector } from '@apps/design-react'

interface useSamLevelPropsType {
  key: string
}

const useSamLevelProps = (props: useSamLevelPropsType) => {
  const { key } = props
  const { pageConfig } = useSelector<any, any>(['pageConfig'])

  const result = useMemo(() => {
    // 判断key是否含有’-‘符号的子模块
    if (key && key.indexOf('-') > -1) {
      const keySplit = key.split('-')
      keySplit.pop()
      const commonKey = `${keySplit.join('-')}-`
      let propsList: any[] = []
      pageConfig &&
        Object.keys(pageConfig).forEach((moduleKey: string) => {
          if (moduleKey.indexOf(commonKey) > -1) {
            if (pageConfig[moduleKey]?.props) {
              propsList.push(pageConfig[moduleKey]?.props)
            }
          }
        })
      return propsList
    } else {
      return []
    }
  }, [key])

  return result
}

export default useSamLevelProps
