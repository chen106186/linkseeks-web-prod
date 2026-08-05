import GlobalWrapper from '@/components/GlobalWrapper'
import { SHOP_TYPE } from '@/constants/const/shop'
import { ScrollView, View, Text, Button } from '@apps/mobile-ui'
import { showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import { useSafeArea } from '@apps/mobile-services'
import { ENVIRONMENT } from '@/constants'
import classNames from 'classnames'
import NavBar from '@/components/NavBar'
import { SelfMallInfoType, ShopInfoType } from '@/store/userStore/model'
import React, { useEffect, useState } from 'react'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import {
  getCommodityMobileShopMobileAppShopTypeSelect,
  GetCommodityMobileShopMobileAppShopTypeSelectResponse,
} from '@apps/apis'
import Skeleton from '@/components/Skeleton'
import Router from '@/utils/router'
import { mergeSiteAndShopInfo } from '@/utils/dataMerge'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
const ShopSetting = () => {
  const intl = useIntl()
  const SHOP_TYPE_NAME = {
    [SHOP_TYPE.ENTERPRISE]: intl.formatMessage({
      id: 'shopSetting.enterprise',
      defaultMessage: '企业商城',
    }),
    [SHOP_TYPE.CHANNEL]: intl.formatMessage({
      id: 'shopSetting.channel',
      defaultMessage: '渠道商城',
    }),
    [SHOP_TYPE.CHANNEL_OWNED]: intl.formatMessage({
      id: 'shopSetting.channelOwn',
      defaultMessage: '渠道自有商城',
    }),
  }
  const { safeBottomHeight } = useSafeArea()
  const [loading, setLoading] = useState(false)
  /** 当前商城类型 */
  const [selectedShopType, setSelectShopType] = useState<number>(1)
  // const [channelSelectVisible, setChannelSelectVisible] = useState<boolean>(false)
  const {
    userStore: { setShopAndSite, updateCurrSelfMallInfo, fetchAllMallList },
    templateStore: { getSelfMallDesignConfig, getMallDesignConfig },
  } = useStores()
  /** 切换站点时获取当前站点的商城loading */
  /** 站点及商城信息 */
  const [sitesWithShop, setSitesWithShop] = useState<GetCommodityMobileShopMobileAppShopTypeSelectResponse>([])
  const currentSite = sitesWithShop[0]
  const isDisabled = selectedShopType === 0 || sitesWithShop.length === 0
  useEffect(() => {
    async function getSitesAndShops() {
      try {
        setLoading(true)
        const { data, code } = await getCommodityMobileShopMobileAppShopTypeSelect({
          environment: ENVIRONMENT,
        } as any)
        if (code === 1000 && data?.length > 0) {
          setSitesWithShop(data)
          fetchAllMallList()
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    getSitesAndShops()
  }, [])

  /** 选择商城 */
  const handleShopSelect = (value: GetCommodityMobileShopMobileAppShopTypeSelectResponse[0]['appShopVOS'][0]) => {
    setSelectShopType(value.type!)
  }
  const updateShopAndSite = async (shopData: ShopInfoType) => {
    await setShopAndSite(shopData)
  }

  /** 选择商城 -> 退出登录 */
  const handleSubmit = async () => {
    let defaultShop = currentSite!.shopVOS.find((_item) => _item.isDefault)
    if (!defaultShop) {
      defaultShop = currentSite!.shopVOS[0]
    }
    if (!defaultShop) {
      showToast({
        title: intl.formatMessage({
          id: 'shopSetting.noDefault',
          defaultMessage: '该站点的商城类型没有默认商城',
        }),
        icon: 'none',
      })
      return
    }
    const defaultShopTarget = defaultShop

    /** 如果是自营商城，缓存store, 但这里是临时存储的， 跳转自营商城选择页 */
    if (defaultShopTarget.type === SHOP_TYPE.ENTERPRISE && defaultShopTarget.self) {
      /** 如果只有一个自营商城直接进入 */
      if (defaultShopTarget.selfBusinessShopListRespVOS?.length === 1) {
        await updateShopAndSite(mergeSiteAndShopInfo(defaultShopTarget) as ShopInfoType)
        /** 重置装修内容 */
        await getSelfMallDesignConfig(
          defaultShopTarget.id,
          defaultShopTarget!.selfBusinessShopListRespVOS[0]!.memberId!,
        )
        /** 更新自营商城信息 */
        updateCurrSelfMallInfo(defaultShopTarget.selfBusinessShopListRespVOS[0] as SelfMallInfoType)
        /** 如果已经登录，直接跳到退出登录，没登录的时候直接到首页 */
        Router.reLaunch('extra/mall/own')
        return
      }
      /** 设置缓存站点信息 */
      await updateShopAndSite(mergeSiteAndShopInfo(defaultShopTarget) as ShopInfoType)
      Router.navigateTo('extra/mall/own/select')
      return
    }
    /** 如果企业商城 */
    if (defaultShopTarget.type === SHOP_TYPE.ENTERPRISE) {
      await updateShopAndSite(mergeSiteAndShopInfo(defaultShopTarget) as ShopInfoType)
      /** 清空自营商城信息 */
      updateCurrSelfMallInfo(undefined)
      if (defaultShopTarget.property === SHOP_PROPERTY.BUSINESS) {
        await getMallDesignConfig(defaultShopTarget.id)
        Router.reLaunch('extra/mall/b2b')
      } else if (defaultShopTarget.property === SHOP_PROPERTY.CUSTOMER) {
        Router.reLaunch('extra/mall/client')
      }
      return
    }

    /** 如果是渠道商城，那么无论如何都要登录 */
    if ([SHOP_TYPE.CHANNEL, SHOP_TYPE.CHANNEL_OWNED].includes(defaultShopTarget.type!)) {
      showToast({
        title: intl.formatMessage({
          id: 'shopSetting.noOpen',
          defaultMessage: '渠道商城功能暂未开放',
        }),
        icon: 'none',
      })
    }
  }
  const renderShop = () => {
    if (loading) {
      return (
        <ScrollView
          horizontal
          style={{
            width: '100%',
          }}
        >
          {[1, 2, 3].map((_item) => (
            <Skeleton
              key={_item}
              height={150}
              borderRadius={6}
              style={{
                marginRight: pxTransform(16),
                width: pxTransform(104),
              }}
            />
          ))}
        </ScrollView>
      )
    }
    if (!currentSite) {
      return null
    }
    const shopType =
      currentSite.shopVOS?.filter((_item) =>
        [SHOP_TYPE.ENTERPRISE, SHOP_TYPE.CHANNEL, SHOP_TYPE.CHANNEL_OWNED].includes(_item.type!),
      ) || []
    return (
      <View className={styles['shop-list']}>
        {shopType.map((_item, index) => {
          const isActive = selectedShopType === _item.type
          return (
            index === 0 && (
              <View key={_item.type} className={styles['shop-item']}>
                <View
                  onClick={() => handleShopSelect(_item)}
                  className={classNames(styles.shopContainer, {
                    [styles.active]: isActive,
                  })}
                >
                  <Text className={classNames(styles.shopName)}>
                    {SHOP_TYPE_NAME[_item.type! as keyof typeof SHOP_TYPE_NAME]}
                  </Text>
                </View>
              </View>
            )
          )
        })}
      </View>
    )
  }
  return (
    <View
      className={styles.page}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(16),
      }}
    >
      <NavBar
        title={intl.formatMessage({
          id: 'shopSetting.title',
          defaultMessage: '商城设置',
        })}
      />
      <ScrollView className={styles['scroll-view']}>
        <View className={styles['shop-group']}>{renderShop()}</View>
      </ScrollView>
      <View className={styles['btn-container']}>
        <Button onClick={handleSubmit} className={styles['btn']} disabled={isDisabled}>
          <Text className={styles['text']}>
            {intl.formatMessage({
              id: 'shopSetting.confirmAndGo',
              defaultMessage: '确认并进入',
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(ShopSetting)
