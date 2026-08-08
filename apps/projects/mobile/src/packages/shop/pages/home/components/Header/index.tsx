import React, { useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import { View, Icons, Text, Image } from '@apps/mobile-ui'
import { showToast, hideToast } from '@apps/mobile-services/utils/taro'
import NavBar from '@/components/NavBar'
import ImageBox from '@/components/ImageBox'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import { ShopInfoType } from '@/store/templateStore/model'
import { useIntl } from '@linkseeks/i18n'
import { postCommodityMobileStoreMobileCollect } from '@apps/apis'
import Router from '@/utils/router'
import styles from './index.module.scss'

interface HeaderProps {
  shopInfo: ShopInfoType
  backgroundImg: string | undefined
}

const Header: React.FC<HeaderProps> = (props) => {
  const { shopInfo, backgroundImg } = props
  const [collectStatus, setCollectStatus] = useState<boolean>(false)
  const collectLoading = useRef<boolean>(false)
  const intl = useIntl()

  useEffect(() => {
    setCollectStatus(shopInfo?.collectStatus || false)
  }, [shopInfo])

  const handleCollect = () => {
    if (collectLoading.current) return
    const param: any = {
      id: shopInfo?.id,
      status: !collectStatus,
    }
    collectLoading.current = true

    postCommodityMobileStoreMobileCollect(param)
      .then((res) => {
        if (res.code === 1000) {
          hideToast()
          showToast({
            title: !collectStatus
              ? intl.formatMessage({ id: 'shop_home_header_collect_success' })
              : intl.formatMessage({ id: 'shop_home_header_collect_cancel' }),
            icon: 'none',
          })
          setCollectStatus(!collectStatus)
        }
        collectLoading.current = false
      })
      .catch(() => {
        collectLoading.current = false
      })
  }

  return (
    <View className={styles['shop-header']}>
      <View className={styles['shop-header-background']}>
        <Image className={styles['shop-header-background-img']} src={backgroundImg || shopInfo?.logo || ''} />
      </View>
      <View className={styles['shop-header-body']}>
        <NavBar
          customRenderLeft={<Icons name="ChevronLeft" size={24} color="#FFF" onClick={() => Router.navigateBack()} />}
          customClassName={styles['shop-header-nav']}
          title={
            <View className={styles['shop-header-search']}>
              <View
                className={styles['shop-header-search-body']}
                onClick={() => Router.navigateTo('shop/shopSearch', { storeId: shopInfo?.id })}
              >
                <Icons name="Search" size={20} color="#FFF" />
                <Text className={styles['shop-header-search-placeholder']}>
                  {intl.formatMessage({
                    id: 'shop_home_header_search_palceholder',
                    defaultMessage: '请输入商品名称或者品类',
                  })}
                </Text>
              </View>
            </View>
          }
          greedy
        />
        <View className={styles['shop-header-container']}>
          <ImageBox width={40} height={40} borderRadius={8} source={shopInfo?.logo || ''} />
          <View className={styles['shop-header-store-info']}>
            <View
              className={styles['shop-header-store-info-name-wrap']}
              onClick={() => Router.navigateTo('shop/shopAbout', { shopId: shopInfo?.id })}
            >
              <Text className={styles['shop-header-store-info-name']}>{shopInfo?.name}</Text>
              <Icons name="ChevronRight" size={14} color="#252D37" />
            </View>
            <ShopCreditInfo
              creditPoint={shopInfo?.creditPoint || 0}
              registerYears={shopInfo?.registerYears || 0}
              showStar
              avgTradeCommentStar={shopInfo?.avgTradeCommentStar || 0}
            />
          </View>
          <View
            className={cx(styles['shop-header-collect-btn'], collectStatus ? styles['active'] : '')}
            onClick={handleCollect}
          >
            {collectStatus ? (
              <Icons name="StarFill" size={14} color="#00A98F" />
            ) : (
              <Icons name="Star" size={14} color="#252D37" />
            )}
            {collectStatus ? (
              <Text className={styles['shop-header-collect-btn-text']}>
                {intl.formatMessage({ id: 'shop_home_header_collected_btn', defaultMessage: '已收藏 ' })}
              </Text>
            ) : (
              <Text className={styles['shop-header-collect-btn-text']}>
                {intl.formatMessage({ id: 'shop_home_header_collect_btn', defaultMessage: '收藏 ' })}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Header
