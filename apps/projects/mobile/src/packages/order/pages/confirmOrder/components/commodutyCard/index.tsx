import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useDidShow, getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons, TextArea } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import { getLogisticsShipperAddressGet } from '@apps/apis'
import { getOrderMobileCreateFindDeliveryDate } from '@apps/apis'
import { fnGetNewEstimatePrice } from '../../../../common/commonlyFn'
import { fnKeepTwo } from '../../../../commonlyFn'
import styles from './index.module.scss'

interface Iprops {
  thisShop: any[]
  fnShowCommodity: Function
  fnCloseLoginsticsLayer: Function
  fnCloseTimeLayer: Function
  selectItem: any
  getvendorMember: Function
  /**
   * 运费
   */
  freightTotal: number
}

const CommodutyCard = (props: Iprops) => {
  const intl = useIntl()
  // eslint-disable-next-line no-empty-pattern
  const {
    thisShop = [],
    fnShowCommodity,
    fnCloseLoginsticsLayer,
    fnCloseTimeLayer,
    getvendorMember,
    selectItem,
    freightTotal,
  } = props
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [randTimeData, setRandTimeData] = useState<any>({})
  const [newGiveActivity, setNewGiveActivity] = useState<any>({})
  // const [childCommodityList, setChildCommodityList] = useState([]);
  const [showTimeLayer, setShowTimeLayer] = useState(false) // 显示送货时间
  const [ramckText, setRamckText] = useState('')
  const { model } = getSystemInfoSync()
  const fnShowList = (commodityList: any) => {
    if (fnShowCommodity) {
      fnShowCommodity(commodityList)
    }
  }
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
      return intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetSku' })
    }
  }
  /**
   * 获取配送方式
   */
  const fnGetLogistics = (key: any, logisticsLayer: any) => {
    const _freightText = `${intl.formatMessage({ id: 'order.wuliuyunshu', defaultMessage: '物流运输' })} ${
      freightTotal > 0
        ? `${intl.formatMessage({ id: 'order.yunfei', defaultMessage: '运费' })}: ${fnKeepTwo(freightTotal)}`
        : intl.formatMessage({ id: 'confirmOrder_components_logisticsLayer_contentTitle_1', defaultMessage: '免运费' })
    }`
    const logisticsArr = [
      '',
      _freightText,
      intl.formatMessage({ id: 'order.shangmenzitimianyun', defaultMessage: '上门自提 免运费' }),
      intl.formatMessage({ id: 'order.wuxupeisong', defaultMessage: '无需配送' }),
      '请选择配送方式',
    ]
    if (key === 4) {
      if (selectItem.Index === 0 || Object.keys(selectItem).length <= 0) {
        return _freightText
      }
      return intl.formatMessage({ id: 'order.shangmenzitimianyun', defaultMessage: '上门自提 免运费' })
    }
    if (key === 2) {
      const parmas = {
        id: logisticsLayer.logistics?.sendAddressId,
      }
      getLogisticsShipperAddressGet(parmas).then((res: any) => {
        // eslint-disable-next-line no-param-reassign
        logisticsLayer.logistics.addMessage = res.data
      })
    }
    return (
      logisticsArr[key] ||
      intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetLogistics_logisticsArr_0' })
    )
  }
  /**
   * 获取预计收货时间
   */
  const fnGetDeliveryTime = (newShop: any) => {
    if (!newShop || !newShop.delivery) {
      return intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetDeliveryTime_1' })
    }
    const { delivery } = newShop
    let tipsType = 'YY-MM-DD H:m'
    let timeTips = dateFormat(new Date(delivery.selectData || ''), tipsType)
    if (randTimeData.deliveryTime) {
      // 分段
      tipsType = 'YY-MM-DD'
      timeTips = `${dateFormat(new Date(delivery.selectData), tipsType)} ${delivery.startTime || ''}-${
        delivery.endTime || ''
      }`
    }
    return intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetDeliveryTime_2', data: timeTips })
  }
  /**
   * 显示物流
   * @param thisLogin 当前物流
   */
  const fnShowLogin = (thisLogin: any) => {
    if (thisLogin.logistics?.deliveryType === 3) {
      return
    }
    fnCloseLoginsticsLayer(thisLogin)
  }
  const fnChangeTimeLayer = (thisCom: any) => {
    fnCloseTimeLayer(thisCom, randTimeData)
  }
  /**
   *  价格区间
   */
  const fnGetPriceSection = (str: string, key: number) => {
    if (!str) {
      return 0
    }
    const arrStr = `${str}`.split('.')
    if (key === 1 && !arrStr[key]) {
      return `00`
    }
    return arrStr[key]
  }
  const fnGetNumber = (newCommiity: any) => {
    let numberAll = 0
    newCommiity.forEach((item: any) => {
      numberAll += item.count
    })
    return numberAll
  }
  /**
   * @returns 返回多商品的dom
   */
  const fnGetMoreDom = () => {
    const selfMention: any[] = [] // 自提
    const logisiticd: any[] = [] // 物流
    const delivertCasg: any[] = [] // 货到付款
    const unDustruvytuib: any[] = [] // 无需配送
    const list: any = [] // 物流加+自提
    thisShop.forEach((item: any) => {
      // eslint-disable-next-line no-param-reassign
      item.remarks = ''
      // eslint-disable-next-line no-param-reassign
      if (item.logistics?.deliveryType === 0) {
        selfMention.push(item)
      } else if (item.logistics?.deliveryType === 1) {
        logisiticd.push(item)
      } else if (item.logistics?.deliveryType === 2) {
        delivertCasg.push(item)
      } else if (item.logistics?.deliveryType === 3) {
        unDustruvytuib.push(item)
      } else if (item.logistics?.deliveryType == 4) {
        list.push(item)
      }
    })
    const allDeliver: any = {
      selfMention,
      logisiticd,
      delivertCasg,
      unDustruvytuib,
      list,
    }
    const allDeliverKeys = ['selfMention', 'logisiticd', 'delivertCasg', 'unDustruvytuib', 'list']
    const showImgList: any = []
    return allDeliverKeys.map((key: string) => {
      if (allDeliver[key].length === 0) {
        return
      }
      // eslint-disable-next-line consistent-return
      return (
        <>
          <View
            className={styles['img-list-main']}
            onClick={() => {
              fnShowList(allDeliver[key])
            }}
          >
            <View className={styles['img-list-warp']}>
              {allDeliver[key].map((item: any, index: number) => {
                const indexOf = showImgList.indexOf(item.commodityId)
                if (indexOf > -1 || showImgList.length > 3) {
                  return
                }
                showImgList.push(item.commodityId)
                return <Image key={`img${index}`} src={item.commodityLogo} className={styles['commoduty-img']} />
              })}
            </View>
            <Text className={styles['small-font']}>
              {intl.formatMessage({
                id: 'confirmOrder_components_commodutyCard_fnGetMoreDom_1',
                data: fnGetNumber(allDeliver[key]),
              })}
            </Text>
            <Icons name="ChevronRight" size={16} color="#CCCCCC" />
          </View>
          <View className={styles['logistics-warp']}>
            <Text className={styles['small-font']}>
              {intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetMoreDom_2' })}
            </Text>
            <View
              className={styles['logistics-icon']}
              onClick={() => {
                fnShowLogin(allDeliver[key][0])
              }}
            >
              <Text className={styles['small-font']}>
                {fnGetLogistics(allDeliver[key][0]?.logistics?.deliveryType, allDeliver[key][0])}
              </Text>
              <Icons name="ChevronRight" size={16} color="#CCCCCC" />
            </View>
          </View>
        </>
      )
    })
  }
  /**
   * @returns h获取时间范围
   */
  const fnGetTimeRan = async () => {
    if (thisShop.length === 0) {
      return
    }
    const params = {
      shopId: shopAndSite?.id, // 订单来源商城Id
      vendorMemberId: thisShop[0].memberId,
      vendorRoleId: thisShop[0].memberRoleId,
    }
    const { code, data } = await getOrderMobileCreateFindDeliveryDate(params)
    if (code === 1000) {
      setRandTimeData(data)
    }
    // 318
    getvendorMember({
      vendorMemberId: thisShop[0].memberId,
      vendorRoleId: thisShop[0].memberRoleId,
    })
  }
  /**
   * 修改订单备注
   */
  const fnChangeRamark = (val: any) => {
    thisShop[0].remark = val
    setRamckText(val)
  }
  useDidShow(() => {
    thisShop[0].remark = ramckText
  })
  /**
   * @returns 返回商城名称
   */
  const fnGetStoreName = (newShopMessage: any) => {
    if (shopAndSite?.isSelf) {
      return shopAndSite.name
    }
    return newShopMessage?.storeName || newShopMessage?.memberName
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 返回赠品的dom
   */
  const fnGetGiftDom = (thisCommodity: any, newActivity: any) => {
    return (
      <View className={styles['card-tips-warp']}>
        {/* <View className='box'>
          <Text className={newAddress === 'top' ? 'full-minus' : 'full-minus-em'}>{newActivity.preferentialTag || intl.formatMessage('purchase_components_commodityCard_fnGetGiftDom_fullMinus')}</Text>
        </View> */}
        <View style={{ marginLeft: pxTransform(16) }}></View>
        <View className={styles['discount-main']}>
          {thisCommodity.giveList?.map((item: any, index: number) => (
            <View className={styles['discount-warp']} key={`${index}_discount`}>
              <View className={cx(styles['discount-content'], styles['ellipsis'])}>
                <Text className={styles['font12']}>
                  {intl.formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_give' })}
                  : {item.name}
                </Text>
              </View>
              <View className={styles['number-warp']}>
                <Text className={cx(styles['color-red'], styles['ellipsis'])}>
                  {newActivity.activityType === 6
                    ? `X${item.num}`
                    : intl.formatMessage({ id: 'purchase_components_commodityCard_fnGetGiftDom_colorRed' })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
  /**
   * 当只有一个商店的时候, 需要获取赠送活动的数据---
   * @param newCommiityDesc 商店
   */
  const fnGetNewGiveActivity = (newCommiityDesc: any) => {
    let isGive = false
    let giveActivity = {}
    if (newCommiityDesc.topActivityDetail?.activityType === 6) {
      isGive = true
      giveActivity = newCommiityDesc.topActivityDetail
    }
    if (!isGive) {
      newCommiityDesc.activityDetails?.forEach((item: any) => {
        if (item.activityType === 6) {
          giveActivity = item
        }
      })
    }
    setNewGiveActivity(giveActivity)
  }

  useEffect(() => {
    fnGetTimeRan()
    if (thisShop.length === 1) {
      fnGetNewGiveActivity(thisShop[0])
    }
  }, [thisShop])
  return (
    <View className={styles['card-main']}>
      <View className={styles['card-warp']}>
        <View className={styles['card-title']}>
          <Image
            src={shopAndSite?.isSelf ? (shopAndSite?.logoUrl as string) : thisShop[0]?.storeLogo}
            className={styles['shop-img']}
          />
          <Text className={styles['small-font']}>{fnGetStoreName(thisShop[0])}</Text>
        </View>
        {
          // (thisShop.length > 1 || (`${thisShop[0].isMain}` !== 'null' && `${thisShop[0].isMain}` !== 'undefined'))
          thisShop.length > 1 && fnGetMoreDom()
        }
        {
          // thisShop.length === 1 && (`${thisShop[0].isMain}` === 'null' || !thisShop[0].isMain) && (
          thisShop.length === 1 && (
            <>
              <View className={styles['commoduty-only']}>
                <Image src={thisShop[0].commodityLogo} className={styles['commoduty-img-only']} />
                <View className={styles['commoduty-only-content']}>
                  <Text className={styles['content-title']}>{thisShop[0].name}</Text>
                  <Text className={styles['content-type']}>{fnGetSku(thisShop[0].commoditySku)}</Text>
                  <View className={styles['price-warp']}>
                    <View className={styles['price-left']}>
                      <Text className={styles['icon-tips-size']}>{intl.formatMessage({ id: 'currency' })}</Text>
                      <Text className={styles['money-size']}>
                        {fnGetPriceSection(fnGetNewEstimatePrice(thisShop[0]), 0)}
                      </Text>
                      <Text className={styles['icon-tips-size']}>
                        {`.${fnGetPriceSection(fnGetNewEstimatePrice(thisShop[0]), 1)}`}
                      </Text>
                      <Text className={styles['money-uni']}>{` / ${thisShop[0].unitName}`}</Text>
                    </View>
                    <Text>{`X${thisShop[0].count}`}</Text>
                  </View>
                </View>
              </View>
              {newGiveActivity.activityType === 6 && fnGetGiftDom(thisShop[0], newGiveActivity)}
              <View className={styles['logistics-warp']}>
                <Text className={styles['left-titlr']}>
                  {intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_leftTitlr_1' })}
                </Text>
                <View
                  className={styles['logistics-icon']}
                  onClick={() => {
                    fnShowLogin(thisShop[0])
                  }}
                >
                  <Text className={styles['small-font']}>
                    {fnGetLogistics(thisShop[0]?.logistics?.deliveryType, thisShop[0])}
                  </Text>
                  <Icons name="ChevronRight" size={16} color="#CCCCCC" />
                </View>
              </View>
            </>
          )
        }
        {(randTimeData.appointmentDay || randTimeData.deliveryTime) && (
          <View
            className={styles['ingpu-warp']}
            onClick={() => {
              fnChangeTimeLayer(thisShop[0])
            }}
          >
            <Text className={styles['left-titlr']}>
              {intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_leftTitlr_2' })}
            </Text>
            <View className={styles['logistics-icon']}>
              <Text className={styles['small-font']}>{fnGetDeliveryTime(thisShop[0])}</Text>
              <Icons name="ChevronRight" size={16} color="#CCCCCC" />
            </View>
          </View>
        )}
        <View className={styles['ingpu-warp-twp']} style={{ marginBottom: pxTransform(20) }}>
          <Text className={styles['left-titlr']} style={{ paddingTop: pxTransform(3) }}>
            {intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_leftTitlr_3' })}
          </Text>
          <TextArea
            value={ramckText}
            height={40}
            className={model.indexOf('iPhone') >= 0 ? styles.inputTextIos : styles.inputText}
            onChange={(res) => {
              fnChangeRamark(res)
            }}
            placeholder={intl.formatMessage({ id: 'confirmOrder_components_commodutyCard_placeholder' })}
          />
        </View>
      </View>
      {/* 送货时间 */}
      {/* <DeliveryTime
        showTimeLayer={showTimeLayer}
        fnClose={fnCloseTimeLayer}
      /> */}
    </View>
  )
}

export default CommodutyCard
