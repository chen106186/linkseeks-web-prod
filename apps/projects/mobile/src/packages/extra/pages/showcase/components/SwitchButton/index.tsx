/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-12 11:15:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-12 14:48:36
 * @Description: 商品列表样式切换按钮
 */
import React, { useEffect, useState } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import { Events } from '@apps/mobile-services/utils/taro'
import useSwitchListChange from './useSwitchListChange'
import './index.scss'

interface SwitchButtonProps {
  /**
   * 类型，可选 default | larger
   */
  type?: 'default' | 'larger'
  /**
   * 点击切换事件
   */
  onSwitch?: () => void
}

const TYPE_ARR = ['default', 'larger']
const DEFAULT_TYPE = 'default'
const ICON_MAP = {
  default: 'Grid-1',
  larger: 'Llist',
}

const switchEvents = new Events()

const SwitchButton: React.FC<SwitchButtonProps> = (props: SwitchButtonProps) => {
  const { type, onSwitch } = props
  const [listType, setListType] = useState<any>(DEFAULT_TYPE)

  useEffect(() => {
    if ('type' in props) {
      setListType(type)
    }
  }, [type])

  const handleSwitch = () => {
    if (!('type' in props)) {
      const index = TYPE_ARR.findIndex((item) => item === listType)
      if (index !== -1) {
        const nextIndex = index !== TYPE_ARR.length - 1 ? index + 1 : 0
        const nextEnum = TYPE_ARR[nextIndex]
        setListType(nextEnum)
        switchEvents.trigger('onSwitchTypeChange', nextEnum)
      }
    }
    if (onSwitch) {
      onSwitch()
    }
  }

  return (
    <View className="swtich-btn" onClick={handleSwitch}>
      <Icons name={ICON_MAP[listType]} size={16} color="#8F7564" />
    </View>
  )
}

export { SwitchButton as default, useSwitchListChange, TYPE_ARR, DEFAULT_TYPE, switchEvents }
