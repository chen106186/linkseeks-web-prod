import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface BrandItem {
  id: number
  logoUrl: string
  name: string
}

interface ItemType {
  brandList: BrandItem[]
  id: number
  image: string
  name: string
}

interface BrandProps {
  list: ItemType[]
}

const Brand: React.FC<BrandProps> = (props) => {
  const { list } = props
  const intl = useIntl()

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  const handleBrandFilter = (info: BrandItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { brandId: info.id })
  }

  return list && list.length > 0 ? (
    <View className={styles['recommend-brand-list']}>
      {list.map((item) => (
        <View className={styles['recommend-brand-list-item']} key={item.id}>
          <View className={styles['recommend-brand-list-item-header']}>
            <View className={styles['recommend-brand-list-item-header-logo']}>
              <ImageBox width={40} height={40} source={item.image} />
            </View>
            <View className={styles['shopInfo']}>
              <View className={styles['shopNameWrapper']}>
                <Text className={styles['shopName']}>{item.name}</Text>
              </View>
            </View>
          </View>
          <View className={styles['brand-list']}>
            {item.brandList &&
              item.brandList.map((brandItem: any) => (
                <View
                  className={styles['brand-list-item']}
                  key={`brandItem${brandItem.id}`}
                  onClick={() => handleBrandFilter(brandItem)}
                >
                  <View className={styles['brand-list-item-body']}>
                    <ImageBox width={80} height={32} source={brandItem.logoUrl} />
                  </View>
                </View>
              ))}
          </View>
        </View>
      ))}
      {_listFooter()}
    </View>
  ) : null
}

export default Brand
