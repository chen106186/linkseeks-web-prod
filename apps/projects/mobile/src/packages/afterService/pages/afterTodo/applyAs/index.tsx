import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-08 18:38:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 18:51:55
 * @Description: 申请售后
 */
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Toast, Checkbox, ActivityIndicator, Button } from '@apps/mobile-ui'
import classNames from 'classnames'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { SCORE, CHANNEL_SCORE } from '@/constants/const/orderModel'
import { getOrderMobileCommonAfterSale } from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import EmptyLayout from '@/components/Empty'
import { isMaterialOrder } from '../../../utils'
import { AsProductsItem, AsProductsItemType } from '../components/AsProducts'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
type RouteParams = {
  /**
   * 订单id
   */
  orderId: string
  /**
   * 下单模式
   */
  orderMode: string
  storeLogo?: string
  storeName?: string
}
interface TypeItem {
  key: number
  title: string
  disabled: boolean
}
const ApplyAs: React.FC<{}> = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { orderId, orderMode, storeLogo, storeName },
  } = router
  const [current, setCurrent] = useState(3)
  const [orderInfo, setOrderInfo] = useState<any>()
  const [products, setProducts] = useState<AsProductsItemType[]>([])
  const [checked, setChecked] = useState<number[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    userStore: { shopAndSite },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  usePageInit()
  const isIntegralOrder = !!orderMode && (+orderMode === SCORE || +orderMode === CHANNEL_SCORE)

  /**
   * 获取订单信息
   * @param asType 售后类型
   * @returns null
   */
  const getOrderDetail = (asType: number) => {
    if (!orderId) {
      return
    }
    setLoading(true)
    getOrderMobileCommonAfterSale({
      afterSalesType: `${asType}`,
      orderId: `${orderId}`,
      shopId: `${shopAndSite?.id}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { products: orderProducts = [], orderType } = res.data || {}
          let productList: AsProductsItemType[] = []
          productList = orderProducts.map((item) => ({
            orderId: res.data.orderId,
            orderRecordId: item.productId,
            orderNo: res.data.orderNo,
            productId: item.productNo,
            productName: item.name,
            category: item.category,
            brand: item.brand || '',
            unit: item.unit,
            purchasePrice: +item.price,
            purchaseCount: +item.quantity,
            skuPic: item.logo,
            processKey: item.processKey,
            isHasTax: +item.tax,
            taxRate: +item.taxRate,
            contractId: res.data.contractId,
            contractNo: res.data.contractNo,
            associated: !isMaterialOrder(orderType)
              ? ''
              : `${item.quotedProductNo}/${item.quotedName}/${item.quotedSpec || ' '}/${item.quotedCategory}/${
                  item.quotedBrand
                }`,
            associatedProductId: item.quotedProductNo || '',
            associatedProductName: `${item.quotedName || ''}`,
            associatedType: `${item.quotedSpec || ''}`,
            associatedCategory: item.quotedCategory || '',
            associatedBrand: item.quotedBrand || '',
            associatedUnit: item.unit || '',
            skuId: item.skuId,
            remaining:
              asType === 2
                ? +item.quantity
                : asType === 3
                ? +item.quantity - +item.returnCount
                : +item.quantity - +item.maintainCount,
          }))
          setChecked([])
          setProducts(productList)
          setOrderInfo(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
  useEffect(() => {
    getOrderDetail(current)
  }, [])
  const handleSelect = (record: TypeItem) => {
    if (record.disabled) {
      return
    }
    setCurrent(record.key)
    getOrderDetail(record.key)
  }
  const handleClickItem = (record: AsProductsItemType) => {
    const newData = [...checked]
    const index = newData.findIndex((item) => item === record.orderRecordId)
    if (index === -1) {
      newData.push(record.orderRecordId!)
    } else {
      newData.splice(index, 1)
    }
    setChecked(newData)
  }
  const handleCheckAll = () => {
    if (checked.length !== products.length) {
      setChecked(products.map((item) => item.orderRecordId!))
    } else {
      setChecked([])
    }
  }
  const handleSubmit = async () => {
    setSubmitLoading(true)
    const filtered = products.filter((item) => checked.includes(item.orderRecordId!))
    if (!filtered.length) {
      Toast.show({
        title: intl.formatMessage({
          id: 'afterTodo.applyAs.products.required',
          defaultMessage: '请选择需要售后服务的商品',
        }),
        icon: 'none',
      })
      setSubmitLoading(false)
      return
    }
    if (current === 2 || current === 3) {
      // 判断售后商品是否是同一个工作流的
      // 不是的话不可以进行售后
      const isSame = products.every((item, index) =>
        index === 0 ? true : item.processKey === products[index - 1].processKey,
      )
      if (!isSame) {
        Toast.show({
          title: intl.formatMessage({
            id: 'afterTodo.applyAs.warning',
            defaultMessage: '存在售后工作流不同商品，请重新选择',
          }),
          icon: 'none',
        })
        setSubmitLoading(false)
        return
      }
    }
    switch (current) {
      case 2: {
        preload({
          orderInfo: {
            supplierMemberId: orderInfo ? orderInfo.vendorMemberId : 0,
            supplierRoleId: orderInfo ? orderInfo.vendorRoleId : 0,
            supplierName: orderInfo ? orderInfo.vendorMemberName : '',
            processKey: filtered[0].processKey,
            orderType: orderInfo ? orderInfo.orderType : 0,
            shopId: orderInfo?.shopId,
            logo: orderInfo?.logo,
            storeLogo: storeLogo ? decodeURIComponent(storeLogo) : '',
            storeName: storeName ? decodeURIComponent(storeName) : '',
          },
          basicData: filtered,
        })
        Router.navigateTo('afterService/afterTodo/exchangeApply')
        break
      }
      case 3: {
        preload({
          orderInfo: {
            supplierMemberId: orderInfo ? orderInfo.vendorMemberId : 0,
            supplierRoleId: orderInfo ? orderInfo.vendorRoleId : 0,
            supplierName: orderInfo ? orderInfo.vendorMemberName : '',
            processKey: filtered[0].processKey,
            orderType: orderInfo ? orderInfo.orderType : 0,
            shopId: orderInfo?.shopId,
            logo: orderInfo?.logo,
          },
          basicData: filtered,
        })
        Router.navigateTo('afterService/afterTodo/refundApply')
        break
      }
      case 4: {
        preload({
          orderInfo: {
            supplierMemberId: orderInfo ? orderInfo.vendorMemberId : 0,
            supplierRoleId: orderInfo ? orderInfo.vendorRoleId : 0,
            supplierName: orderInfo ? orderInfo.vendorMemberName : '',
            orderType: orderInfo ? orderInfo.orderType : 0,
            shopId: orderInfo?.shopId,
            logo: orderInfo?.logo,
          },
          basicData: filtered,
        })
        Router.navigateTo('afterService/afterTodo/repairApply')
        break
      }
      default:
        break
    }
    setSubmitLoading(false)
  }
  const typeMap: TypeItem[] = [
    // {
    //   key: 2,
    //   title: intl.formatMessage({
    //     id: 'afterTodo.applyAs.type.exchange',
    //     defaultMessage: '换货',
    //   }),
    //   disabled: false,
    // },
    {
      key: 3,
      title: intl.formatMessage({
        id: 'afterTodo.applyAs.type.refund',
        defaultMessage: '退货',
      }),
      disabled: isIntegralOrder,
    },
    // {
    //   key: 4,
    //   title: intl.formatMessage({
    //     id: 'afterTodo.applyAs.type.repair',
    //     defaultMessage: '维修',
    //   }),
    //   disabled: isIntegralOrder,
    // },
  ]
  const remainingList = useMemo(() => products.filter((item) => item.remaining > 0), [products])
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={intl.formatMessage({
            id: 'afterTodo.applyAs.nav',
            defaultMessage: '申请售后',
          })}
        />
      }
    >
      <View className={styles['apply-as']}>
        <MellowCard
          title={intl.formatMessage({
            id: 'afterTodo.applyAs.afterType',
            defaultMessage: '选择售后类型',
          })}
          bodyStyle={{
            paddingBottom: 0,
          }}
        >
          <View className={styles['apply-as-type']}>
            {typeMap.map((item) => (
              <View
                key={item.key}
                className={classNames(
                  styles['apply-as-type-item'],
                  item.disabled ? styles['apply-as-type-item__disabled'] : '',
                  item.key === current ? styles['apply-as-type-item__active'] : '',
                )}
                onClick={() => handleSelect(item)}
              >
                <Text
                  className={classNames(
                    styles['apply-as-type-item-text'],
                    item.disabled ? styles['apply-as-type-item-text__disabled'] : '',
                    item.key === current ? styles['apply-as-type-item-text__active'] : '',
                  )}
                >
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </MellowCard>
        <MellowCard
          title={intl.formatMessage({
            id: 'afterTodo.applyAs.products',
            defaultMessage: '选择申请售后的商品',
          })}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
          extra={
            <View
              style={{
                paddingTop: pxTransform(themeLayout['padding-xxs']),
                paddingBottom: pxTransform(themeLayout['padding-xxs']),
              }}
              onClick={handleCheckAll}
            >
              <Text className={styles['apply-as-button-text']}>
                {checked.length !== remainingList.length
                  ? intl.formatMessage({
                      id: 'afterTodo.applyAs.all',
                      defaultMessage: '全选',
                    })
                  : intl.formatMessage({
                      id: 'afterTodo.applyAs.deselectAll',
                      defaultMessage: '取消全选',
                    })}
              </Text>
            </View>
          }
        >
          {!loading ? (
            <>
              {remainingList.length > 0 ? (
                <Checkbox.Group value={checked} onChange={(value) => setChecked(value as number[])}>
                  {remainingList.map((item) => (
                    <View
                      key={item.orderRecordId}
                      className={styles['apply-as-list-item']}
                      onClick={() => handleClickItem(item)}
                    >
                      <View className={styles['apply-as-list-item-left']}>
                        <Checkbox value={item.orderRecordId} stopPropagation />
                      </View>
                      <View className={styles['apply-as-list-item-right']}>
                        <AsProductsItem data={item} orderType={orderInfo.orderType} />
                      </View>
                    </View>
                  ))}
                </Checkbox.Group>
              ) : (
                <EmptyLayout description="" />
              )}
            </>
          ) : (
            <View className={styles['apply-as-loading']}>{loading && <ActivityIndicator size={20} isOpened />}</View>
          )}
        </MellowCard>
        <View
          className={styles['apply-as-actions']}
          style={{
            paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
          }}
        >
          <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
            {intl.formatMessage({
              id: 'afterTodo.applyAs.next',
              defaultMessage: '下一步',
            })}
          </Button>
        </View>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(ApplyAs)
