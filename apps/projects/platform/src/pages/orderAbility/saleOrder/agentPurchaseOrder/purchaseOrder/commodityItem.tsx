import { Checkbox, Empty, message, Modal, Popover, Spin, Button } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import styles from './index.less'
import { Link } from '@linkseeks/router-core'
import { fnGetActivityTips } from './callBlackTips'
import { CaretDownOutlined, RightOutlined } from '@ant-design/icons'
import InputNumber from '../components/InputNumber'
import { getMarketingWebAgentCouponListByShop, postMarketingWebAgentCouponReceive } from '@apps/apis'
import { priceFormat, numFormat } from '../utils/numFormat'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const CommodityItem: React.FC<any> = (props) => {
  let countState = true
  const {
    newShop,
    orderList,
    setOrderList,
    checkedList,
    setCheckedList,
    setIndeterminate,
    setCheckAll,
    computeItemPrice,
    mallId,
    deleteListItems,
    saveOrUpdatePurchase,
    deletePurchase,
    buyerInfo,
    setShouldInitPrice,
    getAllKeys,
  } = props
  const intl = useIntl()
  const [initShop, setInitShop] = useState<any>({})
  const [showIsLoading, setShowIsLoading] = useState(true)
  const [couponList, setcouponList] = useState([]) // 优惠券列表
  const [activityList, setActivityList] = useState([]) // 更多活动的列表
  const [activityCommodity, setActivityCommodity] = useState([]) // 当前更多活动的商品

  const getDetailLink = (info: any) => {
    return `/orderAbility/saleOrder/agentPurchaseOrder/commodityDetail?id=${info.purchaseSkuResp.commodity.id}`
  }

  const checkListItemIsRight = (list: any[]): boolean => {
    return list.every((item) => item.purchaseSkuResp.commodity.priceType !== 1 || !item.isPublish)
  }

  const onCheckChildAllChange = (e: any, id: number) => {
    const result = orderList.map((item: any) => {
      if (item.id === id) {
        return e.target.checked
          ? Object.assign(item, { checkedList: item.defaultCheckedList })
          : Object.assign(item, { checkedList: [] })
      } else {
        return item
      }
    })
    setOrderList(result)
  }

  const fnInitPackageData = (item: any, list: any[], operationId: number) => {
    let skuId = ''
    let setMealId = ''
    let canBuy = true
    item.orderList.forEach((second: any) => {
      if (second.id === operationId && second.goodsCartResponse?.activityType === 15) {
        // 15为套餐商品
        skuId = second.purchaseSkuResp.id
        setMealId = second.setMealId
      }
    })
    if (!skuId) {
      return list
    }
    item.orderList.forEach((second: any) => {
      if (second.parentSkuId === skuId && setMealId === second.setMealId) {
        if (!second.isPublish) {
          canBuy = false
        }
        // 套餐商品的子商品
        if (list.includes(operationId)) {
          // 还存在即说明是选中
          list.push(second.id)
        } else {
          const index = list.indexOf(second.id)
          if (index > -1) {
            list.splice(index, 1)
          }
        }
        // skuId = second.purchaseSkuResp.id
      }
    })
    if (!canBuy) {
      message.error('当前套餐已失效')
      return []
    }
    return list
  }

  const handleChildGroupChange = (listDesc: any[], id: number, checkedListDesc: number[]) => {
    let flag = false
    setCheckAll(false)
    let list = [...listDesc]
    let operationId = 0 // 进行操作的id
    if (checkedListDesc.length > list.length) {
      // 是取消选中了
      console.log('取消选中')
      const configList = checkedListDesc.filter((item) => {
        // 整理出来取消选中的那一箱
        return list.every((itemB) => {
          return itemB !== item
        })
      })
      operationId = configList[configList.length - 1]
    } else {
      // 是选中操作
      console.log('选中')
      operationId = list[list.length - 1]
    }

    const result = orderList.map((item: any) => {
      if (item.id === id) {
        list = fnInitPackageData(item, list, operationId) // 判断是否为套餐商品 连同将子商品一并选上
        console.log(list)
        if (list.length === item.defaultCheckedList.length && list.length !== 0) {
          const temp = [...checkedList, id]
          const tempDesc = Array.from(new Set(temp)) // 暴力测试的时候 会有重复的
          setCheckedList(tempDesc)
          if (tempDesc.length === getAllKeys().length && tempDesc.length !== 0) {
            setIndeterminate(false)
            setCheckAll(true)
          }
        } else {
          flag = true
        }
        return Object.assign(item, { checkedList: list })
      } else {
        return item
      }
    })
    setOrderList(result)
    if (flag) {
      setIndeterminate(true)
    }
    if (list.length === 0) {
      const index = checkedList.indexOf(id)
      checkedList.splice(index, 1)
      setCheckedList(checkedList)
      if (checkedList.length === 0) {
        setIndeterminate(false)
      }
    }
  }

  // const deleteItem = (id: number) => {
  //   const headers = {
  //     shopId: mallId
  //   }

  //   postProductShopPurchaseDeletePurchase({ idList: [id] }, { headers }).then(res => {
  //     message.destroy()
  //     if (res.code === 1000) {
  //       // fetchPurchaseList()
  //       deleteListItems([id])
  //     }
  //   })
  // }

  /**
   * 删除购物车的商品
   * @param id
   */
  const handleDeleteItem = (item) => {
    if (!item.isMain && item.parentSkuId) {
      message.error('套餐的副商品不允许删除')
      return
    }
    Modal.confirm({
      centered: true,
      className: styles.mallComfirm,
      content: intl.formatMessage({ id: 'purchaseOrder.index.RemoveItem' }),
      okText: intl.formatMessage({ id: 'enquiryOffer.index.Sure' }),
      cancelText: intl.formatMessage({ id: 'enquiryOffer.index.Cancel' }),
      onOk: () => {
        return new Promise((resolve, reject) => {
          deletePurchase([item.id])
            .then((res) => {
              if (res) {
                deleteListItems([item.id])
                resolve(true)
              } else {
                reject()
              }
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  /**
   * 修改购买数量
   * @param count
   * @param childItem
   */
  const handleCountChange = async (countDesc: number, childItem: any, type: string) => {
    let count = countDesc
    if (childItem?.goodsCartResponse?.topActivityDetail?.activityType === 8) {
      // 为8的时候 是组合商品 不能小数
      count = Math.floor(count)
    }
    handleChangeFinishCount(count, childItem.id)
    setShouldInitPrice(false)
    if (type === 'click' || type === 'blur') {
      setShouldInitPrice(true)
      if (countState && saveOrUpdatePurchase) {
        countState = false
        const res = await saveOrUpdatePurchase({
          purchaseId: childItem.id,
          skuId: childItem.purchaseSkuResp.id,
          count: Number(count),
          showMsg: false,
        })
        if (res) {
          countState = true
        } else {
          countState = true
        }
      }
    }
  }

  /**
   * 修改商品购买数量
   * @param count
   * @param id
   */
  const handleChangeFinishCount = (count: number, id: number) => {
    const result = orderList.map((item: any) => {
      item.orderList = item.orderList.map((childItem: any) => {
        if (childItem.id === id) {
          childItem.count = count
        }
        return childItem
      })
      return item
    })
    setOrderList(result)
  }

  /**
   * 初始化商店的商品数据,以活动作为区分
   */
  const fnInitActivity = () => {
    const descObjActivity: any = {}
    console.log(newShop, 'newShopnewShop')
    newShop.orderList.map((thisCommodity: any) => {
      if (thisCommodity?.goodsCartResponse?.topActivityDetail) {
        const topActivityDetail = thisCommodity?.goodsCartResponse?.topActivityDetail
        let key = `activity${topActivityDetail.belongType}_${topActivityDetail.activityType}`
        if (topActivityDetail.activityType === 15) {
          // 套餐活动可能多个 所以再加上套餐的groundId ps setMealId 就是 groundId
          key = `${key}_${thisCommodity.setMealId}_${thisCommodity.purchaseSkuResp.id}`
        }
        if (descObjActivity[key]) {
          descObjActivity[key].push(thisCommodity)
        } else {
          descObjActivity[key] = [thisCommodity]
        }
      } else {
        if (!thisCommodity.isMain && thisCommodity.parentSkuId) {
          Object.keys(descObjActivity).forEach((key) => {
            const keys = key.split('_')
            const parentSkuId = keys[keys.length - 1]
            const groundId = keys[keys.length - 2]
            if (`${groundId}_${parentSkuId}` === `${thisCommodity.setMealId}_${thisCommodity.parentSkuId}`) {
              descObjActivity[key].push(thisCommodity)
            }
          })
          return
        }
        if (!descObjActivity.unActivity) {
          descObjActivity.unActivity = [thisCommodity]
        } else {
          descObjActivity.unActivity.push(thisCommodity)
        }
      }
    })
    setInitShop(descObjActivity)
  }

  const fnJumpCollectOrder = (newActivity: any, thisCommodity: any) => {
    history.push(
      `/orderAbility/saleOrder/agentPurchaseOrder/activityMakeUp?id=${newActivity.activityId}&belongType=${newActivity.belongType}&skuId=${thisCommodity.id}`,
    )
  }

  const fnJumpFreeShippingtOrder = () => {
    history.push(`/orderAbility/saleOrder/agentPurchaseOrder/commodity?carriageType=2`)
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 满额促销返回dom
   */
  const fnGetFullDom = (thisCommodity: any, newActivity: any, activityDetails: any) => {
    return (
      <div className={styles['card-tips-warp']}>
        <div className={styles.box}>
          <div className={styles['full-minus']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchaseOrder.biaoqianbuzai', defaultMessage: '标签不在' })}
          </div>
          <div className="discount-content ellipsis">
            <span className="font12">{fnGetActivityTips(newActivity)}</span>
            <span
              className={styles['jump-collect-order']}
              onClick={() => {
                fnJumpCollectOrder(newActivity, thisCommodity)
              }}
            >
              {intl.formatMessage({ id: 'purchaseOrder.qucoudan', defaultMessage: '去凑单' })}{' '}
              <RightOutlined translate={undefined} />{' '}
            </span>
          </div>
        </div>
        {activityDetails?.length > 0 && (
          <Popover
            content={moreDiscountDom}
            onVisibleChange={(state) => fnShowMoreActivity(state, activityDetails, thisCommodity)}
            title={intl.formatMessage({ id: 'purchaseOrder.gengduoyouhui', defaultMessage: '更多优惠' })}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-activity']}>
              {intl.formatMessage({ id: 'purchaseOrder.gengduoyouhui', defaultMessage: '更多优惠' })}
              <CaretDownOutlined className={styles.search_type_item_icon} translate={undefined} />
            </div>
          </Popover>
        )}
      </div>
    )
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 返回赠品的dom
   */
  const fnGetGiftDom = (thisCommodity: any, newActivity: any) => {
    let giftList: any[] = []
    let newLimit = 0
    newActivity.ladders.forEach((item: any) => {
      if (item.limitValue <= thisCommodity.count && newLimit < item.limitValue) {
        newLimit = item.limitValue
        giftList = item.list
      }
    })
    if (newLimit === 0) {
      return <div />
    }
    return (
      <div className={styles['card-tips-warp']}>
        <div className="box">
          <span className={styles['full-minus']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchaseOrder.biaoqianbuzai', defaultMessage: '标签不在' })}
          </span>
        </div>
        <div className="discount-main">
          {giftList.map((item: any) => (
            <div className="discount-warp">
              <div className="discount-content ellipsis">
                <span className="font12">
                  {`${intl.formatMessage({
                    id: 'purchaseOrder.man',
                    defaultMessage: '满',
                  })}${newLimit}${intl.formatMessage({ id: 'purchaseOrder.jian', defaultMessage: '件' })}，${
                    newActivity.activityType === 6
                      ? intl.formatMessage({ id: 'purchaseOrder.zengsong', defaultMessage: '赠送' })
                      : intl.formatMessage({ id: 'purchaseOrder.huangou', defaultMessage: '换购' })
                  }${item.productName}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 直降促销
   * @activityDetails 更多活动
   */
  const fnGetDescentDom = (newActivity: any, activityDetails: any) => {
    return (
      <div className={styles['card-tips-warp']}>
        <div className={styles.box}>
          <span className={styles['full-minus']}>
            {newActivity.preferentialTag ||
              intl.formatMessage({ id: 'purchaseOrder.biaoqianbuzai', defaultMessage: '标签不在' })}
          </span>
          <div className="discount-content">
            {newActivity.preferentialTagDescs?.map((tips: string) => {
              return <span key={tips}>{tips}</span>
            })}
          </div>
        </div>
        {activityDetails?.length > 0 && (
          <Popover
            content={showIsLoading ? loadingDom : couponListDom}
            title={intl.formatMessage({ id: 'purchaseOrder.youhuiquanlingqu', defaultMessage: '优惠券领取' })}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-activity']}>
              {intl.formatMessage({ id: 'purchaseOrder.gengduoyouhui', defaultMessage: '更多优惠' })}
              <CaretDownOutlined className={styles.search_type_item_icon} translate={undefined} />
            </div>
          </Popover>
        )}
      </div>
    )
  }

  const fnGetDomItemClass = (childItem: any, checkedListDesc?: number[]) => {
    // (.parentSkuId)?styles.order_list_item_package:styles.order_list_item
    if (childItem.parentSkuId || childItem.goodsCartResponse?.activityType === 15) {
      if (checkedListDesc?.includes(childItem.id)) {
        return styles.package_main
      }
      return styles.package_main_un
    }
    return styles.package_main_un
  }
  const fnGetGroundPrice = (childItem: any, type: string, checkedList?: number[]) => {
    let callPrice = 0
    console.log(childItem, 'childItem')
    console.log(type, 'type')
    console.log(checkedList, 'checkedList')
    if (childItem.isMain && childItem.goodsCartResponse?.activityType === 15) {
      if (checkedList?.includes(childItem.id)) {
        callPrice = childItem[type] || 0
        return callPrice
      }
    }
    return callPrice
  }

  /**
   * @param newCommodity 当前的商品
   * @param newActivity 当前活动
   * @param newAddress 在顶部活动还是底部活动
   * @returns 返回活动提示语
   */
  const fnGetDom = (
    newCommodity: any,
    topActivityDetail: any,
    activityDetails?: any,
    checkedListDesc?: number[],
    defaultCheckedListDesc?: number[],
  ) => {
    // const { topActivityDetail, activityDetails } = newActivity;
    if (!topActivityDetail || !topActivityDetail.activityId) {
      return <div />
    }
    // // 满额促销 满量促销
    if (topActivityDetail.activityType === 4 || topActivityDetail.activityType === 5) {
      return fnGetFullDom(newCommodity, topActivityDetail, activityDetails)
    }
    // // 赠送促销
    if (topActivityDetail.activityType === 6) {
      return fnGetGiftDom(newCommodity, topActivityDetail)
    }
    // // 换购
    if (topActivityDetail.activityType === 13) {
      return fnGetGiftDom(newCommodity, topActivityDetail)
    }
    // // 满额促销 满量促销
    if (topActivityDetail.activityType === 7) {
      return fnGetFullDom(newCommodity, topActivityDetail, activityDetails)
    }
    // // @returns 直降促销
    if (
      topActivityDetail.activityType === 1 ||
      topActivityDetail.activityType === 2 ||
      topActivityDetail.activityType === 3 ||
      topActivityDetail.activityType === 8
    ) {
      return fnGetDescentDom(topActivityDetail, activityDetails)
    }
    if (topActivityDetail.activityType === 15) {
      return (
        <div className={fnGetDomItemClass(newCommodity, checkedListDesc)}>
          <div className={cx(styles.order_list_item_item, styles.checked, styles.package_warp)}>
            <Checkbox
              disabled={
                newCommodity.purchaseSkuResp.commodity.priceType !== 1 ||
                !newCommodity.isPublish ||
                newCommodity.parentSkuId
              }
              value={newCommodity.id}
              className="common-checkbox"
            />
            <span className={styles.package_title}>套餐商品</span>
            {!defaultCheckedListDesc?.includes(newCommodity.id) && (
              <span style={{ color: '#91959B', fontSize: '14px' }}>(当前套餐已失效)</span>
            )}
          </div>
          {fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedListDesc) > 0 && (
            <div>
              <div className={styles.mealPriceWarp}>
                套餐总价:{' '}
                <b className={styles.mealPrice}>¥{fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedListDesc)}</b>
              </div>
              <div className={styles.alreadlyLess}>
                已减{fnGetGroundPrice(newCommodity, 'saleTotalAmount', checkedListDesc)}
              </div>
            </div>
          )}
          {fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedListDesc) <= 0 && (
            <div>
              <Button
                style={{ color: '#91959B', fontSize: '14px' }}
                type="link"
                className={styles.order_list_item_item_operation_item}
                onClick={() => handleDeleteItem(newCommodity.id)}
              >{`${intl.formatMessage({ id: 'order.index.invoice.delete' })}${intl.formatMessage({
                id: 'purchaseOrder.taocanshangpin',
                defaultMessage: '套餐商品',
              })}`}</Button>
            </div>
          )}
        </div>
      )
    }

    return <div />
  }

  /**
   * 更多活动列表
   */
  const moreDiscountDom = (
    <ul className={styles['coupon-main']}>
      {activityList.map((item: number) => {
        return (
          <li className={styles['coupon-warp']} key={`${item}coupon`}>
            {fnGetDom(activityCommodity, item)}
          </li>
        )
      })}
    </ul>
  )

  const fnShowMoreActivity = (state: boolean, activityDetails: any, thisCommodity: any) => {
    if (state) {
      setActivityCommodity(thisCommodity)
      setActivityList(activityDetails)
    }
  }

  /**
   * 获取优惠券列表
   */
  const fnetCouponList = () => {
    const parmas = {
      shopId: mallId,
      memberId: newShop.memberId,
      roleId: newShop.memberRoleId,
    }

    const headers: any = {
      agentMemberId: buyerInfo?.memberId,
      agentRoleId: buyerInfo?.roleId,
    }

    getMarketingWebAgentCouponListByShop(parmas, { headers }).then((res) => {
      setShowIsLoading(false)
      if (res.code === 1000) {
        setcouponList(res.data)
      }
    })
  }

  /**
   * @param item 当前优惠券
   * @returns 领取优惠券
   */
  const fnGetCoupon = (item: any) => {
    if (item.completeReceive === 3) {
      // const params = {
      //   couponId: item.couponId,
      //   belongType: item.belongType,
      // }
      // Router.navigateTo('commodityMerge/stocksSourcing/conponSimilarList', params);
      return
    }
    if (item.completeReceive !== 2) {
      return
    }
    const parmas = {
      shopId: mallId,
      belongType: item.belongType,
      couponId: item.couponId,
    }
    const headers: any = {
      agentMemberId: buyerInfo?.memberId,
      agentRoleId: buyerInfo?.roleId,
    }
    postMarketingWebAgentCouponReceive(parmas, { headers }).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        message.success(intl.formatMessage({ id: 'purchaseOrder.lingquchenggong', defaultMessage: '领取成功' }))
        item.completeReceive = 3
        setcouponList([...couponList])
        // fnetCouponList();
      } else {
        message.destroy()
        // Toast.show({ title: res.message, icon: 'none' });
        message.error(res.message)
      }
    })
  }

  /**
   * 优惠券列表dom
   */
  const couponListDom = (
    <ul className={styles['coupon-main']}>
      {couponList.length > 0 ? (
        couponList.map((item: any) => {
          return (
            <li className={styles['coupon-warp']} key={`${item.id}coupon`}>
              <div className={styles.box}>
                <div className={styles['coupon-left-money']}>¥{item.denomination}</div>
                <div className={styles['coupon-content-warp']}>
                  <div className={styles['coupon-content-title']}>{item.name}</div>
                  <div className={styles['coupon-content-tips']}>
                    {intl.formatMessage({ id: 'purchaseOrder.man', defaultMessage: '满' })}
                    {item.useConditionMoney}
                    {intl.formatMessage({ id: 'purchaseOrder.jian', defaultMessage: '减' })}
                    {item.denomination}
                  </div>
                </div>
              </div>
              <div
                className={item.completeReceive === 2 ? styles['coupon-right-btn'] : styles['coupon-right-btn-un']}
                onClick={() => {
                  fnGetCoupon(item)
                }}
              >
                {intl.formatMessage({ id: 'purchaseOrder.lingqu', defaultMessage: '领取' })}
              </div>
            </li>
          )
        })
      ) : (
        <div className={styles['loading-warp']}>
          <Empty />
        </div>
      )}
    </ul>
  )
  /**
   * 加载中的dom
   */
  const loadingDom = (
    <div className={styles['loading-warp']}>
      <Spin tip="正在加载" />
    </div>
  )

  /**
   *
   * @param state 优惠券显示的状态
   * 优惠券显示的弹窗回调
   */
  const fnGetCouponListDom = (state: boolean) => {
    if (state) {
      setShowIsLoading(true)
      fnetCouponList()
    }
  }

  useEffect(() => {
    fnInitActivity()
  }, [newShop])

  const fnShouldShowFerr = () => {
    if (!newShop.orderAmount) {
      return false
    }
    let shouldShow = false
    newShop.orderList.forEach((item: any) => {
      if (item?.purchaseSkuResp?.commodity?.logistics?.carriageType === 2) {
        shouldShow = true
      }
    })
    return shouldShow
  }
  const fnGetItemClass = (childItem: any, checkedListDesc: number[]) => {
    if (childItem.parentSkuId || childItem.goodsCartResponse?.activityType === 15) {
      if (checkedListDesc.includes(childItem.id)) {
        return styles.order_list_item_package
      }
      return styles.order_list_item_package_un
    }
    return styles.order_list_item
  }

  return (
    <div className={styles.order_list}>
      <div className={styles['title-warp']}>
        <div className={styles.order_list_shop_name}>
          <Checkbox
            value={newShop.id}
            disabled={checkListItemIsRight(newShop.orderList)}
            indeterminate={
              !!newShop.checkedList.length &&
              newShop.checkedList.length < newShop.defaultCheckedList.length &&
              newShop.checkedList.length > 0
            }
            onChange={(e) => onCheckChildAllChange(e, newShop.id)}
          />
          <div className={styles['shop-name-warp']}>
            <label>{newShop.shopname}</label>
            {fnShouldShowFerr() && (
              <div className={styles['shop-shipping-free']}>
                {translate('web.resource.order.dingdanmanbaoyou', {
                  money: `${translate('web.common.currencySymbol')}${priceFormat(newShop.orderAmount)}`,
                })}
                {newShop.orderAmount - newShop.unFreeShipping > 0 && (
                  <>
                    <span>
                      , {intl.formatMessage({ id: 'purchaseOrder.not.bad', defaultMessage: '还差' })} ¥{' '}
                      {priceFormat(newShop.orderAmount - newShop.unFreeShipping)}
                    </span>
                    <span
                      className={styles['shop-shipping-free-go']}
                      onClick={() => {
                        fnJumpFreeShippingtOrder()
                      }}
                    >
                      {intl.formatMessage({ id: 'purchaseOrder.qucoudan', defaultMessage: '去凑单' })}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {couponList.length > 0 && (
          <Popover
            content={showIsLoading ? loadingDom : couponListDom}
            onVisibleChange={(state) => fnGetCouponListDom(state)}
            title={intl.formatMessage({ id: 'purchaseOrder.youhuiquanlingqu', defaultMessage: '优惠券领取' })}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-coupon']}>
              {intl.formatMessage({ id: 'purchaseOrder.youhuiquan', defaultMessage: '优惠券' })}
              <CaretDownOutlined className={styles.search_type_item_icon} color="#EF3346" translate={undefined} />
            </div>
          </Popover>
        )}
      </div>
      <Checkbox.Group
        value={newShop.checkedList}
        onChange={(list) => handleChildGroupChange(list, newShop.id, newShop.checkedList)}
        style={{ display: 'block' }}
      >
        {Object.keys(initShop).map((key: string) => {
          return initShop[key].map((childItem: any, childIndex: number) => {
            return (
              <Fragment key={`${childItem.purchaseSkuResp.id}_${childIndex}`}>
                {childItem.goodsCartResponse && childItem.goodsCartResponse.topActivityDetail && (
                  <div>
                    {fnGetDom(
                      childItem,
                      childItem.goodsCartResponse.topActivityDetail,
                      childItem.goodsCartResponse.activityDetails,
                      newShop.checkedList,
                      newShop.defaultCheckedList,
                    )}
                  </div>
                )}
                <div className={fnGetItemClass(childItem, newShop.checkedList)}>
                  <div className={cx(styles.order_list_item_item, styles.checked)}>
                    <Checkbox
                      disabled={
                        childItem.purchaseSkuResp.commodity.priceType !== 1 ||
                        !childItem.isPublish ||
                        childItem.parentSkuId
                      }
                      value={childItem.id}
                      className="common-checkbox"
                    />
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.goods_info)}>
                    <div
                      className={cx(styles.order_list_item_item_imgbox, !childItem.isPublish ? styles.offShelf : {})}
                    >
                      <img width={80} height={80} src={childItem.purchaseSkuResp.commodity.mainPic} />
                      {!childItem.isPublish && (
                        <div className={styles.off_shelf_tip}>
                          {intl.formatMessage({ id: 'purchaseOrder.index.Removed' })}
                        </div>
                      )}
                    </div>
                    <div className={styles.order_list_item_item_main}>
                      <div
                        className={cx(styles.order_list_item_item_name, !childItem.isPublish ? styles.offShelf : {})}
                      >
                        <Link to={getDetailLink(childItem)}>{childItem.purchaseSkuResp.commodity.name}</Link>
                      </div>
                      <div className={styles.order_list_item_item_category}>
                        {childItem.purchaseSkuResp.commoditySkuAttributeList &&
                          childItem.purchaseSkuResp.commoditySkuAttributeList.map((attrItem: any, index: number) => (
                            <div
                              className={styles.order_list_item_item_attr}
                              key={`${childItem.purchaseSkuResp.id}_${index}`}
                            >
                              {attrItem.customerAttribute.name}：{attrItem.customerAttributeValue?.value}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.unitprice)}>
                    {childItem.purchaseSkuResp?.priceRange &&
                      childItem.purchaseSkuResp?.priceRange.length > 0 &&
                      childItem.purchaseSkuResp?.priceRange.map((rangItem: any) => (
                        <div
                          key={`unitprice-${childItem.purchaseSkuResp.id}_${rangItem.rang}`}
                          className={styles.order_list_item_item_unitprice}
                        >
                          <span>
                            {childItem.purchaseSkuResp?.priceRange.length > 1 &&
                              `${rangItem.range} ${childItem.purchaseSkuResp.commodity.unitName}：`}{' '}
                            {rangItem.price}
                          </span>
                        </div>
                      ))}
                    {childItem.purchaseSkuResp.commodity.priceType === 2 && (
                      <div className={styles.tip}>{intl.formatMessage({ id: 'purchaseOrder.index.inquiryItem' })}</div>
                    )}
                    {childItem.purchaseSkuResp.refPrice &&
                      (childItem.goodsCartResponse || childItem.parentSkuId) &&
                      newShop.checkedList.indexOf(childItem.id) >= 0 && (
                        <div className={styles.tip}>
                          {intl.formatMessage({
                            id: 'purchaseOrder.yugudaoshoujiage',
                            defaultMessage: '预估到手价格: ¥',
                          })}{' '}
                          {priceFormat(childItem.purchaseSkuResp.refPrice)}
                        </div>
                      )}
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.count)}>
                    {
                      <InputNumber
                        max={childItem.parentSkuId ? childItem.count : childItem.stockCount || 0}
                        min={
                          childItem.parentSkuId ? childItem.count : childItem.purchaseSkuResp.commodity.minOrder || 1
                        }
                        disabled={childItem.stockCount === 0 || childItem.parentSkuId}
                        value={childItem.count}
                        onChange={(value: number, type: string) => handleCountChange(value, childItem, type)}
                      />
                    }

                    <div className={styles.stock}>
                      <span>
                        ({intl.formatMessage({ id: 'pay.pointsMall.stock' })}
                        {numFormat(childItem.stockCount)}
                        {childItem.purchaseSkuResp.commodity.unitName})
                      </span>
                    </div>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.amount)}>
                    <span className={styles.order_list_item_item_price}>
                      {priceFormat(computeItemPrice(childItem.purchaseSkuResp, childItem.count, 1))}
                    </span>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.opration)}>
                    <div className={styles.order_list_item_item_operation}>
                      {childItem.purchaseSkuResp.commodity.priceType === 2 && (
                        <Link className={styles.order_list_item_item_operation_item} to={getDetailLink(childItem)}>
                          {intl.formatMessage({ id: 'purchaseOrder.index.ToInquire' })}
                        </Link>
                      )}
                      {!childItem.setMealId && (
                        <div
                          className={styles.order_list_item_item_operation_item}
                          onClick={() => handleDeleteItem(childItem)}
                        >
                          {intl.formatMessage({ id: 'order.index.invoice.delete' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })
        })}
      </Checkbox.Group>
    </div>
  )
}

export default CommodityItem
