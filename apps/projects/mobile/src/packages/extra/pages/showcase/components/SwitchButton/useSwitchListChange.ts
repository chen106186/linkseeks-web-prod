/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-11 15:38:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-11 15:38:48
 * @Description: 切换列表样式 hook
 */
import { useState } from 'react'

const useSwitchListChange = (initType: string, typeEnum: string[]) => {
  const [listType, setListType] = useState<any>(initType)

  const next = () => {
    const index = typeEnum.findIndex((item) => item === listType)
    if (index !== -1) {
      const nextIndex = index !== typeEnum.length - 1 ? index + 1 : 0
      const nextEnum = typeEnum[nextIndex]
      setListType(nextEnum)
    }
  }

  return {
    listType,
    next,
  }
}

export default useSwitchListChange
