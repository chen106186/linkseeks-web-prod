import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, Icons } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import cx from 'classnames'
import ImageBox from '@/components/ImageBox'
import NavBar from '@/components/NavBar'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import useJmpHome from '@/hooks/useJmpHome'
import { ShopInfoType } from '@/store/userStore/model'
import styles from './index.module.scss'
const SelectOwnMall = () => {
  const [shopList, setShopList] = useState<ShopInfoType[]>([])
  const [shopItem, setShopItem] = useState<ShopInfoType>()
  const {
    userStore: { setShopAndSite },
    templateStore: { getSelfMallDesignConfig },
  } = useStores()
  const { getAppShopTypeSelect } = useJmpHome()
  const intl = useIntl()
  const getMemberShopList = async () => {
    // 移动端默认商城 1为联营商城 2为自营商城
    const { shopSelectList = [] } = await getAppShopTypeSelect()
    setShopList(shopSelectList)
  }
  useEffect(() => {
    getMemberShopList()
  }, [])
  const onItem = (item: ShopInfoType) => {
    setShopItem(item)
  }
  const handleSubmit = async () => {
    if (!shopItem) {
      return
    }
    await getSelfMallDesignConfig(shopItem?.id, shopItem.memberId)
    setShopAndSite(shopItem)
    Router.reLaunch('extra/mall/own')
  }
  return (
    <View className={styles.container}>
      <NavBar
        title={intl.formatMessage({
          id: 'own_select_mall',
          defaultMessage: '选择自营商家',
        })}
      />
      <ScrollView className={styles.Warp} scrollY showScrollbar={false}>
        <View className={styles.shopList}>
          {shopList &&
            shopList.map((item) => (
              <View key={item.id} onClick={() => onItem(item)}>
                <View className={cx(styles.shopListItem, shopItem?.id === item.id && styles.active)}>
                  <ImageBox source={item.logoUrl} width={32} height={32} />
                  <Text className={styles.name}>{item.name}</Text>
                  {shopItem?.id === item.id && (
                    <Icons name="Right" color="#D8612E" className={styles.right_icon} size={16} />
                  )}
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <View className={styles.bottom_wrap}>
        <Button className={styles.btn} type="primary" onClick={handleSubmit} disabled={!shopItem?.memberId}>
          <Text className={styles.text}>
            {intl.formatMessage({
              id: 'mall_own_select_confirm',
              defaultMessage: '确定',
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(SelectOwnMall))
