import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import { RowCommodity } from '@/components/Commodity'
import { useRouter, useShareAppMessage } from '@apps/mobile-services/utils/taro'
import PageLayout from '@/components/PageLayout'
import Router from '@/utils/router'
import useJmpHome from '@/hooks/useJmpHome'
import { useIntl } from '@linkseeks/i18n'
import NavBar from '@/components/NavBar'
import useStores from '@/store/useStores'
import { ENVIRONMENT } from '@/constants'
import useProductDetailJump from '@/hooks/useProductDetailJump'
// import { getCommodityMobileShopMobileAppShopTypeSelect } from '@apps/apis'
import styles from './index.module.scss'
import ActionStatus from './components/ActionStatus'
import InTeamPeople from './components/InTeamPeople'
import useGetProductData from './hooks/useGetProductData'
import useGetData from './hooks/useGetData'
import useGetMarketingCampaign from './hooks/useGetMarketingData'
type UrlType = {
  /** 拼团id */
  commodityId: string
  shopId: string
  shopType: string
  teamId: string
  isSelf: string
  shopProperty: string
  skuId?: string
}

/** 拼团详情 */
const ShareGroupDetail = () => {
  const router = useRouter<UrlType>()
  const { jmpHome } = useJmpHome()
  const { jmpProductDetailGroup } = useProductDetailJump()
  const {
    params: { commodityId, shopType, teamId, shopId, shopProperty, isSelf, skuId },
  } = router
  const { productInfo } = useGetProductData({
    shopType: +shopType,
    commodityId: +commodityId,
  })
  const { info } = useGetData({
    id: +teamId,
  })
  const { groupPurchasingData, marketingData } = useGetMarketingCampaign({
    shopId: +shopId,
    productInfo: productInfo,
    skuId: skuId ? +skuId : undefined,
  })
  const { userStore } = useStores()
  const intl = useIntl()
  const currentStatus = useMemo(() => {
    if (!info) {
      return 'processing' as 'processing'
    }
    const list = ['', 'processing', 'success', 'fail']
    return list[info.status] as 'processing' | 'success' | 'fail'
  }, [info])

  // const fnInitShopDate = (shopMessageDesc: any, callDesc: any, self: number) => {
  //   if (self === 1) {
  //     userStore.updateCurrSelfMallInfo(callDesc)
  //   }

  //   const obj: any = {
  //     id: callDesc.id,
  //     shopId: Number(shopId),
  //     shopName: callDesc.name,
  //     shopLogo: callDesc.logoUrl,
  //     self,
  //     isMemberOperate: shopMessageDesc.isMemberOperate,
  //     property: callDesc.property,
  //     shopType: shopMessageDesc.type,
  //     shopRuleDetailId: callDesc.shopRuleDetailId,
  //   }
  //   return obj
  // }

  /**
   * 根据shopId重置商城信息
   */
  // const fnResetShopMessage = async () => {
  //   const res = await getCommodityMobileShopMobileAppShopTypeSelect({ environment: ENVIRONMENT })
  //   const shopMessage = res.data[0].appShopVOS[0].shopVOS[0]
  //   if (shopMessage.self !== 1) {
  //     const obj = fnInitShopDate(shopMessage, shopMessage, 0)
  //     userStore.setShopAndSite(obj)
  //   } else if (shopMessage.selfBusinessShopListRespVOS) {
  //     let callShopMessage: any = {}
  //     shopMessage.selfBusinessShopListRespVOS.map((item) => {
  //       if (item.shopRuleDetailId === Number(shopId)) {
  //         callShopMessage = item
  //       }
  //     })
  //     const obj = fnInitShopDate(shopMessage, callShopMessage, 1)
  //     userStore.setShopAndSite(obj)
  //   }
  // }
  // useEffect(() => {
  //   fnResetShopMessage()
  // }, [])

  const handleJoinTeam = () => {
    jmpProductDetailGroup({
      commodityId: commodityId,
      h5ShopId: shopId,
      h5TeamId: teamId,
      isJoin: true,
      skuId: skuId || marketingData?.preferentialSkuId,
    })
  }
  const handleRelanch = () => {
    jmpProductDetailGroup({
      commodityId: commodityId,
      skuId: skuId || marketingData?.preferentialSkuId,
      h5ShopId: shopId,
    })
  }
  useShareAppMessage(
    (res: {
      from: 'button'
      target: {
        dataset: {
          teamId: number
        }
      }
    }) => {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        return {
          title: `原价：${productInfo?.max} ${info?.assembleNum}人团 只需${groupPurchasingData?.groupPurchasingPrice}元`,
          path: `/packages/commodityMerge/pages/stocksSourcing/shareGroupDetail/index?teamId=${teamId}&shopId=${shopId}&shopType=${shopType}&commodityId=${commodityId}&shopProperty=${shopProperty}&isSelf=${isSelf}&skuId=${skuId}`,
          imageUrl: `${productInfo?.mainPic}`,
        }
      }
      return {}
    },
  )
  const handleViewOrder = () => {}
  const handleJumpHome = () => {
    jmpHome()
  }
  return (
    <PageLayout
      className={styles['pageLayout']}
      renderHeader={
        <NavBar
          customRenderLeft={<Icons name="ChevronLeft" onClick={handleJumpHome} />}
          customClassName={classNames(styles.navBar, styles[`${currentStatus}NavBar`])}
          title={
            <Text className={styles['navBar-title']}>
              {intl.formatMessage({
                id: 'shareGroupDetail.title',
                defaultMessage: '拼团详情',
              })}
            </Text>
          }
        />
      }
    >
      <View className={classNames(styles.tips, styles[`${currentStatus}-tips`])}>
        <ActionStatus mode={currentStatus} />
      </View>
      <View className={styles.product}>
        {productInfo && (
          <RowCommodity
            productId={productInfo?.id}
            productName={productInfo.name}
            productImg={productInfo.mainPic}
            originalPrice={productInfo?.max}
            discount={groupPurchasingData?.groupPurchasingPrice!}
            showBtn={false}
            // onClickCommodity={handleRelanch}
            renderMiddleArea={<View className={styles.slogan}>{productInfo.slogan}</View>}
          />
        )}
      </View>
      {info && (
        <View className={styles.inTeamPeople}>
          <InTeamPeople
            isJoin={info.isJoin}
            endTime={info.endTime}
            status={info.status as 1 | 2 | 3}
            assembleNum={info.assembleNum}
            itemList={info.itemList}
            onJoinTeam={handleJoinTeam}
            onRelaunch={handleRelanch}
            onViewOrder={handleViewOrder}
            onJumpHome={handleJumpHome}
          />
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(ShareGroupDetail)
