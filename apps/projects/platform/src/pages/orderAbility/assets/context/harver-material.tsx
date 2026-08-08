import { Button, Input } from 'antd'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { HarvestMaterialMock } from '../mock/HarvestMaterialMock'
import { useWebIntl } from '@apps/locales'

/**
 * HarvestMaterial table dataSource context,只限制使用HarvestMaterial Context
 */
export const HarvestMaterialContext = React.createContext({
  dataSource: [],
})

export const HarvestMaterialContextProvider = HarvestMaterialContext.Provider
export const HarvestMaterialContextConsumer = HarvestMaterialContext.Consumer

/**
 *
 * @param props Table修个的时候，需要参数
 * @returns
 */
export function HarvestMaterialInput(props: {
  value: any //input 显示的值
  index: number // table 当前的 index下标
  keyup: string // dataSource 对应的row key
  min?: number
  disabled?: boolean
  onValuesChange?: () => void
}) {
  const context = useContext(HarvestMaterialContext)
  const { value, index, keyup, onValuesChange } = props
  const [inputVal, setInputVal] = useState<any>(value)

  const handleChange = (e) => {
    const targetVal: string = e.target.value
    console.log(targetVal, 'targetVal')
    if (targetVal.length === 0) {
      saveValue(targetVal)
      return
    }
    // 存在小数点 且 字符串必须大于 . +1 才执行
    if (targetVal.includes('.') && targetVal.length != targetVal.indexOf('.')) {
      const reg = new RegExp('((^[0-9][0-9]{0,8})+(.?[0-9]{1,3})?$)')
      const test = reg.test(targetVal)
      if (!test) {
        return
      }
    } else {
      const reg = new RegExp('((^[0-9][0-9]{0,8})+(.?[0-9]{1,3})?$)')
      const test = reg.test(targetVal)
      if (!test) {
        return
      }
    }

    saveValue(targetVal)
  }

  const saveValue = (val: string) => {
    const { dataSource } = context
    dataSource[index][keyup] = val
    context.dataSource = dataSource
    setInputVal(val)
    onValuesChange?.()
  }

  useEffect(() => {
    saveValue(value)
  }, [value])

  return <Input {...props} type="number" value={inputVal} onChange={handleChange} />
}

export function HarvestMaterialDelete(props: { index: number }) {
  const context = useContext(HarvestMaterialContext)
  const { index } = props
  const translate = useWebIntl()
  const handleClick = (e) => {
    const { dataSource } = context
    const r = dataSource.splice(index, 0)
    context.dataSource = r
  }

  return (
    <Button onClick={handleClick} type="link">
      {translate('web.common.delete')}
    </Button>
  )
}
