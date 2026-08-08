import React, { useState, useEffect, Fragment } from 'react'
import cx from 'classnames'
import { Text, View, Icons, Checkbox, CountDown } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { fnGetLimtArr, fnGetSkuId } from '@/packages/order/commonlyFn'
import useJmpHome from '@/hooks/useJmpHome'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import { getMarketingMobileCouponListByShop } from '@apps/apis'
import CommodityCardContent from '../commodityCardContent'
import SetMealCommodityCardContent from '../setMealCommodityCardContent'
import ExchangeCommodityCardContent from '../exchangeCommodityCardContent'
import { fnGetActivityTips } from '../../commonlyFn/callBlackTips'
import { fnInitGift } from '../../commonlyFn'
import styles from './index.module.scss'

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  newShopMessage: any
  fnResetShopMessage: Function
  fnShowCoupon: Function
  fnGetShopping: Function
}

const CommodityCard: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { newShopMessage, fnResetShopMessage, fnShowCoupon, fnGetShopping } = props
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [couponList, setCouponList] = useState<any>([])
  const { jmpHome } = useJmpHome()
  const fnJumpOtherUrl = (newActivity: any, thisCommodity: any) => {
    Router.navigateTo('commodityMerge/stocksSourcing/salesCampaignList', {
      activityId: newActivity.activityId,
      belongType: newActivity.belongType,
      skuId: Number(`${thisCommodity.skuId.split('_')[0]}`),
    })
  }
  /**
   * 跳转去换购
   * @param newActivity 当前活动
   * @param thisCommodity 当前商品
   */
  const fnJumpExchangeUrl = (newActivity: any, thisCommodity: any, thisShop: any) => {
    console.log(thisShop, 'thisShop')
    const skuIds: number[] = []
    if (thisShop && thisShop.length > 0) {
      thisShop.map((item: any) => {
        if (!item.isMain) {
          skuIds.push(fnGetSkuId(item.skuId))
        }
      })
    }
    const obj = {
      activityId: newActivity.activityId,
      belongType: newActivity.belongType,
      skuId: Number(`${thisCommodity.skuId.split('_')[0]}`),
      skuIds: skuIds.join(),
    }
    Router.navigateTo('commodityMerge/stocksSourcing/changeProduct', obj)
  }
  /**
   * 全部选择｜取消
   */
  const fnChangeAll = () => {
    console.log('fnChangeAll')
    const newShopMessageDesc = JSON.parse(JSON.stringify(newShopMessage))
    try {
      if (newShopMessageDesc.selectCommodity.length === newShopMessageDesc.allSelectCommodity.length) {
        newShopMessageDesc.selectCommodity = []
      } else {
        newShopMessageDesc.selectCommodity = newShopMessageDesc.allSelectCommodity
      }
      if (fnResetShopMessage) {
        fnResetShopMessage({ ...newShopMessageDesc })
      }
    } catch (error) {}
  }
  /**
   * 子组件回调函数
   * @param newMessageItem 当前商品
   * @param type 修改的属性吗
   * @param index 商品的下标
   */
  const fnResetFatherShopMessage = (newMessageItem: any, type: string, index: number, comType: string) => {
    let newShopMessageDesc = JSON.parse(JSON.stringify(newShopMessage))
    if (type === 'selectCommodity') {
      newShopMessageDesc[type] = newMessageItem
    } else if (type === 'commodity') {
      // 重置整个商品
      const giftList = fnInitGift(newMessageItem)
      newMessageItem.additionalCommodity = []
      newMessageItem.giftList = giftList

      if (comType) {
        newShopMessageDesc.commodityType[comType][index] = newMessageItem
      }
    } else if (type === 'delect') {
      // 删除整个商品
      newShopMessageDesc.commodity.splice(index, 1)
      newShopMessageDesc.commodityType[comType].splice(index, 1)
      if (newShopMessageDesc.commodity.length === 0) {
        newShopMessageDesc = {}
        fnGetShopping()
      }
    } else if (type === 'delectMeal') {
      // 套餐的删除
      fnGetShopping()
      return
    }
    if (fnResetShopMessage) {
      fnResetShopMessage({ ...newShopMessageDesc })
    }
  }
  useEffect(() => {}, [newShopMessage])
  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 满额促销返回dom
   */
  const fnGetFullDom = (thisCommodity: any, newActivity: any, newAddress: string) => {
    return (
      <View className={styles['card-tips-warp']}>
        <View className={styles['box']}>
          <Text className={newAddress === 'top' ? styles['full-minus'] : styles['full-minus-em']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_fullMinus' })}
          </Text>
        </View>
        <View className={cx(styles['discount-content'], styles['ellipsis'])}>
          <Text className={styles['font12']}>
            {newActivity.preferentialTagDescs
              ? newActivity.preferentialTagDescs.map(
                  (item: any, index: number) =>
                    `${item.desc}${index === newActivity.preferentialTagDescs.length - 1 ? '' : '; '}`,
                )
              : fnGetActivityTips(newActivity)}
          </Text>
        </View>
        <View
          className={styles['box']}
          onClick={() => {
            fnJumpOtherUrl(newActivity, thisCommodity)
          }}
        >
          <Text className={styles['color-red']}>
            {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_colorRed' })}
          </Text>
          <Icons name="right" size={16} color="#CCCCCC" />
        </View>
      </View>
    )
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 返回赠品的dom
   */
  const fnGetGiftDom = (newActivity: any, newAddress: string) => {
    const giftList: any[] = []
    if (newActivity.activityType !== 13) {
      // 13是换购的 6是赠品的
      newActivity.preferentialTagDescs?.forEach((item: any) => {
        giftList.push(item)
      })
    }
    let tips = ''
    giftList.forEach((item: any, index: number) => {
      tips = `${tips}${intl.formatMessage({
        id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_4',
      })}${item.limit}${
        newActivity.concreteType === 9 || newActivity.concreteType === 10
          ? intl.formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_1' })
          : intl.formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_2' })
      }${intl.formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_give' })}`
      item.items?.forEach((second: any) => {
        tips = `${tips}${second.desc}X${second.num}${index !== giftList.length ? ',' : ';'}`
      })
    })
    return (
      <View className={styles['card-tips-warp']}>
        <View className={styles['box']}>
          <Text className={newAddress === 'top' ? styles['full-minus'] : styles['full-minus-em']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetGiftDom_fullMinus' })}
          </Text>
          <View className={cx(styles['give-warp'], styles['font12'])}>{tips}</View>
        </View>
      </View>
    )
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 返回换购的dom
   */
  const fnGetExchangeDom = (thisCommodity: any, newActivity: any, newAddress: string, thisShop: any) => {
    const giftList: any[] = []
    newActivity.preferentialTagDescs?.forEach((item: any) => {
      giftList.push(item)
    })
    let arrDesc: any = []
    if (thisCommodity.isMain) {
      const lintMoney = thisCommodity.estimatePrice * thisCommodity.count
      arrDesc = fnGetLimtArr(lintMoney, thisCommodity)
    }
    let tips = ''
    giftList.forEach((item: any, index: number) => {
      item.items?.forEach((second: any) => {
        tips = `${tips}${second.desc}${index !== giftList.length - 1 ? ';' : ''}`
      })
    })
    return (
      <View className={styles['card-tips-warp']}>
        <View className={styles['box']} style={{ flex: 1, width: 0 }}>
          <View className={newAddress === 'top' ? styles['full-minus'] : styles['full-minus-em']}>
            <Text>
              {newActivity.preferentialTag ||
                intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetGiftDom_fullMinus' })}
            </Text>
          </View>
          <View className={styles['discount-main']}>{tips}</View>
        </View>
        <View
          className={styles['box']}
          onClick={() => {
            fnJumpExchangeUrl(newActivity, thisCommodity, thisShop)
          }}
        >
          <Text className={styles['color-red']}>
            {arrDesc.length === 0
              ? intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetGiftDom_colorRed' })
              : intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetGiftDom_colorRed_again' })}
          </Text>
          <Icons name="right" size={16} color="#CCCCCC" />
        </View>
      </View>
    )
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 直降促销
   */
  const fnGetDescentDom = (newActivity: any, newAddress: string, thisCommodity: any) => {
    return (
      <View className={styles['card-tips-warp']}>
        <View className={styles['box']}>
          <Text className={newAddress === 'top' ? styles['full-minus'] : styles['full-minus-em']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetDescentDom_fullMinus' })}
          </Text>
        </View>
        <View className={styles['discount-content']}>
          {newActivity.preferentialTagDescs?.map((tips: string, index: number) => {
            return (
              <Text className={styles['font12']} key={`${index}_tips`}>
                {tips}
              </Text>
            )
          })}
        </View>
        {newActivity.activityType === 8 && (
          <View
            className={styles['box']}
            onClick={() => {
              fnJumpOtherUrl(newActivity, thisCommodity)
            }}
          >
            <Text className={styles['color-red']}>
              {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetDescentDom_colorRed' })}
            </Text>
            <Icons name="right" size={16} color="#CCCCCC" />
          </View>
        )}
      </View>
    )
  }
  /**
   * 获取即时秒杀dom
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 直降促销
   */

  const fnGetSeckillDom = (newActivity: any, newAddress: string, thisCommodity: any) => {
    return (
      <View className={styles['card-tips-warp']}>
        <View className={styles['box']}>
          <Text className={newAddress === 'top' ? styles['full-minus'] : styles['full-minus-em']}>
            {newActivity.preferentialTag || '标签不在'}
          </Text>
        </View>
        <View className={styles['countDown-warp']}>
          {newActivity.specialMap.countdown > 0 ? (
            <CountDown count={newActivity.specialMap.countdown} format="HH:mm:ss">
              {(_, formatTime) => {
                const { formatTimeString } = formatTime
                const [hour, minute, second] = formatTimeString.split(':')
                return (
                  <View className={styles['seckillWrap-end']}>
                    <Text className={styles['seckillWrap-end-title']}>
                      {intl.formatMessage({
                        id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_surplus',
                      })}
                      :
                    </Text>
                    <View className={styles['seckillWrap-end-tofu']}>
                      <Text className={styles['seckillWrap-end-tofu-text']}>{hour}</Text>
                    </View>
                    <Text className={styles['seckillWrap-end-splitCode']}>:</Text>
                    <View className={styles['seckillWrap-end-tofu']}>
                      <Text className={styles['seckillWrap-end-tofu-text']}>{minute}</Text>
                    </View>
                    <Text className={styles['seckillWrap-end-splitCode']}>:</Text>
                    <View className={styles['seckillWrap-end-tofu']}>
                      <Text className={styles['seckillWrap-end-tofu-text']}>{second}</Text>
                    </View>
                  </View>
                )
              }}
            </CountDown>
          ) : (
            <View>{newActivity.preferentialTagDescs[0]}</View>
          )}
        </View>
      </View>
    )
  }

  /**
   * @param newCommodity 当前的商品
   * @param newActivity 当前活动
   * @param newAddress 在顶部活动还是底部活动
   * @returns 返回活动提示语
   */
  const fnGetDom = (newCommodity: any, newActivity: any, newAddress: string, thisShop?: any) => {
    if (!thisShop) {
      thisShop = newShopMessage
    }
    if (!newActivity || !newActivity.activityId) {
      return <View />
    }
    // 满额促销 满量促销
    if (newActivity.activityType === 4 || newActivity.activityType === 5) {
      return fnGetFullDom(newCommodity, newActivity, newAddress)
    }
    // 赠送促销
    if (newActivity.activityType === 6) {
      return fnGetGiftDom(newActivity, newAddress)
    }
    // 换购
    if (newActivity.activityType === 13) {
      return fnGetExchangeDom(newCommodity, newActivity, newAddress, thisShop)
    }
    // 满额促销 满量促销
    if (newActivity.activityType === 7) {
      return fnGetFullDom(newCommodity, newActivity, newAddress)
    }
    // @returns 直降促销
    if (
      newActivity.activityType === 1 ||
      newActivity.activityType === 2 ||
      newActivity.activityType === 3 ||
      newActivity.activityType === 8
    ) {
      return fnGetDescentDom(newActivity, newAddress, newCommodity)
    }
    // @returns 秒杀促销
    if (newActivity.activityType === 12) {
      return fnGetSeckillDom(newActivity, newAddress, newCommodity)
    }
    // @returns 套餐活动
    if (newActivity.activityType === 15) {
      return fnGetDescentDom(newActivity, newAddress, newCommodity)
    }
    return <View />
  }
  /**
   * @returns 返回商城名称
   */
  const fnGetStoreName = () => {
    if (shopAndSite?.isSelf) {
      return shopAndSite.name
    }
    return newShopMessage?.storeName || newShopMessage?.memberName
  }
  /**
   * 获取优惠券列表
   */
  const fnetCouponList = () => {
    const parmas = {
      shopId: `${shopAndSite?.id}`,
      memberId: newShopMessage.memberId,
      roleId: newShopMessage.memberRoleId,
    }
    getMarketingMobileCouponListByShop(parmas).then((res) => {
      if (res.code === 1000) {
        setCouponList(res.data)
      }
    })
  }
  /**
   * 跳转页面
   */
  const fnJumpUrl = (id: number) => {
    if (shopAndSite?.isSelf) {
      jmpHome()
    } else {
      Router.navigateTo('shop/home', { id })
    }
  }

  /**
   * @param orderAmount 当前供应商包邮的金额
   * @param allPay 当前供应商不包邮商品总金额
   * @param shouString 是否需要保留两小书
   * @returns
   */
  const fnGetDisparity = (orderAmount: number, allPay: number, shouString: boolean) => {
    const callBlackNumber = orderAmount - allPay
    if (!shouString) {
      return callBlackNumber
    }
    return callBlackNumber.toFixed(2)
  }

  const fnShouldShowFerr = () => {
    if (!newShopMessage.orderAmount) {
      return false
    }
    return newShopMessage.commodity.some((item) => item?.logistics?.carriageType === 2)
  }

  /**
   * 跳转别的页面
   */
  const handleJump = (thisShop?: any) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { storeId: thisShop.storeId, carriageType: 2 })
  }

  useEffect(() => {
    fnetCouponList()
  }, [])
  return (
    <View className={styles['card-warp']}>
      <View className={styles['shop-card-title']}>
        <View className={styles['shop-box']}>
          <View onClick={fnChangeAll}>
            <Checkbox.Group
              value={
                newShopMessage?.allSelectCommodity.length === newShopMessage?.selectCommodity.length &&
                newShopMessage?.selectCommodity.length !== 0
                  ? [1]
                  : []
              }
            >
              <Checkbox value={1} />
            </Checkbox.Group>
          </View>
          <View
            className={styles['shop-box']}
            style={{ marginLeft: pxTransform(15) }}
            onClick={() => {
              fnJumpUrl(newShopMessage.storeId)
            }}
          >
            <View className={styles['logo-warp']}>
              {!shopAndSite?.isSelf && newShopMessage.storeLogo ? (
                <ImageBox source={newShopMessage?.storeLogo} width={16} height={16} />
              ) : (
                <ImageBox source={shopAndSite?.logoUrl || ''} width={16} height={16} />
              )}
            </View>
            <View className={styles['store-name']} style={{ marginLeft: pxTransform(5), fontSize: pxTransform(14) }}>
              {fnGetStoreName()}
            </View>
          </View>
        </View>
        <View
          onClick={() => {
            fnShowCoupon(newShopMessage, couponList)
          }}
        >
          <Text className={styles['color-red']}>
            {intl.formatMessage({ id: 'purchase_components_commodityCard_colorRed' })}
          </Text>
        </View>
      </View>
      {fnShouldShowFerr() && (
        <View className={styles['free-shipping']}>
          <Text className={styles['full-minus-em']}>
            {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_Fullfree' })}
          </Text>
          {fnGetDisparity(newShopMessage.orderAmount, newShopMessage.allPay, false) > 0 ? (
            <View className={styles['full-minus-warp']}>
              <Text className={styles['full-minus-tips']}>
                {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_Fulldisparity' })}
                {` :${intl.formatMessage({ id: 'currency' })}`}
                {fnGetDisparity(newShopMessage.orderAmount, newShopMessage.allPay, true)}
                {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_free' })}
              </Text>
              <Text
                className={styles['full-minus-right']}
                onClick={() => {
                  handleJump(newShopMessage)
                }}
              >
                {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_colorRed' })}
              </Text>
            </View>
          ) : (
            <Text className={styles['full-minus-tips']}>
              {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_Fullalread' })}
              {` :${intl.formatMessage({ id: 'currency' })}`}
              {newShopMessage.orderAmount}，
              {intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetFullDom_freefreight' })}
            </Text>
          )}
        </View>
      )}

      {Object.keys(newShopMessage.commodityType).map((key: any) => (
        <Fragment key={key}>
          {key.indexOf('_2_') > -1 && ( // 套餐的
            <View className={styles['commodity-card-content-warp']} key={key}>
              {fnGetDom(
                newShopMessage.commodityType[key][0],
                newShopMessage.commodityType[key][0].topActivityDetail,
                'top',
              )}
              <SetMealCommodityCardContent
                commdityType={key}
                thisCommodity={newShopMessage.commodityType[key]}
                newShopMessage={newShopMessage}
                selectCommodity={newShopMessage.selectCommodity}
                allSelectCommodity={newShopMessage.allSelectCommodity}
                fnGraShopMessage={(res: any, type: string) => {
                  fnResetFatherShopMessage(res, type, 0, key)
                }}
              />
              {newShopMessage.commodityType[key][0].activityDetails &&
                newShopMessage.commodityType[key][0].activityDetails.map((item: any) =>
                  fnGetDom(newShopMessage.commodityType[key][0], item, 'footer'),
                )}
            </View>
          )}
          {key.indexOf('_4_') > -1 && ( // 换购的
            <View className={styles['commodity-card-content-warp']} key={key}>
              {fnGetDom(
                newShopMessage.commodityType[key][0],
                newShopMessage.commodityType[key][0].topActivityDetail,
                'top',
                newShopMessage.commodityType[key],
              )}
              <ExchangeCommodityCardContent
                commdityType={key}
                thisCommodity={newShopMessage.commodityType[key]}
                newShopMessage={newShopMessage}
                selectCommodity={newShopMessage.selectCommodity}
                allSelectCommodity={newShopMessage.allSelectCommodity}
                fnGraShopMessage={(res: any, type: string, index: number) => {
                  fnResetFatherShopMessage(res, type, index, key)
                }}
              />
              {newShopMessage.commodityType[key][0].activityDetails &&
                newShopMessage.commodityType[key][0].activityDetails.map((item: any) =>
                  fnGetDom(newShopMessage.commodityType[key][0], item, 'footer', newShopMessage.commodityType[key]),
                )}
            </View>
          )}
          {key.indexOf('_2_') === -1 &&
            key.indexOf('_4_') === -1 && // 不是套餐的 不是换购
            newShopMessage.commodityType[key].map((thisCommodity: any, index: number) => {
              return (
                <View className={styles['commodity-card-content-warp']} key={`${thisCommodity.id}-${index}`}>
                  {fnGetDom(thisCommodity, thisCommodity.topActivityDetail, 'top')}
                  <CommodityCardContent
                    commdityType={key}
                    thisCommodity={thisCommodity}
                    newShopMessage={newShopMessage}
                    selectCommodity={newShopMessage.selectCommodity}
                    allSelectCommodity={newShopMessage.allSelectCommodity}
                    fnGraShopMessage={(res: any, type: string) => {
                      fnResetFatherShopMessage(res, type, index, key)
                    }}
                  />
                  {thisCommodity.activityDetails.map((item: any) => fnGetDom(thisCommodity, item, 'footer'))}
                </View>
              )
            })}
        </Fragment>
      ))}
    </View>
  )
}

export default observer(CommodityCard)
