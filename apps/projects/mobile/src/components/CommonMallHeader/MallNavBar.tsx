/*
 * @Author: GHua
 * @Date: 2022-03-11 16:29:01
 * @LastEditTime: 2022-03-14 10:09:39
 * @LastEditors: GHua
 * @Description: 共用商城头部
 */
import React, { useEffect, useState } from 'react'
import { getMenuButtonBoundingClientRect, reLaunch } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@tarojs/components'
import { useStatusBarHeight } from '@apps/mobile-services'
import { ActionSheet, Icons } from '@apps/mobile-ui'
import SwitchCityBtn from './switchCityBtn'
import './index.scss'
import { useToggle } from '@linkseeks/hooks'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { getIntl } from '@linkseeks/i18n'
import { useMobileIntl } from '@apps/locales'
import { IS_WEB } from '@/constants'

interface MallNavBarProps {
  title: string | undefined
  extra?: React.ReactNode
  onClick?: () => void
}

const MallNavBar: React.FC<MallNavBarProps> = (props) => {
  const { title, extra, onClick } = props
  const {
    userStore: { mallList, shopAndSite, setShopAndSite },
  } = useStores()
  const [visible, toggle] = useToggle()
  const { statusBarHeight } = useStatusBarHeight()
  const intl = getIntl()
  const translate = useMobileIntl()
  const [menuRect, setMenuRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  })

  const getMenuRect = () => {
    const res = getMenuButtonBoundingClientRect()
    setMenuRect(res)
  }

  useEffect(() => {
    getMenuRect()
  }, [])

  const navHeight = statusBarHeight + menuRect.height + (menuRect.top - statusBarHeight) * 2

  const handleLink = () => {
    // if (shopAndSite?.isSelf) {
    //   onClick && onClick()
    // } else {
    //   // 联营商城，自行处理逻辑
    //   toggle()
    // }
  }

  const handleAction = (event, item) => {
    setShopAndSite(item.value)
    intl.i18n.changeLanguage(item.value.language)
    if (IS_WEB) {
      window.location.reload()
    } else {
      Router.reLaunch('extra/mall/b2b')
    }
    // setTimeout(() => {
    //   // Router.reLaunch('extra/mall/b2b')
    // }, 500)
  }

  return (
    <View className="mall_nav_bar" style={`padding-top: ${statusBarHeight + 'PX'};height: ${navHeight + 'PX'};`}>
      <SwitchCityBtn />
      <View className="mall_nav_bar_title">
        <Text className="mall_nav_bar_title_text" onClick={handleLink}>
          {title}
          {!shopAndSite?.isSelf && mallList.length > 1 && (
            <Icons name="ArrowDownFill" size={24} color="#5A2A12" className="exchange_icon" />
          )}
        </Text>
        {extra}
      </View>
      <View className="actionsItem"></View>
      <ActionSheet
        isOpened={visible}
        onCancel={toggle}
        onSelect={handleAction}
        title={translate('mobile.common.qiehuanshancheng')}
        actions={mallList.map((v) => ({
          name: v.name,
          value: v,
        }))}
      />
    </View>
  )
}

export default observer(MallNavBar)
