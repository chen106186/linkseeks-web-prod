import React, { useState, useEffect } from 'react'
import { Button, Checkbox, message, Modal } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import cx from 'classnames'
import { history } from '@linkseeks/router-manager'
import { isEmpty } from 'lodash'
import CommodityItem from './commodityItem'
import ButtonSettlement from './buttonSettlement'
import NoData from '../components/NoData'
import { fnInitHandPrice } from './commonFn'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import useAgentInfo from '../hooks/useAgentInfo'
import { PageHeaderWrapper } from '@apps/components'
import usePurchaseOrder from '../hooks/usePurchaseOrder'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const PurchaseOrder: React.FC = () => {
  const intl = useIntl()
  const [indeterminate, setIndeterminate] = useState<boolean>(false)
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [checkedList, setCheckedList] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])
  // const [, setCategoryIds] = useState<any>()
  // const [setLoading] = useState<boolean>(false)
  const [shouldInitPrice, setShouldInitPrice] = useState<boolean>(false)
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const { purchaseList, getPurchaseList, deletePurchase, saveOrUpdatePurchase } = usePurchaseOrder({
    orderId: agentPurchaseOrderInfo?.orderId,
    mallId: agentPurchaseOrderInfo?.shopId,
    customerMemberId: agentPurchaseOrderInfo?.memberId,
    customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    customerMemberLevel: agentPurchaseOrderInfo?.memberLevel,
  })
  const mallId = agentPurchaseOrderInfo?.shopId

  useEffect(() => {
    getPurchaseList()
  }, [])

  /**
   * 获取购物车内商品品类id集合
   * @param purchaseListDesc
   */
  // const getCategoryIds = (purchaseListDesc: any[]) => {
  //   const ids: number[] = []
  //   for (const item of purchaseListDesc) {
  //     const categoryId: number = item.commodityUnitPrice.commodity.customerCategory.id
  //     if (!ids.includes(categoryId)) {
  //       ids.push(categoryId)
  //     }
  //   }
  //   setCategoryIds(ids)
  // }

  const initData = (list: any, initChecked?: any) => {
    let isAll = false
    const result = list.map((item: any) => {
      if (!initChecked && item.defaultCheckedList?.length !== 0) {
        isAll = true
      }
      return Object.assign(item, {
        // checkedList: initChecked ? initChecked : item.orderList.filter((item: any) => item.commodityUnitPrice.commodity.priceType === 1 && item.isPublish).map((item: any) => item.id),
        checkedList: initChecked ? initChecked : item.defaultCheckedList,
        defaultCheckedList: item.orderList
          .filter((second: any) => second.purchaseSkuResp.commodity.priceType === 1 && second.isPublish)
          .map((third: any) => third.id),
        shouluDeleteSkuidList: item.orderList
          .filter((second: any) => !second.isPublish)
          .filter((third: any) => third.parentSkuId)
          .map((fourth: any) => fourth.id),
      })
    })
    const resultDesc = result.map((item: any) => {
      if (item.shouluDeleteSkuidList.length > 0) {
        const defaultCheckedList = fnInitUnSelect(item.orderList, item.defaultCheckedList, item.shouluDeleteSkuidList)
        item.defaultCheckedList = defaultCheckedList
        return item
      } else {
        return item
      }
    })
    setCheckAll(isAll) // 点击全选的时候, 如果全选数据为空, 要将全选给去掉
    setOrderList(resultDesc)
  }

  /**
   * 初始化购物车数据
   * @param list
   * @param initState
   */
  const initPurchaseList = async (list: any[]) => {
    let result: any[] = []
    for (const item of list) {
      // 判断店铺id是否已存在数组中
      if (result.some((resItem) => resItem.storeId === item.purchaseSkuResp.commodity.storeId)) {
        const tempResult = []
        for (const tempItem of result) {
          if (tempItem.storeId === item.purchaseSkuResp.commodity.storeId) {
            let tempPriceRange: any[] = []
            const unitPrice = item.purchaseSkuResp.unitPrice || {}
            let parameter: any = 1
            const isMemberPrice = item.purchaseSkuResp.commodity.isMemberPrice
            // 如果可以使用会员折扣
            if (isMemberPrice) {
              parameter = item.parameter
            }
            Object.keys(unitPrice).forEach((key) => {
              const keyArr = key.split('-')
              const min = keyArr[0]
              const max = keyArr[1]
              tempPriceRange.push({
                range: key,
                min,
                max,
                price: Number(unitPrice[key]),
              })
            })
            try {
              tempPriceRange = tempPriceRange.sort((a, b) => (a.price < b.price ? 1 : -1))
            } catch (error) {
              console.log(error)
            }

            item.purchaseSkuResp.parameter = parameter
            item.purchaseSkuResp.priceRange = tempPriceRange
            tempItem.orderList = [...tempItem.orderList, item]
            tempResult.push(tempItem)
          } else {
            tempResult.push(tempItem)
          }
        }
        result = tempResult
      } else {
        const temp: any = {}
        temp.id = item.id
        temp.storeId = item.purchaseSkuResp.commodity.storeId
        temp.memberId = item.purchaseSkuResp.commodity.memberId
        temp.memberRoleId = item.purchaseSkuResp.commodity.memberRoleId
        temp.shopname = item.purchaseSkuResp.commodity.memberName
        temp.orderAmount = item.orderAmount
        temp.shopAllPay = 0 // 储存该商品总花费
        temp.unFreeShipping = 0 // 不包邮的总花费
        let tempPriceRange: any[] = []
        const unitPrice = item.purchaseSkuResp.unitPrice || {}
        let parameter: any = 1
        const isMemberPrice = item.purchaseSkuResp.commodity.isMemberPrice
        // 如果可以使用会员折扣
        if (isMemberPrice) {
          parameter = item.parameter
        }
        unitPrice &&
          Object.keys(unitPrice).forEach((key) => {
            const keyArr = key.split('-')
            const min = keyArr[0]
            const max = keyArr[1]
            tempPriceRange.push({
              range: key,
              min,
              max,
              price: Number(unitPrice[key]),
            })
          })
        try {
          tempPriceRange = tempPriceRange.sort((a, b) => (a.price < b.price ? 1 : -1))
        } catch (error) {
          console.log(error)
        }

        item.purchaseSkuResp.parameter = parameter
        item.purchaseSkuResp.priceRange = tempPriceRange
        temp.orderList = [item]
        result.push(temp)
      }
    }
    initData(result, [])
  }

  const fnGetUnRepeat = (initArr: number[], deleteArr: number[]) => {
    const defa: number[] = []
    initArr.map((key) => {
      if (!deleteArr.includes(key)) {
        defa.push(key)
      }
    })
    return defa
  }
  /**
   *
   * @param orderLis 该商店的商品列表
   * @param checkedList 能选择的购物车id
   * @param shouluDeleteSkuidList 需要去掉的SKUID
   */
  const fnInitUnSelect = (orderLis: any, checkedListPar: number[], shouluDeleteSkuidList: number[]) => {
    const checkedListDesc = [...checkedListPar]
    const skuIdList: number[] = []
    const shouluDeleteSkuidListDesc = [...shouluDeleteSkuidList]
    orderLis.forEach((item: { purchaseSkuResp: any; id: number; parentSkuId: number }) => {
      if (shouluDeleteSkuidListDesc.includes(item.id)) {
        // 判断套餐主商品应该不能选择的, 并且获取到对应的skuid
        skuIdList.push(item.parentSkuId)
      }
    })
    if (skuIdList.length > 0) {
      orderLis.forEach((item: { purchaseSkuResp: any; id: number; parentSkuId: number; setMealId: number }) => {
        if ((skuIdList.includes(item.parentSkuId) || skuIdList.includes(item.purchaseSkuResp.id)) && item.setMealId) {
          shouluDeleteSkuidListDesc.push(item.id)
        }
      })
    }
    return fnGetUnRepeat(checkedListDesc, shouluDeleteSkuidListDesc)
  }

  const getAllKeys = () => {
    return orderList.map((item) => item.defaultCheckedList.length !== 0 && item.id)
  }

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? getAllKeys() : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    initData(orderList, e.target.checked ? false : [])
  }

  const handleGroupChange = (checkedListPar: CheckboxValueType[]) => {
    const checkedListDesc: number[] = []
    orderList.forEach((item) => {
      if (item.defaultCheckedList.length !== 0 && checkedListPar.includes(item.id)) {
        checkedListDesc.push(item.id)
      }
    })
    setCheckedList(checkedListDesc)
    setIndeterminate(!!checkedListDesc.length && checkedListDesc.length < getAllKeys().length)
    setCheckAll(checkedListDesc.length === getAllKeys().length && checkedListDesc.length !== 0)
  }

  /**
   * 删除指定id的商品
   * @param ids
   */
  const deleteListItems = (ids: number[]) => {
    const newOrderList = JSON.parse(JSON.stringify(orderList))
    const result = []
    for (const item of newOrderList) {
      const newItem = item
      newItem.checkedList = newItem.checkedList.filter((checkItem: any) => !ids.includes(checkItem))
      newItem.orderList = newItem.orderList.filter((orderItem: any) => !ids.includes(orderItem.id))
      if (newItem.orderList.length > 0) {
        result.push(newItem)
      }
    }
    setOrderList(result)
    getPurchaseList()
    if (result.every((resItem) => resItem.checkedList.length === 0)) {
      setIndeterminate(false)
    }
  }

  const requestBatchDelete = (idList: any[]) => {
    return new Promise((resolve, reject) => {
      deletePurchase(idList)
        .then((res) => {
          if (res) {
            deleteListItems(idList)
            resolve(true)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  /**
   * 批量删除商品
   */
  const handleBatchDelete = (showConfirm = true) => {
    let idList: number[] = []
    for (const item of orderList) {
      idList = [...idList, ...item.checkedList]
    }
    if (idList.length <= 0) {
      message.info(intl.formatMessage({ id: 'purchaseOrder.index.selectItem' }))
      return false
    }
    if (showConfirm) {
      Modal.confirm({
        centered: true,
        className: styles.mallComfirm,
        content: intl.formatMessage({ id: 'purchaseOrder.index.selectedItem' }),
        onOk: () => {
          return requestBatchDelete(idList)
        },
      })
    } else {
      requestBatchDelete(idList)
    }
  }

  const getMaxCountRange = (priceRange: any[], buyCount: number) => {
    const priceList = [...priceRange]
    const newList = priceList.sort((a, b) => (a.min > b.max ? 1 : -1))
    const result = newList.sort((a, b) =>
      Number(b.max) < Number(buyCount) && Number(buyCount) < Number(a.min) ? 1 : -1,
    )
    return result[0]
  }

  const getUnitPrice = (detail: any, count: number, parameter: number = 1, useParameter: boolean = true) => {
    let unitPrice = 0
    if (!detail) {
      return 0
    }

    if (detail.priceRange.length <= 1) {
      unitPrice = detail.priceRange[0]?.price
    } else {
      const temp = detail.priceRange.filter((item: any) => {
        return Number(count) >= Number(item.min) && Number(count) <= Number(item.max)
      })

      if (isEmpty(temp)) {
        const maxItem = getMaxCountRange(detail.priceRange, count)
        unitPrice = maxItem.price
      } else {
        unitPrice = temp[0]?.price
      }
    }

    if (detail.commodity.isMemberPrice && useParameter) {
      unitPrice = unitPrice * parameter
    }

    return unitPrice
  }

  /**
   * 计算单个商品总价格
   * @param priceRange
   * @param count
   */
  const computeItemPrice = (details: any, count: number, parameter: number = 1) => {
    const unitPrice = getUnitPrice(details, count, parameter)
    // if (details.refPrice){
    //   unitPrice = details.refPrice;
    // }
    return unitPrice * count
  }
  /**
   * 计算商品金额总计
   * @param priceRange
   * @param count
   */
  const computeAllPrice = (details: any, count: number) => {
    // unitPrice = details.refPrice;
    return details.refPrice * count
  }

  /**
   * 初始化到手价格
   */
  const fnShouldInitPrice = (shopList?: any) => {
    fnInitHandPrice(
      shopList || orderList,
      mallId,
      agentPurchaseOrderInfo?.memberId,
      agentPurchaseOrderInfo?.roleId,
    ).then((res: any) => {
      if (res.shouldReset) {
        fnShouldInitPrice(res.shopList)
        return
      }
      if (res.shouldResetAll) {
        setCheckedList([])
        setIndeterminate(false)
        setCheckAll(false)
      }
      setShouldInitPrice(false)
      setOrderList(res.shopList)
    })
  }

  useEffect(() => {
    if (shouldInitPrice) {
      fnShouldInitPrice()
    } else {
      setShouldInitPrice(true)
    }
  }, [orderList])

  useEffect(() => {
    if (purchaseList && purchaseList.length > 0) {
      initPurchaseList(purchaseList)
      // getCategoryIds(purchaseList)
    } else if (purchaseList && purchaseList.length === 0) {
      setOrderList([])
    }
  }, [purchaseList])

  return (
    <PageHeaderWrapper>
      <div className={styles.purchase_order}>
        <div className={styles.purchase_order_container}>
          {orderList && orderList.length > 0 && (
            <div className={styles.order_tb_title}>
              <div className={cx(styles.order_tb_title_item, styles.allcheck)}>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  {intl.formatMessage({ id: 'purchaseOrder.index.SelectAll' })}
                </Checkbox>
              </div>
            </div>
          )}
          {orderList && orderList.length > 0 ? (
            <Checkbox.Group value={checkedList} onChange={handleGroupChange} style={{ display: 'block' }}>
              {orderList.map((item: any, index: number) => (
                <CommodityItem
                  key={`${item.id}_${index}`}
                  newShop={item}
                  buyerInfo={agentPurchaseOrderInfo}
                  orderList={orderList}
                  setOrderList={setOrderList}
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  setIndeterminate={setIndeterminate}
                  setCheckAll={setCheckAll}
                  computeItemPrice={computeItemPrice}
                  deleteListItems={deleteListItems}
                  saveOrUpdatePurchase={saveOrUpdatePurchase}
                  deletePurchase={deletePurchase}
                  mallId={mallId}
                  setShouldInitPrice={setShouldInitPrice}
                  getAllKeys={getAllKeys}
                />
              ))}
            </Checkbox.Group>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <NoData content={intl.formatMessage({ id: 'topBar.index.NoGoods' })} />
              <Button type="link" onClick={() => history.push(`/orderAbility/saleOrder/agentPurchaseOrder/commodity`)}>
                {translate('web.resource.order.jixuxuanzeshanping')}
              </Button>
            </div>
          )}
          {orderList && orderList.length > 0 && (
            <ButtonSettlement
              indeterminate={indeterminate}
              onCheckAllChange={onCheckAllChange}
              checkAll={checkAll}
              handleBatchDelete={handleBatchDelete}
              orderList={orderList}
              mallId={mallId}
              computeAllPrice={computeAllPrice}
              getUnitPrice={getUnitPrice}
              mallInfo={agentPurchaseOrderInfo}
              // updateOrderInfo={updateOrderInfo}
            />
          )}
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

export default PurchaseOrder
