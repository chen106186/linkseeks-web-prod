import React, { useState, useEffect } from 'react'
import { Alert, Checkbox, Tabs, message } from 'antd'
import {
  PostOrderMobileCreateLrcListResponse,
  PostMarketingWebCouponListByOrderResponse,
  postMarketingWebCouponListByOrder,
  postOrderMobileCreateLrcList,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { dateFormat, priceFormat } from '@apps/utils'
import { OrderInfoType } from '../types'
import styles from './index.module.less'

interface InvoicePropsType {
  state: boolean
  onChange: Function
  shopId: number | undefined
  orderAmount: string | number
  orderInfo: OrderInfoType
  fnDetermineCallBlack: Function
}

type CouponType = PostMarketingWebCouponListByOrderResponse[0] & {
  onlyId: string
}

const CouponSelect: React.FC<InvoicePropsType> = (props) => {
  const { state, onChange, shopId, orderAmount, orderInfo, fnDetermineCallBlack } = props
  const { TabPane } = Tabs
  const [couponList, setcouponList] = useState<CouponType[]>([])
  const [IntegralList, setIntegralList] = useState<PostOrderMobileCreateLrcListResponse>([])
  const [couponIdListSelect, setCouponIdListSelect] = useState<string[]>([]) // 选中优惠券的Id集合
  const [shouldResetShop, setshouldResetShop] = useState<number>(1) // 是否需要重置商店的选中
  const [shouldShowTips, setShouldShowTips] = useState<number>(0) // 是否需要显示提示语
  const [selectPlatfrom, setSelectPlatfrom] = useState<any>({}) // 选中的平台优惠券
  const [selectShop, setSelectShop] = useState<any>({}) // 选中的店铺优惠券
  const [selectCommodity, setLectCommodity] = useState<any>({}) // 选中的商品优惠券
  const [selectIntegralList, setSelectIntegralList] = useState<any>([]) // 选中的积分优惠券对象
  const [selectIntegralIdList, setSelectIntegralIdList] = useState<any>([]) // 选中的积分优惠券对象Id
  const [hasSelectPlatform, setHasSelectPlatform] = useState(false)
  const translate = getWebIntl()

  /**
   * 获取选中的优惠券
   */
  const fnGetSelectCouponList = () => {
    const callBlackObj: any[] = []
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

    postMarketingWebCouponListByOrder(parmas as any, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        setcouponList(res.data)
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
      platformAmount += item.orderList.reduce((prev, curr) => prev + curr.refPrice * curr.count, 0)
    })
    platformAmount -= allCouponMoney
    const parmas = orderInfo.orderList.map((item: any) => {
      return {
        vendorMemberId: item.memberId,
        vendorRoleId: item.memberRoleId,
        platformAmount,
        memberAmount: fnGetShopPay(item, platformAmount),
      }
    })
    const itemList = {
      itemList: parmas,
    }
    postOrderMobileCreateLrcList(itemList, { ctlType: 'none' }).then((res: any) => {
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
  const fnPlatfromCoupon = (indexId: number, item: CouponType) => {
    if (!selectPlatfrom.onlyId) {
      if (!verifyUseConditionMoney(item)) {
        message.error('剩余金额不满足优惠卷使用条件')
        return
      }
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
      message.error(translate('web.resource.mall.pingtaiyouhuiquanzhinengshiyongyizhang'))
    }
  }

  /**
   *  商店通用优惠券的选择
   * @param indexId 当前选中优惠券的id在所有选中的下的坐标
   * @param item
   */
  const fnShopCoupon = (indexId: number, item: CouponType) => {
    const selectShopDesc = { ...selectShop } // 商城通用优惠券
    const keyName = `shopId_${item.memberId}_${item.roleId}`
    if (!selectShopDesc[keyName]) {
      if (!verifyUseConditionMoney(item)) {
        message.error(translate('web.resource.mall.shengyujinebumanzuyouhiuquanshiyongtiaojian'))
        return
      }
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
      message.error(translate('web.resource.mall.shangdiantongyongyouhuiquanzhinengshiyongyizhang'))
    } else {
      // 这个商店通用是因为选择了商品优惠券
      message.error(translate('web.resource.mall.shangdiantongyongyouhuiquanheshangpinyouhuiquanzhinengshiyongyizhong'))
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
      message.error(translate('web.resource.mall.shangidantongyonyouhuiheshangpinyouhui'))
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
        message.error(translate('web.resource.mall.tongyishangpinyijingxuanzeleyouhuiquan'))
        return
      }
      if (!verifyUseConditionMoney(item)) {
        message.error('剩余金额不满足优惠卷使用条件')
        return
      }
      item.selectSkuId = skuIdName
      selectCommodityDesc[skuIdName] = item // 设置商品优惠券选择
      selectShopDesc[keyName] = {} // 因为选中商品优惠券，不能选商店通用 所以来占坑
      couponIdListSelect.push(item.onlyId) // 选中优惠券
      setCouponIdListSelect([...couponIdListSelect])
      setSelectShop({ ...selectShopDesc })
      setLectCommodity(selectCommodityDesc)
    }
  }

  /** 校验 剩余金额是否满足优惠卷使用条件 */
  const verifyUseConditionMoney = (item: CouponType): boolean => {
    // const callBlackObj = fnGetSelectCouponList()

    if (couponIdListSelect.length === 0) {
      return true
    }

    return Number(orderAmount) >= item.useConditionMoney
  }

  /**
   * 修改选中优惠券
   * @param item 当前优惠券
   */
  const fnSelectConpon = (item: CouponType) => {
    const indexId = couponIdListSelect.indexOf(item.onlyId)
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
          message.error(translate('web.resource.mall.huiyuanjifenhepingtaijifenbukeyi'))
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
      message.error(translate('web.resource.mall.huiyuanjifenhepingtaijifenbukeyi'))
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
          <span>{translate('web.resource.mall.shiyongyouhuiquanjifen')}</span>
          {state ? (
            <CaretDownOutlined onClick={handleStateChange} className={styles.common_title_icon} />
          ) : (
            <CaretRightOutlined onClick={handleStateChange} className={styles.common_title_icon} />
          )}
        </div>
        {state && (
          <Tabs defaultActiveKey="1" onTabClick={fnChangeTabs}>
            <TabPane tab={translate('web.resource.mall.coupon')} key="1">
              {shouldShowTips !== 1 && (
                <Alert
                  key={shouldShowTips}
                  description={translate('web.resource.mall.ninyijingqiehuanyouhuiguizexuyaochongxinxuanze')}
                  type="warning"
                  closable
                  style={{ padding: '5px 15px', alignItems: 'center' }}
                />
              )}
              <div className={styles.raido_group}>
                <Checkbox.Group className={styles.coupon_list} value={couponIdListSelect}>
                  {couponList.map((item, index) => (
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
                          {translate('web.resource.marketing.manmoneyjiandenomination', {
                            money: item.useConditionMoney,
                            denomination: item.denomination,
                          })}
                        </div>
                        <div className={styles.coupon_range}>
                          {dateFormat(new Date(item.validTimeStart), 'YYYY-MM-DD')}
                          {translate('web.common.zhi')}
                          {dateFormat(new Date(item.validTimeEnd), 'YYYY-MM-DD')}
                        </div>
                        <div className={styles.coupon_type}>
                          [
                          {item.belongType === 1
                            ? translate('web.resource.mall.pingtaiyouhuiquan')
                            : translate('web.resource.mall.shangjiayouhuiquan')}
                          ]
                          <Checkbox value={item.onlyId} />
                        </div>
                      </div>
                    </div>
                  ))}
                </Checkbox.Group>
                {couponList.length === 0 && <span>{translate('web.resource.mall.nindangqianmeiyouyouhuiquan')}</span>}
              </div>
            </TabPane>
            <TabPane tab={translate('web.resource.mall.integral')} key="2">
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
                          {translate('web.resource.marketing.bendankeshiyongjifen', { enablePoint: item.enablePoint })}
                        </div>
                        <div className={styles.integral_range}>
                          {translate('web.resource.marketing.bendankediyongyuan', {
                            money: item.enableDeductionAmount,
                          })}
                        </div>
                        <div className={styles.integral_type}>
                          [{item.relType === 0 ? translate('web.resource.mall.pingtaitongyongjifen') : item.vendorName}
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
