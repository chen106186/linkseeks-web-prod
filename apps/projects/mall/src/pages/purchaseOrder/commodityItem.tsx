import { Checkbox, Empty, message, Modal, Popover, Spin, Row, Col, Button } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import {
  postProductShopCommodityCollectSaveCommodityCollect,
  postProductShopPurchaseDeletePurchase,
  postProductShopPurchaseSaveOrUpdatePurchase,
  getMarketingWebCouponListByShop,
  postMarketingMobileCouponReceive,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { CaretDownOutlined, RightOutlined, CaretUpOutlined } from '@ant-design/icons'
import { LinkTo } from '@/utils'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import { numFormat, priceFormat } from '@apps/utils'
import InputNumber from '@/components/InputNumber'
import { fnGetActivityTips } from './callBlackTips'
import styles from './index.module.less'
import { MARKETING_ACTIVITY_TYPE } from '@/constants/marketing'
import useLink from '@/hooks/useLink'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'

const SHOW_COUNT = 2

const CommodityItem: React.FC<any> = (props) => {
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
    setShouldInitPrice,
    isMro,
    getAllKeys,
  } = props
  const { layoutType } = useGlobalConext()
  const translate = getWebIntl()
  const [initShop, setInitShop] = useState<any>({})
  const [showIsLoading, setShowIsLoading] = useState(true)
  const [couponList, setcouponList] = useState<any[]>([]) // 优惠券列表
  const [activityList, setActivityList] = useState([]) // 更多活动的列表
  const [activityCommodity, setActivityCommodity] = useState([]) // 当前更多活动的商品
  const [expandObj, setExpandObj] = useState<any>({})
  const { linkPrefix } = useLink()
  const { countModifyState } = usePurchaseOrderContext()

  const getDetailLink = (info: any) => {
    if (layoutType === LAYOUT_TYPE.own) {
      return linkPrefix(`/commodity/detail/${info.purchaseSkuResp.commodity.id}?skuId=${info.purchaseSkuResp.id}`)
    } else {
      return linkPrefix(
        `/shop/${info.purchaseSkuResp.commodity.storeId}/commodity/detail/${info.purchaseSkuResp.commodity.id}?skuId=${info.purchaseSkuResp.id}`,
      )
    }
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
      // operationId = list[list.length -1];
      if (
        second.id === operationId &&
        (second.goodsCartResp?.activityType === 15 || second.goodsCartResp?.activityType === 13)
      ) {
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
        // 套餐商品的子商品
        if (!second.isPublish) {
          canBuy = false
        }
        if (list.includes(operationId)) {
          // 还存在即说明是选中
          list.push(second.id)
        } else {
          const index = list.indexOf(second.id)
          if (index > -1) {
            list.splice(index, 1)
          }
        }
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
      const configList = checkedListDesc.filter((item) => {
        // 整理出来取消选中的那一箱
        return list.every((itemB) => {
          return itemB !== item
        })
      })
      operationId = configList[configList.length - 1]
    } else {
      // 是选中操作
      operationId = list[list.length - 1]
    }
    const result = orderList.map((item: any) => {
      if (item.id === id) {
        list = fnInitPackageData(item, list, operationId) // 判断是否为套餐商品 连同将子商品一并选上
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

  const deleteItem = (id: number) => {
    const headers = {
      shopId: mallId,
    }

    postProductShopPurchaseDeletePurchase({ idList: [id] }, { headers }).then((res) => {
      message.destroy()
      if (res.code === 1000) {
        // fetchPurchaseList()
        deleteListItems([id])
      }
    })
  }

  /**
   * 删除购物车的商品
   * @param id
   */
  const handleDeleteItem = (id: number) => {
    Modal.confirm({
      centered: true,
      className: styles.mallComfirm,
      content: translate('web.resource.mall.shifoucongjinhuodanzhongyichu'),
      okText: translate('web.common.confirm'),
      cancelText: translate('web.common.cancel'),
      onOk: () => {
        return new Promise((resolve, reject) => {
          const headers = {
            shopId: mallId,
          }

          postProductShopPurchaseDeletePurchase({ idList: [id] }, { headers })
            .then((res) => {
              if (res.code === 1000) {
                deleteListItems([id])
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
  const handleCountChange = (count: number, childItem: any, type: string) => {
    if (childItem?.goodsCartResp?.topActivityDetail?.activityType === 8) {
      // 为8的时候 是组合商品 不能小数
      count = Math.floor(count)
    }
    handleChangeFinishCount(count, childItem.id)
    setShouldInitPrice(false)
    if (type === 'click' || type === 'blur') {
      setShouldInitPrice(true)
      if (countModifyState.current) {
        countModifyState.current = false
        const param: any = {
          id: childItem.id,
          count: Number(count),
        }

        const headers = {
          shopId: mallId,
        }

        postProductShopPurchaseSaveOrUpdatePurchase(param, { headers })
          .then((res) => {
            if (res.code !== 1000) {
              message.destroy()
              message.error(res.message)
            } else {
              message.destroy()
            }
            setTimeout(() => {
              countModifyState.current = true
            }, 100)
          })
          .catch(() => {
            setTimeout(() => {
              countModifyState.current = true
            }, 100)
          })
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

  const handleCollect = (commodityId: number, id: number) => {
    const param: any = {
      commodityId: commodityId,
      type: 1,
    }

    const headers = {
      shopId: mallId,
    }

    postProductShopCommodityCollectSaveCommodityCollect(param, { headers }).then((res: any) => {
      message.destroy()
      message.success(translate('web.resource.mall.yirushoucangjiachenggong'))
      deleteItem(id)
    })
  }

  /**
   * 初始化商店的商品数据,以活动作为区分
   */
  const fnInitActivity = () => {
    const descObjActivity: any = {}
    const sortList = newShop.orderList.sort((a) => (a?.goodsCartResp?.topActivityDetail ? -1 : 1))
    sortList.map((thisCommodity: any) => {
      if (thisCommodity?.goodsCartResp?.topActivityDetail) {
        const topActivityDetail = thisCommodity?.goodsCartResp?.topActivityDetail
        let key = `activity${topActivityDetail.belongType}_${topActivityDetail.activityType}`
        if (topActivityDetail.activityType === 15 || topActivityDetail.activityType === 13) {
          // 套餐活动可能多个 所以再加上套餐的groundId ps setMealId 就是 groundId
          if (thisCommodity.isMain) {
            key = `${key}_${thisCommodity.setMealId}_${thisCommodity.purchaseSkuResp.id}`
          }
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
            const groupId = keys[keys.length - 2]
            if (thisCommodity.setMealId === Number(groupId) && thisCommodity.parentSkuId === Number(parentSkuId)) {
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
    if (newActivity?.activityType === 13) {
      if (layoutType === LAYOUT_TYPE.own) {
        LinkTo(
          linkPrefix(
            `/activityCommodity?spuId=${thisCommodity?.purchaseSkuResp.commodity?.id}&belongType=${newActivity.belongType}&skuId=${thisCommodity.purchaseSkuResp.id}&quantity=${thisCommodity.count}&type=13&activityId=${newActivity.activityId}&scene=purchase`,
          ),
        )
      } else {
        LinkTo(
          linkPrefix(
            `/shop/${thisCommodity?.purchaseSkuResp.commodity?.storeId}/activityCommodity?spuId=${thisCommodity?.purchaseSkuResp.commodity?.id}&belongType=${newActivity.belongType}&skuId=${thisCommodity.purchaseSkuResp.id}&quantity=${thisCommodity.count}&type=13&activityId=${newActivity.activityId}&scene=purchase`,
          ),
        )
      }
    } else {
      LinkTo(
        linkPrefix(
          `/makeUpList/activity/${newActivity.activityId}?belongType=${newActivity.belongType}&skuId=${thisCommodity.purchaseSkuResp.id}`,
        ),
      )
    }
  }

  const fnJumpFreeShippingtOrder = (newShop: {
    id: number
    storeId: number
    memberId: number
    memberRoleId: number
  }) => {
    if (layoutType === LAYOUT_TYPE.own) {
      LinkTo(linkPrefix(`/${newShop.memberId}/commodity?carriageType=2`))
    } else {
      LinkTo(linkPrefix(`/shop/${newShop.storeId}/commodity?carriageType=2`))
    }
  }

  /**
   * @param thisCommodity 当前商品
   * @param newType 当前类型
   * @returns 满额促销返回dom
   */
  const fnGetFullDom = (thisCommodity: any, newActivity: any, activityDetails: any) => {
    return (
      <div className={styles['card-tips-warp']}>
        <div className={styles['box']}>
          <div className={styles['full-minus']}>{newActivity.preferentialTag || ''}</div>
          <div className="discount-content ellipsis">
            <span className="font12">{fnGetActivityTips(newActivity)}</span>
            <span
              className={styles['jump-collect-order']}
              onClick={() => {
                fnJumpCollectOrder(newActivity, thisCommodity)
              }}
            >
              {translate('web.resource.mall.qucoudan')} <RightOutlined translate={undefined} />
            </span>
          </div>
        </div>
        {activityDetails?.length > 0 && (
          <Popover
            content={moreDiscountDom}
            onOpenChange={(state) => fnShowMoreActivity(state, activityDetails, thisCommodity)}
            title={translate('web.resource.mall.gengduoyouhui')}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-activity']}>
              {translate('web.resource.mall.gengduoyouhui')}
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
    const giftList: any[] = []
    newActivity.preferentialTagDescs.forEach((item: any) => {
      giftList.push(item)
    })
    let tips = ''
    giftList.forEach((item: any, index: number) => {
      tips = `${tips}${translate('web.resource.mall.man')}${translate('web.common.currencySymbol')}${item.limit}，${
        newActivity.activityType === 6
          ? translate('web.resource.mall.zengsong')
          : translate('web.resource.mall.huangou')
      }`
      item.items?.forEach((second: any) => {
        tips = `${tips}${second.desc}X${second.num}${index !== giftList.length - 1 ? ';' : ''}`
      })
    })
    return (
      <div className={styles['card-tips-warp']}>
        <div className={styles.box}>
          <span className={styles['full-minus']}>{newActivity.preferentialTag || ''}</span>
          <span className={styles['discount-main']}>{tips}</span>
          {newActivity.activityType === 13 && (
            <span
              className={styles['jump-collect-order']}
              onClick={() => {
                fnJumpCollectOrder(newActivity, thisCommodity)
              }}
            >
              {translate('web.resource.mall.quhuangou')} <RightOutlined translate={undefined} />
            </span>
          )}
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
  const fnGetDescentDom = (newActivity: any, activityDetails: any, newCommodity: any) => {
    return (
      <div className={styles['card-tips-warp']}>
        <div className={styles['box']}>
          <span className={styles['full-minus']}>{newActivity.preferentialTag || ''}</span>
          <div className="discount-content">
            {newActivity.preferentialTagDescs?.map((tips: string) => {
              return <span key={tips}>{tips}</span>
            })}
          </div>
          {newActivity.activityType === 8 && (
            <span
              className={styles['jump-collect-order']}
              onClick={() => {
                fnJumpCollectOrder(newActivity, newCommodity)
              }}
            >
              {translate('web.resource.mall.qucoudan')} <RightOutlined translate={undefined} />
            </span>
          )}
        </div>
        {activityDetails?.length > 0 && (
          <Popover
            content={showIsLoading ? loadingDom : couponListDom}
            title={translate('web.resource.mall.youhuiquanlingqu')}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-activity']}>
              {translate('web.resource.mall.gengduoyouhui')}
              <CaretDownOutlined className={styles.search_type_item_icon} translate={undefined} />
            </div>
          </Popover>
        )}
      </div>
    )
  }

  const fnGetDomItemClass = (childItem: any, checkedList?: number[]) => {
    if (childItem.parentSkuId || childItem.goodsCartResp?.activityType === 15) {
      if (checkedList?.includes(childItem.id)) {
        return styles.package_main
      }
      return styles.package_main_un
    }
    return styles.package_main_un
  }

  const fnGetGroundPrice = (childItem: any, type: string, checkedList?: number[]) => {
    let callPrice = 0
    if (childItem.isMain && childItem.goodsCartResp?.activityType === 15) {
      if (checkedList?.includes(childItem.id)) {
        callPrice = childItem[type] * childItem.count || 0
        if (type === 'saleTotalAmount') {
          callPrice = childItem.saleTotalAmount
        }
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
    checkedList?: number[],
    defaultCheckedList?: number[],
  ) => {
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
      return fnGetDescentDom(topActivityDetail, activityDetails, newCommodity)
    }
    if (topActivityDetail.activityType === 15) {
      return (
        <div className={fnGetDomItemClass(newCommodity, checkedList)}>
          <div className={cx(styles.order_list_item_item, styles.checked, styles.package_warp)}>
            <Checkbox
              disabled={
                newCommodity.purchaseSkuResp.commodity.priceType !== 1 ||
                !newCommodity.isPublish ||
                newCommodity.parentSkuId
              }
              value={newCommodity.id}
              className="common_checkbox"
            ></Checkbox>
            <span className={styles.package_title}>{translate('web.resource.mall.taocanshangpin')}</span>
            {!defaultCheckedList?.includes(newCommodity.id) && (
              <span style={{ color: '#91959B', fontSize: '14px' }}>
                ({translate('web.resource.mall.danqiantaocanyishixiao')})
              </span>
            )}
          </div>
          {fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedList) > 0 && (
            <div>
              <div className={styles.mealPriceWarp}>
                {translate('web.resource.mall.taocanzongjia')}{' '}
                <b className={styles.mealPrice}>¥{fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedList)}</b>
              </div>
              <div className={styles.alreadlyLess}>
                {translate('web.resource.mall.yijian')}
                {fnGetGroundPrice(newCommodity, 'saleTotalAmount', checkedList)}
              </div>
            </div>
          )}
          {fnGetGroundPrice(newCommodity, 'groupHandPrice', checkedList) <= 0 && (
            <div>
              <Button
                style={{ color: '#91959B', fontSize: '14px' }}
                type="link"
                className={styles.order_list_item_item_operation_item}
                onClick={() => handleDeleteItem(newCommodity.id)}
              >
                {translate('web.resource.mall.shanchutaocanshangpin')}
              </Button>
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
      {activityList.map((item: number, index: number) => {
        return (
          <li className={styles['coupon-warp']} key={index}>
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
    getMarketingWebCouponListByShop(parmas).then((res) => {
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
      const params = {
        couponId: item.couponId,
        belongType: item.belongType,
      }
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
    postMarketingMobileCouponReceive(parmas, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        message.success(translate('web.resource.mall.lingquchenggong'))
        item.completeReceive = 3
        setcouponList([...couponList])
      } else {
        message.destroy()
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
        couponList.map((item: any, index: number) => {
          return (
            <li className={styles['coupon-warp']} key={index}>
              <div className={styles['box']}>
                <div className={styles['coupon-left-money']}>
                  {translate('web.common.currencySymbol')}
                  {item.denomination}
                </div>
                <div className={styles['coupon-content-warp']}>
                  <div className={styles['coupon-content-title']}>{item.name}</div>
                  <div className={styles['coupon-content-tips']}>
                    {translate('web.resource.mall.man')}
                    {item.useConditionMoney}
                    {translate('web.common.reduce')}
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
                {translate('web.resource.mall.lingqu')}
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
      <Spin tip={translate('web.resource.mall.zhengzaijiazai')} />
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

  const fnJumpShopHome = (newShop: any) => {
    if (layoutType === LAYOUT_TYPE.own) {
      LinkTo(linkPrefix())
    } else {
      LinkTo(linkPrefix(`/shop/${newShop.storeId}`))
    }
  }

  useEffect(() => {
    fnInitActivity()
    fnetCouponList()
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
  const fnGetItemClass = (childItem: any, checkedList: number[]) => {
    if (childItem.goodsCartResp?.activityType === 15) {
      if (checkedList.includes(childItem.id)) {
        return styles.order_list_item_package
      }
      return styles.order_list_item_package_un
    }
    return styles.order_list_item
  }

  // mro模式仓位相关
  /**
   * 列表展开
   * @param key
   */
  const setExpand = (key: string) => {
    let _obj = { ...expandObj }
    if (_obj[key]) {
      _obj[key] = false
    } else {
      _obj[key] = true
    }
    setExpandObj(_obj)
  }

  /**
   * 返回展开列表
   * @param list
   * @param key
   */
  const returnMroCountList = (list: any, key: string) => {
    let _list: any[] = []
    if (list) {
      for (let i = 0; i <= list.length - 1; i++) {
        _list.push(list[i])
        if (!expandObj[key] && _list.length >= SHOW_COUNT) {
          break
        }
      }
    }
    return _list
  }

  /**
   * 仓位地址
   * @param warehouseAddress
   */
  const renderContent = (warehouseAddress: string) => {
    return (
      <div className={styles.renderContent}>
        <div className={styles.renderContent_left}>{translate('web.common.address')}：</div>
        <div className={styles.renderContent_right}>{warehouseAddress}</div>
      </div>
    )
  }

  /**
   * 返回购物车数量mro
   * @param purchaseProductPositions
   * @param positionId
   * @param warehouseId
   */
  const returnMroCountValue = (purchaseProductPositions: any[], positionId: number, warehouseId: number) => {
    for (let key in purchaseProductPositions) {
      if (
        purchaseProductPositions[key].positionId === positionId &&
        purchaseProductPositions[key].warehouseId === warehouseId
      ) {
        return purchaseProductPositions[key].positionQuantity
      }
    }
  }

  /**
   * 修改商品购买数量
   * @param count
   * @param id
   * @param positionId
   * @param warehouseId
   */
  const handleChangeMroFinishCount = (count: number, id: number, positionId: number, warehouseId: number) => {
    const result = orderList.map((item: any) => {
      item.orderList = item.orderList.map((childItem: any) => {
        if (childItem.id === id) {
          childItem.purchaseProductPositions.forEach((_item: any, _index: number, _arr: any) => {
            if (_item.positionId === positionId && _item.warehouseId === warehouseId) {
              _arr[_index].positionQuantity = Number(count)
            }
          })
        }
        return childItem
      })
      return item
    })
    setOrderList(result)
  }

  /**
   * 修改购买数量
   * @param count
   * @param childItem
   * @param type
   * @param positionId
   * @param warehouseId
   */
  const handleMroCountChange = (
    count: number,
    childItem: any,
    type: string,
    positionId: number,
    warehouseId: number,
  ) => {
    if (childItem?.goodsCartResp?.topActivityDetail?.activityType === 8) {
      // 为8的时候 是组合商品 不能小数
      count = Math.floor(count)
    }
    const _stockCount = childItem?.purchaseSkuResp?.inventoryByProductVOS.filter(
      (item: any) => item.positionId === positionId && item.warehouseId === warehouseId,
    )[0].stockCount
    const _count = count > _stockCount ? _stockCount : count
    handleChangeMroFinishCount(_count, childItem.id, positionId, warehouseId)
    if (type === 'click' || type === 'blur') {
      if (countModifyState.current) {
        countModifyState.current = false
        const param: any = {
          id: childItem.id,
          purchaseProductPositionRequest: {
            positionId,
            warehouseId,
            positionQuantity: Number(_count),
          },
        }

        const headers = {
          shopId: mallId,
        }

        postProductShopPurchaseSaveOrUpdatePurchase(param, { headers })
          .then((res) => {
            countModifyState.current = true
            if (res.code === 1000) {
              message.destroy()
            } else {
              message.error(res.message)
            }
          })
          .catch(() => {
            countModifyState.current = true
          })
      }
    }
  }

  /**
   * 计算mro仓位下单总数量
   * @param purchaseProductPositions
   */
  const mixMroCount = (purchaseProductPositions: any) => {
    let _count = 0
    purchaseProductPositions.forEach((_item: any) => {
      _count = _count + _item.positionQuantity
    })
    return _count
  }

  return (
    <div className={styles.order_list}>
      <div className={styles['title-warp']}>
        <div className={styles.order_list_shop_name}>
          <Checkbox
            value={newShop.id}
            className="common_checkbox"
            disabled={checkListItemIsRight(newShop.orderList)}
            indeterminate={
              !!newShop.checkedList.length &&
              newShop.checkedList.length < newShop.defaultCheckedList.length &&
              newShop.checkedList.length > 0
            }
            onChange={(e) => onCheckChildAllChange(e, newShop.id)}
          ></Checkbox>
          <div className={styles['shop-name-warp']}>
            <label
              onClick={() => {
                fnJumpShopHome(newShop)
              }}
            >
              {newShop.shopname}
            </label>
            {fnShouldShowFerr() && (
              <div className={styles['shop-shipping-free']}>
                {translate('web.resource.mall.dingdanmanbaoyou', {
                  currency: translate('web.common.currency'),
                  money: priceFormat(newShop.orderAmount),
                })}
                {newShop.orderAmount - newShop.unFreeShipping > 0 && (
                  <>
                    <span>
                      , {translate('web.resource.mall.haicha')} {translate('web.common.currencySymbol')}{' '}
                      {priceFormat(newShop.orderAmount - newShop.unFreeShipping)}
                    </span>
                    <span
                      className={styles['shop-shipping-free-go']}
                      onClick={() => {
                        fnJumpFreeShippingtOrder(newShop)
                      }}
                    >
                      {translate('web.resource.mall.qucoudan')}
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
            onOpenChange={(state) => fnGetCouponListDom(state)}
            title={translate('web.resource.mall.youhuiquanlingqu')}
            placement="bottomRight"
            trigger="click"
          >
            <div className={styles['more-warp-coupon']}>
              {translate('web.resource.mall.coupon')}
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
                {childItem.goodsCartResp && childItem.goodsCartResp.topActivityDetail && (
                  <div>
                    {fnGetDom(
                      childItem,
                      childItem.goodsCartResp.topActivityDetail,
                      childItem.goodsCartResp.activityDetails,
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
                        childItem.parentSkuId ||
                        childItem.stockCount === 0
                      }
                      value={childItem.id}
                      className="common_checkbox"
                    ></Checkbox>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.goods_info)}>
                    <div
                      className={cx(styles.order_list_item_item_imgbox, !childItem.isPublish ? styles.offShelf : {})}
                    >
                      <img width={80} height={80} src={childItem.purchaseSkuResp.commodity.mainPic} />
                      {!childItem.isPublish && (
                        <div className={styles.off_shelf_tip}>{translate('web.common.yixiajia')}</div>
                      )}
                    </div>
                    <div className={styles.order_list_item_item_main}>
                      <div
                        className={cx(styles.order_list_item_item_name, !childItem.isPublish ? styles.offShelf : {})}
                      >
                        <a href={getDetailLink(childItem)}>{childItem.purchaseSkuResp.commodity.name}</a>
                      </div>
                      <div className={styles.order_list_item_item_category}>
                        {childItem.purchaseSkuResp.commoditySkuAttributeList &&
                          childItem.purchaseSkuResp.commoditySkuAttributeList.map(
                            (attrItem: any, attrIndex: number) => (
                              <div
                                className={styles.order_list_item_item_attr}
                                key={`${childItem.purchaseSkuResp.id}_${attrIndex}`}
                              >
                                {attrItem.customerAttribute.name}：{attrItem.customerAttributeValue.value}
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.unitprice)}>
                    {childItem.purchaseSkuResp?.priceRange &&
                      childItem.purchaseSkuResp?.priceRange.length > 0 &&
                      childItem.purchaseSkuResp?.priceRange.map((rangItem: any, rangeIndex: number) => (
                        <div
                          key={`unitprice-${childItem.purchaseSkuResp.id}-${rangeIndex}`}
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
                      <div className={styles.tip}>{translate('web.resource.mall.cishangpinyibiangengweixunjia')}</div>
                    )}
                    {childItem.purchaseSkuResp.refPrice &&
                      (childItem.goodsCartResp || childItem.parentSkuId) &&
                      newShop.checkedList.indexOf(childItem.id) >= 0 && (
                        <div className={styles.tip}>
                          {translate('web.resource.mall.yugudaoshoujiage')}: {translate('web.common.currencySymbol')}{' '}
                          {priceFormat(childItem.purchaseSkuResp.refPrice)}
                        </div>
                      )}
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.count)}>
                    {childItem?.purchaseSkuResp?.inventoryByProductVOS?.length ? (
                      <>
                        {returnMroCountList(
                          childItem?.purchaseSkuResp?.inventoryByProductVOS,
                          `${childItem.purchaseSkuResp.id}_${childIndex}`,
                        )?.map((_item: any, _index: number) => (
                          <Row key={`${_item.warehouseId}_${_item.positionId}_${_index}`} gutter={16}>
                            <Col span={12}>
                              <Popover
                                placement="bottomLeft"
                                title={_item?.warehouseAddress.split(',')[0]}
                                content={renderContent(_item?.warehouseAddress.split(',')[1])}
                              >
                                <div className={styles.warehouseAddress}>{_item?.warehouseAddress.split(',')[0]}</div>
                                <div className={styles.warehouseAddressStock}>
                                  ({translate('web.resource.mall.kucun')}
                                  {_item?.stockCount}
                                  {childItem.purchaseSkuResp.commodity.unitName})
                                </div>
                              </Popover>
                            </Col>
                            <Col span={12}>
                              <InputNumber
                                key={`${_item.warehouseId}_${_item.positionId}_${_index}`}
                                max={_item.stockCount || 0}
                                disabled={_item.stockCount === 0}
                                min={childItem.purchaseSkuResp.commodity.minOrder || 1}
                                value={returnMroCountValue(
                                  childItem.purchaseProductPositions,
                                  _item.positionId,
                                  _item.warehouseId,
                                )}
                                onChange={(value: number, type: string) =>
                                  handleMroCountChange(value, childItem, type, _item.positionId, _item.warehouseId)
                                }
                              />
                            </Col>
                          </Row>
                        ))}
                        {childItem?.purchaseSkuResp?.inventoryByProductVOS.length > SHOW_COUNT && (
                          <div
                            className={styles.product_promotion_expand}
                            onClick={() => setExpand(`${childItem.purchaseSkuResp.id}_${childIndex}`)}
                          >
                            <span>
                              {expandObj?.[`${childItem.purchaseSkuResp.id}_${childIndex}`]
                                ? translate('web.resource.mall.shouqi')
                                : translate('web.resource.mall.zhankai')}
                            </span>
                            {expandObj?.[`${childItem.purchaseSkuResp.id}_${childIndex}`] ? (
                              <CaretUpOutlined className={styles.product_promotion_expand_icon} />
                            ) : (
                              <CaretDownOutlined className={styles.product_promotion_expand_icon} />
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {
                          <InputNumber
                            max={childItem.parentSkuId ? childItem.count : childItem.stockCount || 0}
                            min={
                              childItem.parentSkuId
                                ? childItem.count
                                : childItem.stockCount > 0
                                ? childItem.purchaseSkuResp.commodity.minOrder || 1
                                : 0
                            }
                            disabled={childItem.stockCount === 0 || childItem.parentSkuId}
                            value={childItem.count}
                            onChange={(value: number, type: string) => handleCountChange(value, childItem, type)}
                          />
                        }
                        <div className={styles.stock}>
                          <span>
                            ({translate('web.resource.mall.kucun')}
                            {numFormat(childItem.stockCount)}
                            {childItem.purchaseSkuResp.commodity.unitName})
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.amount)}>
                    <span className={styles.order_list_item_item_price}>
                      {priceFormat(
                        computeItemPrice(
                          childItem.purchaseSkuResp,
                          childItem?.purchaseSkuResp?.inventoryByProductVOS?.length
                            ? mixMroCount(childItem.purchaseProductPositions)
                            : childItem.count,
                          1,
                        ),
                      )}
                    </span>
                  </div>
                  <div className={cx(styles.order_list_item_item, styles.opration)}>
                    <div className={styles.order_list_item_item_operation}>
                      {childItem.purchaseSkuResp.commodity.priceType === 2 && (
                        <a className={styles.order_list_item_item_operation_item} href={getDetailLink(childItem)}>
                          {translate('web.resource.mall.quxunjia')}
                        </a>
                      )}
                      {(!childItem.setMealId || childItem.purchaseCommodityType === 4) && (
                        <>
                          <div
                            className={styles.order_list_item_item_operation_item}
                            onClick={() => handleCollect(childItem.purchaseSkuResp.commodity.id, childItem.id)}
                          >
                            {translate('web.resource.mall.yirushoucangjia')}
                          </div>
                          <div
                            className={styles.order_list_item_item_operation_item}
                            onClick={() => handleDeleteItem(childItem.id)}
                          >
                            {translate('web.common.delete')}
                          </div>
                        </>
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
