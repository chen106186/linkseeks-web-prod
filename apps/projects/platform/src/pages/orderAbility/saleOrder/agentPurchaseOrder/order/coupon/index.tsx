import React, { useState, useEffect } from 'react'
import { Alert, Checkbox, Tabs, message } from 'antd'
import styles from './index.less'
import { postMarketingWebAgentCouponListByOrder, PostMarketingWebCouponListByOrderResponse } from '@apps/apis'
import {
  postOrderCreateAgentLrcList,
  PostOrderMobileCreateLrcListRequest,
  PostOrderMobileCreateLrcListResponse,
} from '@apps/apis'
import { dateFormat } from '../../utils/date'
import { priceFormat } from '../../utils/numFormat'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { OrderInfoType } from '../types'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { AgentPurchaseOrderInfoType } from '../../types'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface InvoicePropsType {
  state: boolean
  onChange: Function
  shopId: number | undefined
  orderAmount: string | number
  orderInfo: OrderInfoType
  fnDetermineCallBlack: Function
  buyerInfo: AgentPurchaseOrderInfoType
}

const CouponSelect: React.FC<InvoicePropsType> = (props) => {
  const intl = useIntl()
  const { state, onChange, shopId, orderAmount, orderInfo, fnDetermineCallBlack, buyerInfo } = props
  const { TabPane } = Tabs
  const [couponList, setcouponList] = useState<PostMarketingWebCouponListByOrderResponse>([])
  const [IntegralList, setIntegralList] = useState<PostOrderMobileCreateLrcListResponse>([])
  const [couponIdListSelect, setCouponIdListSelect] = useState<any>([]) // 选中优惠券的Id集合
  const [shouldResetShop, setshouldResetShop] = useState<number>(1) // 是否需要重置商店的选中
  const [shouldShowTips, setShouldShowTips] = useState<number>(0) // 是否需要显示提示语
  const [selectPlatfrom, setSelectPlatfrom] = useState<any>({}) // 选中的平台优惠券
  const [selectShop, setSelectShop] = useState<any>({}) // 选中的店铺优惠券
  const [selectCommodity, setLectCommodity] = useState<any>({}) // 选中的商品优惠券
  const [selectIntegralList, setSelectIntegralList] = useState<any>([]) // 选中的积分优惠券对象
  const [selectIntegralIdList, setSelectIntegralIdList] = useState<any>([]) // 选中的积分优惠券对象Id
  const [hasSelectPlatform, setHasSelectPlatform] = useState(false)
  const translate = useWebIntl()

  /**
   * 获取选中的优惠券
   */
  const fnGetSelectCouponList = () => {
    const callBlackObj = []
    if (selectPlatfrom && selectPlatfrom.onlyId) {
      callBlackObj.push(selectPlatfrom)
    }
    Object.keys(selectShop).forEach((key) => {
      if (!selectShop[key] || !selectShop[key].onlyId) return
      callBlackObj.push(selectShop[key])
    })
    Object.keys(selectCommodity).forEach((key) => {
      if (!selectCommodity[key] || !selectCommodity[key].onlyId) return
      callBlackObj.push(selectCommodity[key])
    })
    return callBlackObj
  }

  /**
   * @returns 返回skuid列表
   */
  const fnGetSkuIdListObj = () => {
    const skuIdListObj: Array<any> = []
    orderInfo.orderList.forEach((item) => {
      const obj: { memberId: number; roleId: number; skuIdList: number[] } = {
        memberId: orderInfo.supplyMembersId,
        roleId: orderInfo.supplyMembersRoleId,
        skuIdList: [],
      }
      item.orderList.forEach((newCommodity) => {
        obj.memberId = newCommodity.vendorMemberId
        obj.roleId = newCommodity.vendorRoleId
        obj.skuIdList.push(newCommodity.id)
      })
      skuIdListObj.push(obj)
    })
    return skuIdListObj
  }

  /**
   * 获取优惠券列表
   */
  const fnetCouponList = () => {
    const skuIdListObj = fnGetSkuIdListObj()
    const parmas = {
      shopId: shopId,
      goodsList: skuIdListObj,
      orderAmount,
    }
    const headers: any = {
      agentMemberId: buyerInfo?.memberId,
      agentRoleId: buyerInfo?.roleId,
    }
    postMarketingWebAgentCouponListByOrder(parmas as any, { headers }).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        setcouponList(res.data)
        // setcouponList([{}]);
        // setSelectCoupon
        const selectCouponDesc: any = []
        res.data.forEach((item: any) => {
          item.onlyId = `${item.belongType}${item.id}` // 因为优惠券的id不是唯一性的,所以加上个唯一的
          if (item.select) {
            selectCouponDesc.push(item)
          }
        })
      }
    })
  }
  const fnGetShopPay = (thisShop: any, platformAmount: number) => {
    let memberAmount = 0
    const arrList = fnGetSelectCouponList()
    let selectCoupon: any = {}
    arrList.forEach((item: any) => {
      if (item.roleId === thisShop.memberRoleId && item.memberId === thisShop.memberId) {
        selectCoupon = item
      }
    })
    thisShop.orderList.forEach((item: any) => {
      memberAmount += item.count * item.refPrice
    })
    if (selectCoupon.denomination) {
      memberAmount -= selectCoupon.denomination
    }
    console.log(platformAmount, 'platformAmount')
    console.log(memberAmount, 'memberAmount')
    return memberAmount > platformAmount ? platformAmount : memberAmount
  }
  /**
   * 获取积分券列表
   */
  const fnetIntegralList = () => {
    const arrCouponList = fnGetSelectCouponList()
    let allCouponMoney = 0
    arrCouponList.forEach((item: any) => {
      allCouponMoney += item.denomination
    })
    let platformAmount = 0
    orderInfo.orderList.forEach((item: any) => {
      platformAmount += item.shopAllPay
    })
    platformAmount -= allCouponMoney
    const parmas = orderInfo.orderList.map((item: any) => {
      return {
        vendorMemberId: buyerInfo.memberId,
        vendorRoleId: buyerInfo.roleId,
        platformAmount,
        memberAmount: fnGetShopPay(item, platformAmount),
      }
    })
    const itemList = {
      itemList: parmas,
    }
    postOrderCreateAgentLrcList(itemList).then((res: any) => {
      if (res.code === 1000) {
        message.destroy()
        setIntegralList(res.data)
        // fnInitTrueIntegralList(res.data);
      }
    })
  }

  const handleStateChange = () => {
    onChange(!state)
  }

  /**
   *  平台优惠券的选择
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnPlatfromCoupon = (indexId: number, item: any) => {
    if (!selectPlatfrom.onlyId) {
      // 平台优惠券没有被选择
      setSelectPlatfrom(item) // 设置平台优惠券
      couponIdListSelect.push(item.onlyId)
      setCouponIdListSelect([...couponIdListSelect])
    } else if (selectPlatfrom.onlyId === item.onlyId) {
      // 选择了 并且选择了同一张 将之取消
      setSelectPlatfrom({})
      couponIdListSelect.splice(indexId, 1)
      setCouponIdListSelect([...couponIdListSelect])
    } else {
      // 如果选择不是同一张平台优惠券，则提示
      message.error(intl.formatMessage({ id: 'order.coupon.error_1', defaultMessage: '平台优惠券只能使用一张' }))
    }
  }

  /**
   *  商店通用优惠券的选择
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnShopCoupon = (indexId: number, item: any) => {
    const selectShopDesc = { ...selectShop } // 商城通用优惠券
    const keyName = `shopId_${item.memberId}_${item.roleId}`
    console.log(keyName)
    console.log(selectShopDesc)
    if (!selectShopDesc[keyName]) {
      // 还没有选择这商城优惠券
      selectShopDesc[keyName] = item
      setSelectShop(selectShopDesc) // 设置商城优惠券
      couponIdListSelect.push(item.onlyId) // 选中优惠券
      setCouponIdListSelect([...couponIdListSelect])
      // 还是选择了同一张平台优惠券，即取消
    } else if (selectShopDesc[keyName].onlyId === item.onlyId) {
      selectShopDesc[keyName] = null
      setSelectShop({ ...selectShopDesc })
      couponIdListSelect.splice(indexId, 1) // 删除这优惠券
      setCouponIdListSelect([...couponIdListSelect])
    } else if (selectShopDesc[keyName].onlyId) {
      // 有商店通用 且有id
      message.error(intl.formatMessage({ id: 'order.coupon.error_2', defaultMessage: '商店通用优惠券只能使用一张' }))
    } else {
      // 这个商店通用是因为选择了商品优惠券
      message.error(
        intl.formatMessage({ id: 'order.coupon.error_3', defaultMessage: '商店通用优惠券和商品优惠券只能使用一种' }),
      )
    }
  }

  /**
   * @returns 返回skuid列表
   */
  const fnGetSkuIdList = () => {
    let skuIdList: Array<number> = []
    const skuIdObjArr = fnGetSkuIdListObj()
    skuIdObjArr.forEach((item: any) => {
      skuIdList = [...skuIdList, ...item.skuIdList]
    })
    return skuIdList
  }

  /**
   *  商品优惠券的选中
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnCommodity = (indexId: number, item: any) => {
    const selectShopDesc = { ...selectShop } // 商城通用优惠券
    const selectCommodityDesc = { ...selectCommodity } // 商品优惠券
    const keyName = `shopId_${item.memberId}_${item.roleId}` // 商城通用卷名称
    // 存在了选额商店通用卷
    if (selectShopDesc[keyName] && selectShopDesc[keyName].onlyId) {
      // ps 因为选择商品添加的商店通用 是没有couponId的
      message.error(
        intl.formatMessage({ id: 'order.coupon.error_4', defaultMessage: '商店通用优惠和商品优惠券不能同时使用' }),
      )
      return
    }
    // 这个商品优惠券所属的商店没选过优惠券
    if (!selectShopDesc[keyName] || !selectShopDesc[keyName].onlyId) {
      let skuIdName = '' // 商品优惠券名称
      const readlySelectCommodity = Object.keys(selectCommodityDesc)
      const skuIdListDesc = fnGetSkuIdList()
      if (indexId > -1) {
        // 这张优惠券已经被选择了
        delete selectCommodityDesc[item.selectSkuId] // 删除改条优惠卷
        // selectCommodityDesc[item.selectSkuId] = null; // 设置商品优惠券选择
        couponIdListSelect.splice(indexId, 1) // 删除这优惠券的id
        setCouponIdListSelect([...couponIdListSelect])
        setLectCommodity(selectCommodityDesc)
        setshouldResetShop(shouldResetShop + 1) // 删除了商品优惠券 重置一下商店优惠券
        return
      }
      item.suitableSkuIdList.forEach((newSkuId: string) => {
        // 能选择的优惠券skuId
        if (readlySelectCommodity.indexOf(`${newSkuId}`) === -1 && !skuIdName) {
          // 已经选择的 并且没有选中这个
          if (skuIdListDesc.indexOf(Number(newSkuId)) > -1) {
            skuIdName = newSkuId
          }
        }
      })
      if (!skuIdName) {
        message.error(intl.formatMessage({ id: 'order.coupon.error_5', defaultMessage: '同一商品已经选择了优惠券' }))
        return
      }
      // if (indexId === -1) { // 这张优惠券并没有使用
      // eslint-disable-next-line no-param-reassign
      item.selectSkuId = skuIdName
      selectCommodityDesc[skuIdName] = item // 设置商品优惠券选择
      selectShopDesc[keyName] = {} // 因为选中商品优惠券，不能选商店通用 所以来占坑
      couponIdListSelect.push(item.onlyId) // 选中优惠券
      setCouponIdListSelect([...couponIdListSelect])
      setSelectShop({ ...selectShopDesc })
      setLectCommodity(selectCommodityDesc)
      // }
    }
  }

  /**
   * 修改选中优惠券
   * @param item 当前优惠券
   */
  const fnSelectConpon = (item: any) => {
    const indexId = couponIdListSelect.indexOf(item.onlyId)
    console.log(item)
    if (item.belongType === 1) {
      // 平台优惠券
      fnPlatfromCoupon(indexId, item)
    } else if (item.type === 2) {
      // 商家通用优惠券
      fnShopCoupon(indexId, item)
    } else {
      // 商品优惠券
      fnCommodity(indexId, item)
    }
    setSelectIntegralList([])
    setSelectIntegralIdList([])
  }

  /**
   * 确定选择优惠券
   */
  const fnDetermine = () => {
    const callBlackObj = fnGetSelectCouponList()
    fnDetermineCallBlack(callBlackObj, 'coupon')
  }

  /**
   *  重置商店通用优惠券的选择
   * 因为不知道删除了商品优惠券，这个商店还有没有使用优惠券
   */
  const fnResetShopCoupon = () => {
    const obj: any = {}
    Object.keys(selectCommodity).forEach((keyName: string) => {
      if (selectCommodity[keyName]) {
        const shopKeyName = `shopId_${selectCommodity[keyName].memberId}_${selectCommodity[keyName].roleId}`
        obj[shopKeyName] = selectShop[shopKeyName] || {}
      }
    })
    setSelectShop({ ...obj })
  }

  useEffect(() => {
    fnResetShopCoupon()
  }, [shouldResetShop])

  useEffect(() => {
    fnetCouponList()
    fnetIntegralList()
  }, [])

  useEffect(() => {
    fnDetermine()
    setShouldShowTips(shouldShowTips + 1)
  }, [selectPlatfrom, selectShop, selectCommodity])
  useEffect(() => {
    fnDetermineCallBlack(selectIntegralList, 'integral')
  }, [selectIntegralList])

  /**
   * 修改选中积分
   * @param item 当前积分数据
   */
  const fnSelectIntegral = (item: any) => {
    const index = selectIntegralIdList.indexOf(item.vendorMemberId) // 判断是否已经选中
    if (item.relType === 0) {
      // 当前选中的说平台积分
      if (!hasSelectPlatform) {
        // 当前平台积分没选中
        if (selectIntegralIdList.length !== 0) {
          message.error(
            intl.formatMessage({
              id: 'order.coupon.huiyuanjifenhepingtaiji',
              defaultMessage: '会员积分和平台积分不可以同时使用',
            }),
          )
          return
        }
        setHasSelectPlatform(true)
        setSelectIntegralIdList([item.vendorMemberId])
        setSelectIntegralList([item])
      } else {
        // 当前已经选中平台积分,并且只有它 取消选中,重置为空
        setSelectIntegralIdList([])
        setSelectIntegralList([])
        setHasSelectPlatform(false)
      }
      return
    }
    if (hasSelectPlatform) {
      message.error(
        intl.formatMessage({
          id: 'order.coupon.huiyuanjifenhepingtaiji',
          defaultMessage: '会员积分和平台积分不可以同时使用',
        }),
      )
      return
    }
    // 下面是会员积分操作
    if (index === -1) {
      selectIntegralIdList.push(item.vendorMemberId)
      setSelectIntegralIdList([...selectIntegralIdList])
      selectIntegralList.push(item)
      setSelectIntegralList([...selectIntegralList])
    } else {
      selectIntegralIdList.splice(index, 1)
      setSelectIntegralIdList([...selectIntegralIdList])
      selectIntegralList.splice(index, 1)
      setSelectIntegralList([...selectIntegralList])
    }
  }

  const fnChangeTabs = (e: string) => {
    if (e === '2') {
      fnetIntegralList() // 重置一下最新的积分
    }
  }

  return (
    <div>
      <div className={styles.coupon}>
        <div className={styles.common_title}>
          <span>{intl.formatMessage({ id: 'order.coupon.title', defaultMessage: '使用优惠券/积分' })}</span>
          {state ? (
            <CaretDownOutlined onClick={handleStateChange} className={styles.common_title_icon} />
          ) : (
            <CaretRightOutlined onClick={handleStateChange} className={styles.common_title_icon} />
          )}
        </div>
        {/* <div className={styles.checkbox}>
              <Checkbox checked={state} onChange={handleStateChange}>
                {intl.formatMessage('order.coupon.checkbox', '优惠券组合推荐')}
              </Checkbox>
            </div> */}
        {state && (
          <Tabs defaultActiveKey="1" onTabClick={fnChangeTabs}>
            <TabPane tab={intl.formatMessage({ id: 'mall.text.coupon', defaultMessage: '优惠券' })} key="1">
              {shouldShowTips !== 1 && (
                <Alert
                  key={shouldShowTips}
                  description={intl.formatMessage({
                    id: 'order.coupon..ninyijingqiehuanyouhuigui',
                    defaultMessage: '您已经切换优惠规则，需要重新选择积分抵用券',
                  })}
                  type="warning"
                  closable
                  style={{ padding: '5px 15px', alignItems: 'center' }}
                />
              )}
              <div className={styles.raido_group}>
                <Checkbox.Group className={styles.coupon_list} value={couponIdListSelect}>
                  {couponList.map((item: any, index) => (
                    <div
                      className={styles.list_radio}
                      key={`address_list_radio_${item.onlyId}`}
                      onClick={() => {
                        fnSelectConpon(item)
                      }}
                    >
                      <div className={styles.coupon_list_item} key={`coupon_list_item_${index}`}>
                        <div className={styles.coupon_money}>
                          {translate('web.common.currencySymbol')}
                          {item.denomination}
                        </div>
                        <div className={styles.coupon_discount}>
                          {intl.formatMessage({
                            id: 'order.coupon.discount',
                            defaultMessage: '满{{money}}减{{denomination}}',
                            money: item.useConditionMoney,
                            denomination: item.denomination,
                          })}
                        </div>
                        <div className={styles.coupon_range}>
                          {dateFormat(new Date(item.validTimeStart), 'YYYY-MM-DD')}
                          {intl.formatMessage({ id: 'order.coupon.to', defaultMessage: '至' })}
                          {dateFormat(new Date(item.validTimeEnd), 'YYYY-MM-DD')}
                        </div>
                        <div className={styles.coupon_type}>
                          [
                          {item.belongType === 1
                            ? intl.formatMessage({ id: 'order.coupon.platform', defaultMessage: '平台优惠券' })
                            : intl.formatMessage({ id: 'order.coupon.business', defaultMessage: '商家优惠券' })}
                          ]
                          <Checkbox value={item.onlyId} />
                        </div>
                      </div>
                    </div>
                  ))}
                </Checkbox.Group>
                {couponList.length === 0 && (
                  <span>
                    {intl.formatMessage({
                      id: 'order.coupon.nindangqianmeiyouyouhuiquan',
                      defaultMessage: '您当前没有优惠券。',
                    })}
                  </span>
                )}
              </div>
            </TabPane>
            <TabPane tab={intl.formatMessage({ id: 'pay.pointsMall.integral', defaultMessage: '积分' })} key="2">
              <div className={styles.raido_group}>
                <Checkbox.Group className={styles.coupon_list} value={selectIntegralIdList}>
                  {IntegralList.map((item: any, index) => (
                    <div
                      className={styles.list_radio}
                      key={`address_list_radio_${item.vendorMemberId}`}
                      onClick={() => {
                        fnSelectIntegral(item)
                      }}
                    >
                      <div className={styles.integral_list_item} key={`coupon_list_item_${index}`}>
                        <div className={styles.integral_money}>{priceFormat(item.currentPoint)}</div>
                        <div className={styles.integral_discount}>
                          {translate('web.resource.order.bendankeshiyongjifen', { point: item.enablePoint })}
                        </div>
                        <div className={styles.integral_range}>
                          {translate('web.resource.order.bendankediyongjine', { amount: item.enableDeductionAmount })}
                        </div>
                        <div className={styles.integral_type}>
                          [{item.relType === 0 ? translate('web.resource.order.pingtaitongyongjifen') : item.vendorName}
                          ]
                          <Checkbox value={item.vendorMemberId} />
                        </div>
                      </div>
                    </div>
                  ))}
                </Checkbox.Group>
                {IntegralList.length === 0 && (
                  <span>{translate('web.resource.order.dangqianshangchenghaimeijifenyouhui')}</span>
                )}
              </div>
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default CouponSelect
