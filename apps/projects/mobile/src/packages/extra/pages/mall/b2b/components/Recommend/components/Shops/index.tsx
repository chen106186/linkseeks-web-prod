import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import ShopItem from '@/components/ShopItem'
import { useIntl } from '@linkseeks/i18n'
import { CurrentCityType } from '@/store/locationStore/model'
import styles from './index.module.scss'

interface ShopListType {
  productIds: number[]
  productList: any
  id: number
  creditPoint: number
  logo: string
  memberName: string
  name: string
  registerYears: number
}

interface ShopsProps {
  list: ShopListType[]
  shopId?: number
  currentCity?: CurrentCityType
}

const Shops: React.FC<ShopsProps> = (props) => {
  const { list, shopId, currentCity } = props
  const intl = useIntl()

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  return (
    <View className={styles.shopList}>
      {list &&
        list.map((shopItem) => (
          <ShopItem
            key={shopItem.id}
            {...shopItem}
            contextShopId={shopId}
            contextProvinceCode={currentCity?.provinceCode}
            contextCityCode={currentCity?.cityCode}
          />
        ))}
      {_listFooter()}
    </View>
  )
}

export default Shops
