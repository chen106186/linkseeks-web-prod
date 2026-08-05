import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { View, Text, ScrollView, Toast } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { getCurrentInstance, useDidShow, hideLoading } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import { getProductMobileShopPurchaseGetPurchaseList } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import { usePageInit } from '@/hooks/usePageInit'
import MallTabBottom from '@/components/MallTabBottom'
import CommodityCard from './components/commodityCard'
import ButtonAccount from './components/buttonAccount'
import CouponLayer from './components/couponLayer'
import { fnGetAllType, fnGetEstimate, fnGetShopMessage } from './commonlyFn'
import { fnGetLimtArr, fnGetSkuId } from '../../commonlyFn'
import styles from './index.module.scss'
const empty = getOssUrlPath('/miniprogram/assets/images/empty.png')
import Taro from '@tarojs/taro'

interface Iprops {}
const PurchaseOrder: React.FC<Iprops> = () => {
  const intl = useIntl()
  const [mode, setMode] = useState<'balance' | 'collect'>('balance')
  const [loaded, setLoaded] = useState<boolean>(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const {
    purchaseOrderStore: { isExpandedAll, setIsExpandedAll, setShopMessageStore },
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const $router = getCurrentInstance()
  const { hasTab, routerShopId, routerSkuId, layoutType } = $router.router?.params || {}
  const [shopList, setShopList] = useState<any>([])
  const [shopMessage, setShopMessage] = useState<any>({})
  const [shopMessageOther, setShopMessageOther] = useState<any>({})
  const [newShop, setNewShop] = useState<any>({})
  const [seclctCouponList, setSeclctCouponList] = useState<any>([])
  usePageInit()
  const toggleFold = () => {
    setIsExpandedAll(!isExpandedAll)
  }

  /**
   * 修改折叠
   */
  const clickEdit = () => {
    setMode(mode === 'balance' ? 'collect' : 'balance')
  }
  /**
   * 修改蒙版的显示与否
   */
  const fnFullScreenLoading = (type: string) => {
    if (type === 'show') {
      Toast.show({
        title: '',
        icon: 'loading',
        mask: true,
      })
    } else {
      Toast.hide({})
      hideLoading()
    }
  }

  /**
   * 优惠卷的选择
   * @param newShopDesc 当前选中商店
   */
  const fnShowCoupon = (newShopDesc: any, selectCouPonListDesc: any) => {
    setNewShop(newShopDesc)
    setSeclctCouponList(selectCouPonListDesc)
    setShowCoupon(true)
  }

  /**
   * 加入购物车的换购商品重置选中方法
   */
  const fnInitSelectCom = (shopMessageDesc: any) => {
    const keyName = `shopId_${routerShopId}`
    const routerSkuIdDesc = routerSkuId?.split('_')
    const newShopDesc = shopMessageDesc[keyName]
    routerSkuIdDesc?.forEach((selectSkuId: string) => {
      newShopDesc &&
        newShopDesc.commodity?.forEach((item: any) => {
          const keySelect = `${selectSkuId}_${item.id}`
          if (newShopDesc.allSelectCommodity.indexOf(keySelect) > -1) {
            newShopDesc.selectCommodity.push(keySelect)
          }
        })
    })
    return shopMessageDesc
  }

  /**
   * 获取购物车
   */
  const fnGetShopping = async () => {
    // 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城
    const shopType = 1
    const headerConfig: {
      headers?: {
        [key: string]: any
      }
    } = {}
    headerConfig.headers = {
      type: shopType,
    }
    let postData: {
      channelMemberId?: string
    } = {}
    setLoaded(true)
    const { code, data } = await getProductMobileShopPurchaseGetPurchaseList(postData as any, headerConfig)
    if (code === 1000 && data && data.length > 0) {
      const sortList = data.sort((a) => (a.isMain ? -1 : 1))
      let shopMessageDesc = fnGetShopMessage(sortList)
      const shopListDesc = Object.keys(shopMessageDesc)
      if (routerSkuId && routerShopId) {
        shopMessageDesc = fnInitSelectCom(shopMessageDesc)
      }
      setShopMessage(shopMessageDesc)
      setShopList(shopListDesc)
    } else {
      setShopMessage({})
      setShopList([])
    }
    setLoaded(false)
  }

  /**
   * 重置初始数据
   */
  const fnResetShopMessage = (shopMessageItem: any, key: string) => {
    if (!shopMessageItem.memberRoleId) {
      delete shopMessage[key]
    } else {
      shopMessage[key] = shopMessageItem
    }
    fnFullScreenLoading('show')
    fnGetEstimate(shopMessage, shopAndSite?.id).then((shopMessageDesc) => {
      setShopMessage({
        ...shopMessageDesc,
      })
    })
  }

  // 选择全部
  const fnALlselect = async (shopMessageDesc: any) => {
    fnGetEstimate(shopMessageDesc, shopAndSite?.id).then((shopMessageDescNew) => {
      setShopMessage({
        ...shopMessageDescNew,
      })
    })
  }
  useDidShow(() => {
    if (userInfo) {
      fnGetShopping()
    }
  })
  /**
   * 跳转别的页面
   */
  const handleJump = (thisShop?: any) => {
    if (!userInfo) {
      Router.navigateTo('user/login')
      return
    }
    Router.navigateTo('commodityMerge/stocksSourcing/index')
  }
  /**
   * 重置储存在mobox的商品信息
   */
  const fnResetShopStore = () => {
    const shopStoreMessage: any = {}
    let arrDesc: any = []
    Object.keys(shopMessage).forEach((key: string) => {
      shopStoreMessage[key] = []
      let limitMoney = 0
      Object.keys(shopMessage[key].commodityType).forEach((keyTwo: any) => {
        shopMessage[key].commodityType[keyTwo].forEach((thisCommodity) => {
          if (
            thisCommodity.purchaseCommodityType === 4 &&
            (shopMessage[key].selectCommodity.indexOf(thisCommodity.skuId) > -1 ||
              shopMessage[key].selectCommodity.indexOf(thisCommodity.parentSkuId) > -1)
          ) {
            // 换购商品
            if (thisCommodity.isMain) {
              // 换购商品的主商品
              limitMoney = thisCommodity.estimatePrice * thisCommodity.count
              shopStoreMessage[key].push(thisCommodity)
              arrDesc = fnGetLimtArr(limitMoney, thisCommodity)
            } else if (arrDesc.indexOf(fnGetSkuId(thisCommodity.skuId)) > -1) {
              // 换购商品
              shopStoreMessage[key].push(thisCommodity)
            }
          } else if (
            (shopMessage[key].selectCommodity.indexOf(thisCommodity.skuId) > -1 ||
              shopMessage[key].selectCommodity.indexOf(thisCommodity.parentSkuId) > -1) &&
            thisCommodity.purchaseCommodityType !== 4
          ) {
            shopStoreMessage[key].push(thisCommodity)
          }
        })
      })
    })
    console.log('shopStoreMessage', shopStoreMessage)
    setShopMessageStore(shopStoreMessage)
  }

  /**
   * 内容的dom
   */
  const renderList = () => (
    <>
      <View className={styles['list']}>
        {shopList.length !== 0 &&
          shopList.map((key: string, index: number) => {
            if (!shopMessage[key]) {
              return <View />
            }
            return (
              <View key={`commoditycard_${index}`}>
                <CommodityCard
                  fnGetShopping={fnGetShopping}
                  newShopMessage={shopMessage[key]}
                  fnShowCoupon={fnShowCoupon}
                  fnResetShopMessage={(res: any) => {
                    fnResetShopMessage(res, key)
                  }}
                />
              </View>
            )
          })}
      </View>
    </>
  )
  /**
   *  内容为空的时候
   */
  const renderEmpty = () => (
    <View className={cx(styles['empty'], styles['section'])}>
      <ImageBox source={empty} width={160} height={120} />
      <Text className={styles['empty-text']}>
        {!userInfo
          ? intl.formatMessage({
              id: 'purchase_renderEmpty_emptyText_1',
            })
          : intl.formatMessage({
              id: 'purchase_renderEmpty_emptyText_2',
            })}
      </Text>
      <View className={styles['btn']} onClick={handleJump}>
        <Text className={styles['btn-text']}>
          {!userInfo
            ? intl.formatMessage({
                id: 'purchase_renderEmpty_btnText_1',
              })
            : intl.formatMessage({
                id: 'purchase_renderEmpty_btnText_2',
              })}
        </Text>
      </View>
    </View>
  )
  /**
   * 上啦刷新
   */
  const onRefresh = () => {
    fnGetShopping()
  }

  /**
   * 构建内容模块dom
   */
  const renderChild = () => (
    <View
      style={{
        flex: 1,
        height: 0,
      }}
    >
      <ScrollView
        className={styles['scroll-view']}
        refreshing={loaded}
        scrollY
        upperThreshold={0}
        scrollAnchoring
        refresherBackground="transparent"
        onRefresh={() => {
          onRefresh()
        }}
      >
        {userInfo && shopList.length > 0 ? renderList() : !loaded ? renderEmpty() : undefined}
      </ScrollView>
    </View>
  )
  useEffect(() => {
    const messageOther = fnGetAllType(shopMessage)
    setShopMessageOther({
      ...messageOther,
    })
    fnResetShopStore()
    setTimeout(() => {
      fnFullScreenLoading('hidden')
    }, 1500)
    // 隐藏首页按钮
    Taro.hideHomeButton()
  }, [shopMessage])
  return (
    <MallTabBottom layoutType={layoutType as LAYOUT_TYPE} visible={hasTab === 'true'} activeUrl="order/Purchase">
      <View className={styles['page']}>
        {userInfo && (
          <View className={styles['title-warp']}>
            {/* {shopAndSite?.property === SHOP_PROPERTY.BUSINESS ? (
              <View className={styles['title-left']}>
                {intl.formatMessage({
                  id: 'purchase_titleLeft',
                  defaultMessage: '购物车',
                })}
              </View>
            ) : (
              <View className={styles['title-left']}>
                {intl.formatMessage({
                  id: 'purchase_titleLeft_cart',
                  defaultMessage: '购物车',
                })}
              </View>
            )} */}

            {shopMessageOther.allNumber > 0 && (
              <View className={styles['title-btn']}>
                {/* <Text className={styles['header-right-text']} onClick={toggleFold}>
                  {isExpandedAll
                    ? intl.formatMessage({
                        id: 'purchase_isExpandedAll_1',
                      })
                    : intl.formatMessage({
                        id: 'purchase_isExpandedAll_2',
                      })}
                </Text> */}
                <Text className={cx(styles['header-right-text'], styles['margin-left'])} onClick={clickEdit}>
                  {mode === 'balance'
                    ? intl.formatMessage({
                        id: 'purchase_mode_1',
                      })
                    : intl.formatMessage({
                        id: 'purchase_mode_2',
                      })}
                </Text>
              </View>
            )}
          </View>
        )}
        {renderChild()}
        {userInfo && shopList.length > 0 && (
          <ButtonAccount
            mode={mode}
            shopMessage={shopMessage}
            shopMessageOther={shopMessageOther}
            resetParShopMessage={fnALlselect}
            shopAndSite={shopAndSite}
            fnResetShopMessage={fnGetShopping}
            fnFullScreenLoading={fnFullScreenLoading}
            clickEdit={clickEdit}
          />
        )}
        <CouponLayer
          shopId={shopAndSite?.id!}
          newShop={newShop}
          seclctCouponList={seclctCouponList}
          showCoupon={showCoupon}
          fnClose={() => {
            setShowCoupon(false)
          }}
          fnFullScreenLoading={fnFullScreenLoading}
        />
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(observer(PurchaseOrder))
