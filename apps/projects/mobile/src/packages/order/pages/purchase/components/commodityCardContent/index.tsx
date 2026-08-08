import React, { useEffect, useState, useLayoutEffect } from 'react'
import { createSelectorQuery, pxTransform } from '@apps/mobile-services/utils/taro'
import cx from 'classnames'
import { View, Icons, Text, Toast, Image, SwipeAction, Checkbox, Input } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { SHOP_TYPE } from '@/constants/const/shop'
import ImageBox from '@/components/ImageBox'
import Stepper from '@/components/Stepper'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import {
  postProductMobileShopCommodityCollectSaveCommodityCollect,
  postProductMobileShopPurchaseDeletePurchase,
} from '@apps/apis'
import SpecificationList from '../SpecificationList'
import { fnChangeCountCom, fnGetPriceAndAction, fnKeepTwo } from '../../commonlyFn'
import styles from './index.module.scss'
/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  thisCommodity: any
  selectCommodity: Array<any>[]
  allSelectCommodity: Array<any>[]
  fnGraShopMessage: Function
  commdityType: string
  newShopMessage?: any
}

const CommodityCardContent: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const { thisCommodity, selectCommodity, allSelectCommodity, fnGraShopMessage, commdityType, newShopMessage } = props
  const [newThisCommodity, setNewThisCommodity] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [stepperKey, setStepperKey] = useState(1)
  const [swiperWidth, setSwiperWidth] = useState(200)
  const {
    purchaseOrderStore: { isExpandedAll },
    userStore: { shopAndSite },
  } = useStores()
  /**
   * @param skuList
   * 获取sku属性
   */
  const fnGetSku = (skuList: any) => {
    try {
      if (!skuList || skuList.length === 0) {
        return ''
      }
      const str = skuList.map((item: any) => `${item.name}:${item.value}`)
      return str.join(',')
    } catch (error) {
      return intl.formatMessage({ id: 'purchase_components_commodityCardContent_fnGetSku' })
    }
  }
  /**
   *  选择当前商品
   *  thisId 当前商品的skuid
   */
  const selectThisCom = (thisId: any) => {
    // const thisCommodityDesc = JSON.parse(JSON.stringify(thisCommodity));
    // 判断是否已经过期或者下架
    let maxNumber = 0 // 最大购买的数量
    let newNumber = 0 // 当前购买的数量
    if (!allSelectCommodity || allSelectCommodity.indexOf(thisId) === -1) {
      return
    }
    const selectCommodityDesc = JSON.parse(JSON.stringify(selectCommodity))
    const selectIndex = selectCommodity.indexOf(thisId)
    if (selectIndex > -1) {
      selectCommodityDesc.splice(selectIndex, 1)
    } else {
      if (newNumber + newThisCommodity.count > maxNumber && maxNumber > 0) {
        Toast.show({
          title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_1', data: maxNumber }),
          icon: 'none',
        })
        return
      } else {
        selectCommodityDesc.push(thisId)
      }
    }
    fnGraShopMessage(selectCommodityDesc, 'selectCommodity')
  }
  /**
   *
   */
  const fnChangeCount = async (commodity: any) => {
    fnChangeCountCom(shopAndSite, commodity)
  }
  /**
   * 修改商品数量
   * @param newCount 当前商品数量
   */
  const handleAddCount = (newCount: any) => {
    if (`${newCount}` === 'NaN') {
      newCount = 0
    }
    if (newThisCommodity.topActivityDetail.activityType === 8) {
      // 组合活动, 输入得时整数
      newCount = Math.ceil(newCount)
    }
    if (newCount === 0 && newThisCommodity.minOrder !== 0) {
      Toast.show({
        title: intl.formatMessage({
          id: 'purchase_components_commodityCardContent_show_2',
          data: newThisCommodity.minOrder,
        }),
        icon: 'loading',
      })
      newThisCommodity.count = newThisCommodity.minOrder
      setStepperKey(stepperKey + 1)
    } else if (newCount > newThisCommodity.limitCount) {
      Toast.show({
        title: intl.formatMessage({
          id: 'purchase_components_commodityCardContent_show_3',
          data: newThisCommodity.limitCount,
        }),
        icon: 'loading',
      })
      newThisCommodity.count = newThisCommodity.limitCount
      setStepperKey(stepperKey + 1)
    } else {
      const obj = fnGetPriceAndAction(newThisCommodity.unitPrice, newCount)
      newThisCommodity.count = Number(newCount)
      newThisCommodity.newPrice = obj.newPrice
      newThisCommodity.newAction = obj.newAction
    }
    fnGraShopMessage(newThisCommodity, 'commodity')
    fnChangeCount({ ...newThisCommodity })
  }

  /**
   * 收藏商品
   */
  const handleCollection = async () => {
    if (loading) {
      Toast.show({
        title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_4' }),
        icon: 'loading',
      })
      return
    }
    setLoading(true)

    let data: any = {
      commodityId: newThisCommodity.commodityId,
    }

    const { code, message } = await postProductMobileShopCommodityCollectSaveCommodityCollect(data, {
      headers: { type: 1 },
    })
    setLoading(false)
    if (code === 1000) {
      Toast.show({
        title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_5' }),
        icon: 'success',
      })
    } else {
      Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
    }
  }
  /**
   * 删除商品
   */
  const handleRemove = () => {
    if (loading) {
      Toast.show({
        title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_6' }),
        icon: 'success',
      })
      return
    }
    setLoading(true)
    // 企业商城 === 1， 渠道商城，渠道自有商城 == 3 / 4 , 积分商城是没有购物车的所以不用考虑
    /**
     * 如果删除商品
     * 1. 连同商品属性一起删除
     * 2. 判断当前商品中的店铺只有一间，那店铺也要删除
     */
    postProductMobileShopPurchaseDeletePurchase({
      idList: [newThisCommodity.id],
    })
      .then(({ code, message }) => {
        if (code === 1000) {
          // fetchPurchaselise();
          setLoading(false)
          Toast.show({ title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_7' }) })
          fnGraShopMessage(newThisCommodity, 'delect')
        } else {
          Toast.show({ title: intl.formatMessage({ id: `${code}`, defaultMessage: message }) })
        }
        // fnGraShopMessage(newThisCommodity, 'delect');
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 跳转商品详情
   */
  const fnJumpUrl = () => {
    jmpProductDetail(newThisCommodity.priceType, { commodityId: newThisCommodity.commodityId })
  }

  /**
   * 收藏/删除
   */
  const fnConfig = (index: any) => {
    if (index === 1) {
      handleRemove()
    } else {
      handleCollection()
    }
  }
  /**
   * 修改梯度价格是否显示
   */
  const [ladderVisible, setLadderVisible] = useState(false)
  useEffect(() => {
    setNewThisCommodity({ ...thisCommodity })
  }, [thisCommodity])

  useEffect(() => {
    setLadderVisible(isExpandedAll)
  }, [isExpandedAll])

  useLayoutEffect(() => {
    createSelectorQuery()
      .select(`.collection-warp`)
      .boundingClientRect((rect: any) => {
        if (rect) {
          createSelectorQuery()
            .select(`.slip-box-text`)
            .boundingClientRect((rects: any) => {
              if (rects) {
                setSwiperWidth(rect.width + rects.width + 20)
              }
            })
            .exec()
        }
      })
      .exec()
  })

  return (
    <>
      <SwipeAction
        key={`swiperWidth${swiperWidth}`}
        maxDistance={swiperWidth}
        options={[
          {
            text: intl.formatMessage({ id: 'purchase_components_commodityCardContent_swipeAction_options_1' }),
            className: styles['collection-warp'],
          },
          {
            text: intl.formatMessage({ id: 'purchase_components_commodityCardContent_swipeAction_options_2' }),
            className: styles['slip-box-text'],
          },
        ]}
        onClick={(_, index) => fnConfig(index)}
      >
        <View className={styles['contetnt-warp']}>
          <View className={styles['content-warp']}>
            <View>
              <Checkbox.Group
                onChange={() => {
                  selectThisCom(newThisCommodity.skuId)
                }}
                value={selectCommodity.indexOf(newThisCommodity.skuId) > -1 ? [newThisCommodity.skuId] : []}
              >
                <Checkbox
                  value={newThisCommodity.skuId}
                  checked={selectCommodity.indexOf(newThisCommodity.skuId) > -1}
                />
              </Checkbox.Group>
            </View>
            <View className={styles['commodity-image']}>
              {(!newThisCommodity.isPublish || !newThisCommodity.stockCount) && (
                <View className={styles['un-can-bug']}>
                  <Text className={styles['un-can-bug-text']}>
                    {newThisCommodity.stockCount === 0
                      ? intl.formatMessage({ id: 'purchase_components_commodityCardContent_swipeAction_stockCount_1' })
                      : intl.formatMessage({ id: 'purchase_components_commodityCardContent_swipeAction_stockCount_2' })}
                  </Text>
                </View>
              )}
              <ImageBox source={newThisCommodity.commodityLogo} width={96} height={96} />
            </View>
            <View className={styles['commodity-brief']}>
              <View
                className={styles['title-warp']}
                onClick={() => {
                  fnJumpUrl()
                }}
              >
                {/* <Text className='brief-title'></Text> */}
                {newThisCommodity.name}
              </View>
              {newThisCommodity.commoditySku && newThisCommodity.commoditySku.length > 0 && (
                <View className={styles['product-material']}>
                  <Text className={styles['product-material-text']}>{fnGetSku(newThisCommodity.commoditySku)}</Text>
                </View>
              )}
              {newThisCommodity.estimatePrice > 0 && (
                <View>
                  <Text className={styles['estimate']}>
                    {intl.formatMessage({
                      id: 'purchase_components_commodityCardContent_swipeAction_estimate',
                      currency: intl.formatMessage({ id: 'currency' }),
                      data: fnKeepTwo(newThisCommodity.estimatePrice),
                    })}
                  </Text>
                </View>
              )}
              {newThisCommodity.priceType === 1 && (
                <View className={styles['card-config-warp']}>
                  <View className={styles['product-number']}>
                    <Text className={styles['min-text']}>{intl.formatMessage({ id: 'currency' })}</Text>
                    <Text className={styles['price-text']}>{fnKeepTwo(newThisCommodity.newPrice)}</Text>
                    <Text className={styles['min-text']}>
                      {newThisCommodity.unitName ? ` / ${newThisCommodity.unitName}` : ''}
                    </Text>
                    {newThisCommodity.unitPrice && Object.keys(newThisCommodity.unitPrice)?.length > 1 && (
                      <View className={styles['chevronDown-warp']}>
                        <Icons
                          name={ladderVisible ? 'ChevronUp' : 'ChevronDown'}
                          size={10}
                          color="#ffffff"
                          onClick={() => {
                            setLadderVisible(!ladderVisible)
                          }}
                        />
                      </View>
                    )}
                  </View>
                  {newThisCommodity.isPublish && newThisCommodity.stockCount !== 0 ? (
                    <View className={styles['stepper-box']} key={stepperKey}>
                      <Stepper
                        max={newThisCommodity.limitCount}
                        value={newThisCommodity.count}
                        min={newThisCommodity.minOrder}
                        onBlur={handleAddCount}
                        onPlus={handleAddCount}
                        onMinus={handleAddCount}
                        inputWidth={40}
                      />
                    </View>
                  ) : (
                    <View style={{ marginBottom: pxTransform(10) }}>
                      <Text className={styles['sell-out']}>
                        {newThisCommodity.stockCount === 0
                          ? intl.formatMessage({
                              id: 'purchase_components_commodityCardContent_swipeAction_stockCount_1',
                            })
                          : intl.formatMessage({
                              id: 'purchase_components_commodityCardContent_swipeAction_stockCount_2',
                            })}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </SwipeAction>
      <SpecificationList
        count={newThisCommodity.count}
        unitPrice={newThisCommodity.unitPrice}
        unitName={newThisCommodity.unitName}
        isMemberPrice={newThisCommodity.isMemberPrice}
        memberParameter={newThisCommodity.parameter}
        newAction={newThisCommodity.newAction}
        ladderVisible={ladderVisible}
      />
      <View>
        {selectCommodity.indexOf(newThisCommodity.skuId) > -1 &&
          thisCommodity.giveList?.map((giveItem: any, index: number) => {
            return (
              <View className={styles['discount-warp']} key={`${index}_discount`}>
                <View className={cx(styles['discount-content'], styles['ellipsis'])} style={{ flex: 1 }}>
                  <Text className={styles['give-content']}>
                    {`${intl.formatMessage({
                      id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_give',
                    })}:${giveItem.name}`}
                  </Text>
                </View>
                <View className={styles['number-warp']}>
                  <Text className={styles['give-content']}>{`X${giveItem.num}`}</Text>
                  <Icons name="right" size={16} color="#CCCCCC" />
                </View>
              </View>
            )
          })}
      </View>
    </>
  )
}

export default observer(CommodityCardContent)
