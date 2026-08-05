import React, { useEffect, useLayoutEffect, useState } from 'react'
import cx from 'classnames'
import { createSelectorQuery, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons, Text, Toast, SwipeAction, Checkbox } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { SHOP_TYPE } from '@/constants/const/shop'
import ImageBox from '@/components/ImageBox'
import Stepper from '@/components/Stepper'
import { useIntl } from '@linkseeks/i18n'
import { fnGetLimtArr, fnGetSkuId } from '@/packages/order/commonlyFn'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import {
  postProductMobileShopCommodityCollectSaveCommodityCollect,
  postProductMobileShopPurchaseDeletePurchase,
  postProductMobileShopPurchaseSaveOrUpdatePurchase,
} from '@apps/apis'
import SpecificationList from '../SpecificationList'
import { fnGetPriceAndAction, fnKeepTwo } from '../../commonlyFn'
import styles from './index.module.scss'

interface Iprops {
  thisCommodity: any
  selectCommodity: Array<any>[]
  allSelectCommodity: Array<any>[]
  fnGraShopMessage: Function
  commdityType: string
  newShopMessage?: any
}

const ExchangeCommodityCardContent: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const { thisCommodity, selectCommodity, allSelectCommodity, fnGraShopMessage, commdityType, newShopMessage } = props
  // const [newThisCommodity, setNewThisCommodity] = useState<any>({});
  const [loading, setLoading] = useState(false)
  const [stepperKey, setStepperKey] = useState(1)
  const [limitCondition, setLimitConditon] = useState<any>([])
  const [typeIsCount, setTypeIsCount] = useState<any>([])
  const [ladderVisible, setLadderVisible] = useState(false) // 修改梯度价格是否显示
  const [swiperWidth, setSwiperWidth] = useState(200)
  const {
    purchaseOrderStore: { isExpandedAll },
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
      return '报错了'
    }
  }
  /**
   *  选择当前商品
   *  thisId 当前商品的skuid
   */
  const selectThisCom = (thisId: any, newThisCommodity: any) => {
    let maxNumber = 0 // 最大购买的数量
    let newNumber = 0 // 当前购买的数量
    if (!allSelectCommodity || allSelectCommodity.indexOf(thisId) === -1) {
      return
    }
    if (`${newThisCommodity.isMain}` !== 'null' && !newThisCommodity.isMain) {
      return
    }

    const selectCommodityDesc = JSON.parse(JSON.stringify(selectCommodity))
    const selectIndex = selectCommodity.indexOf(thisId)
    if (selectIndex > -1) {
      selectCommodityDesc.splice(selectIndex, 1)
    } else {
      if (newNumber + newThisCommodity.count > maxNumber && maxNumber > 0) {
        Toast.show({
          title: `${intl.formatMessage({
            id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_buy',
          })}${maxNumber}${intl.formatMessage({
            id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_1',
          })}`,
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
    const postData = {
      id: commodity.id,
      count: commodity.count,
    }
    // 这里应该需要做防抖优化----已经出了个蒙版 不用了
    const { data, code } = await postProductMobileShopPurchaseSaveOrUpdatePurchase(postData)
    if (code === 1000) {
    }
  }
  /**
   * 修改商品数量
   * @param newCount 当前商品数量
   */
  const handleAddCount = (newCount: any, newThisCommodity: any) => {
    if (`${newCount}` === 'NaN') {
      newCount = 0
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
  const handleCollection = async (newThisCommodity: any) => {
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
      Toast.show({ title: message })
    }
  }
  /**
   * 删除商品
   */
  const handleRemove = (newThisCommodity: any) => {
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
    // const idList = [newThisCommodity.id];
    // if (`${newThisCommodity.isMain}` === 'true'){
    //   newThisCommodity.topActivityDetail.activityGoods.forEach((thisGoods:any)=>{
    //     idList.push(thisGoods.skuId);
    //   })
    // }
    postProductMobileShopPurchaseDeletePurchase({
      idList: [newThisCommodity.id],
    })
      .then(({ code, message }) => {
        if (code === 1000) {
          // fetchPurchaselise();
          setLoading(false)
          Toast.show({ title: intl.formatMessage({ id: 'purchase_components_commodityCardContent_show_7' }) })
          fnGraShopMessage(newThisCommodity, 'delectMeal')
        } else {
          Toast.show({ title: message })
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
  const fnJumpUrl = (newThisCommodity: any) => {
    jmpProductDetail(newThisCommodity.priceType, { commodityId: newThisCommodity.commodityId })
  }
  /**
   * 收藏/删除
   */
  const fnConfig = (event: any, newThisCommodity: any) => {
    if (event === 1) {
      handleRemove(newThisCommodity)
    } else {
      handleCollection(newThisCommodity)
    }
  }

  useEffect(() => {
    thisCommodity.forEach((item) => {
      if (item.isMain) {
        const lintMoney = item.estimatePrice * item.count
        const obj = fnGetLimtArr(lintMoney, item, true)
        setLimitConditon(obj.arrDesc)
        setTypeIsCount(obj.typeIsCount)
      }
    })
  }, [thisCommodity])

  useEffect(() => {
    setLadderVisible(isExpandedAll)
  }, [isExpandedAll])

  const fnGetContent = (newThisCommodity: any, isMain: boolean) => {
    return (
      <View className={styles['contetnt-warp']} style={{ marginTop: 8 }}>
        <View className={styles['content-warp']}>
          <View>
            {isMain ? (
              <Checkbox.Group
                disabled={isMain}
                onChange={() => {
                  selectThisCom(newThisCommodity.skuId, newThisCommodity)
                }}
                value={
                  (selectCommodity.indexOf(newThisCommodity.skuId) > -1 && !newThisCommodity.parentSkuId) ||
                  selectCommodity.indexOf(newThisCommodity.parentSkuId) > -1
                    ? [newThisCommodity.skuId]
                    : []
                }
              >
                <Checkbox
                  value={newThisCommodity.skuId}
                  checked={selectCommodity.indexOf(newThisCommodity.skuId) > -1}
                />
              </Checkbox.Group>
            ) : (
              <View style={{ marginLeft: pxTransform(17) }}></View>
            )}
          </View>
          <View className={styles['commodity-image']}>
            {(!newThisCommodity.isPublish || !newThisCommodity.stockCount) && isMain && (
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
                fnJumpUrl(newThisCommodity)
              }}
            >
              <View className={styles['title-warp-box']}>
                {!isMain && (
                  <View className={styles['exchange-title']}>
                    {intl.formatMessage({
                      id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_exchange',
                    })}
                  </View>
                )}
                <View
                  className={
                    newThisCommodity.estimatePrice > 0 &&
                    limitCondition.indexOf(fnGetSkuId(newThisCommodity.skuId)) == -1 &&
                    !isMain
                      ? styles['unqualified']
                      : ''
                  }
                >
                  {newThisCommodity.name}
                </View>
              </View>
            </View>
            {newThisCommodity.commoditySku && newThisCommodity.commoditySku.length > 0 && (
              <View className={styles['product-material']}>
                <Text className={styles['product-material-text']}>{fnGetSku(newThisCommodity.commoditySku)}</Text>
              </View>
            )}
            {(limitCondition.indexOf(fnGetSkuId(newThisCommodity.skuId)) > -1 || isMain) &&
              newThisCommodity.estimatePrice > 0 && (
                <View>
                  <Text className={styles['estimate']}>{`${
                    isMain
                      ? intl.formatMessage({
                          id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_hangPrice',
                        })
                      : intl.formatMessage({
                          id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_exchangePrice',
                        })
                  }${intl.formatMessage({ id: 'currency' })}${fnKeepTwo(
                    newThisCommodity.handPrice || newThisCommodity.estimatePrice,
                  )}`}</Text>
                </View>
              )}
            {(typeIsCount || (newThisCommodity.estimatePrice > 0 && !typeIsCount)) &&
            limitCondition.indexOf(fnGetSkuId(newThisCommodity.skuId)) == -1 &&
            !isMain ? (
              <View className={styles['estimate']}>
                {intl.formatMessage({
                  id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_un_exchangePrice',
                })}
              </View>
            ) : (
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
                {/* {
                    isMain ? <> */}
                {newThisCommodity.isPublish && newThisCommodity.stockCount !== 0 ? (
                  <View className={styles['stepper-box']} key={stepperKey}>
                    <Stepper
                      max={newThisCommodity.limitCount}
                      value={newThisCommodity.count}
                      min={newThisCommodity.minOrder}
                      onBlur={(count) => {
                        handleAddCount(count, newThisCommodity)
                      }}
                      onPlus={(count) => {
                        handleAddCount(count, newThisCommodity)
                      }}
                      onMinus={(count) => {
                        handleAddCount(count, newThisCommodity)
                      }}
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
    )
  }

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
      {thisCommodity.map((item: any) => {
        return (
          <>
            <SwipeAction
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
              onClick={(_, index) => fnConfig(index, item)}
            >
              {fnGetContent(item, item.isMain)}
            </SwipeAction>
            <SpecificationList
              count={item.count}
              unitPrice={item.unitPrice}
              unitName={item.unitName}
              isMemberPrice={item.isMemberPrice}
              memberParameter={item.parameter}
              newAction={item.newAction}
              ladderVisible={ladderVisible}
            />
            <View style={{ paddingLeft: '40vw' }}>
              <View style={{ width: '130px' }}></View>
              {selectCommodity.indexOf(item.skuId) > -1 &&
                item.giveList?.map((giveItem: any, index: number) => {
                  return (
                    <View className={styles['discount-warp']} key={`${index}_discount`}>
                      <View className={cx(styles['discount-content'], styles['ellipsis'])}>
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
      })}
    </>
  )
}

export default observer(ExchangeCommodityCardContent)
