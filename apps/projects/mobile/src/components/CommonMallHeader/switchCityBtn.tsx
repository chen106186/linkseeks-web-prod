/*
 * @Author: GHua
 * @Date: 2022-03-11 18:50:28
 * @LastEditTime: 2022-03-11 19:10:32
 * @LastEditors: GHua
 * @Description:
 */
import React, { useEffect } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { THEME_COLORS } from '@/constants/theme'
import './index.scss'

const SwitchCityBtn = () => {
  const {
    locationStore: { currentCity, getCurrentCity },
  } = useStores()

  useEffect(() => {
    console.log(currentCity, 'currentCity')
    if (!currentCity) {
      getCurrentCity()
    }
  }, [currentCity])

  return (
    <View className="actionsItem" onClick={() => Router.navigateTo('extra/switchCity')}>
      <Text className="actionsIteText">{currentCity?.cityName}</Text>
      <Icons name="ChevronDown" color={THEME_COLORS.placeholder} size={12} />
    </View>
  )
}

export default observer(SwitchCityBtn)
