import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-07 21:15:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-19 14:44:14
 * @Description: 修改退货商品
 */
import React, { useState } from 'react'
import cx from 'classnames'
import { View, Text, Checkbox, Button } from '@apps/mobile-ui'
import { getCurrentInstance, preload, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Cell from '@/components/Cell'
import Stepper from '@/components/Stepper'
import { isMaterialOrder } from '../../../../../utils'
import { DataSourceItem } from '../../components/RefundProducts'
import { AsProductsItem } from '../../../components/AsProducts'
import styles from './index.module.scss'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
export interface Values {
  /**
   * 商品
   */
  products: DataSourceItem[]
}
interface RouteParams {
  /**
   * 数据源
   */
  dataSource: DataSourceItem[]
  /**
   * 订单类型
   */
  orderType: number
  /**
   * 提交事件
   */
  onSubmit: (values: Values) => void
  /**
   * 是否是添加操作，否则就是编辑
   */
  isAdd?: boolean
}
const RefundProducts: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const { dataSource, onSubmit, orderType, isAdd = false } = params
  const [checkeds, setCheckeds] = useState<number[]>(
    dataSource.filter((item) => item.checked).map((item) => item.orderRecordId),
  )
  const [products, setProducts] = useState<DataSourceItem[]>(dataSource)
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  const handleStepperChange = (value: number, recordId: number) => {
    const newData = [...products]
    const index = products.findIndex((item) => item.orderRecordId === recordId)
    if (index !== -1) {
      const current = newData[index]
      const newPayList = current.payList
        ? current.payList.map((item) => ({
            ...item,
            refundAmount: +(value * current.purchasePrice * (item.payRatio! / 100)).toFixed(2),
          }))
        : []
      newData.splice(index, 1, {
        ...newData[index],
        returnCount: value,
        payList: newPayList,
        refundAmount: !isMaterialOrder(orderType)
          ? newPayList && newPayList.length
            ? newPayList.reduce((pre, now) => now.refundAmount + pre, 0)
            : 0
          : value * current.purchasePrice,
      })
    }
    setProducts(newData)
  }
  const hanldeSubmit = async () => {
    if (onSubmit) {
      const newData = products.map((item) => ({
        ...item,
        checked: !!checkeds.find((checked) => item.orderRecordId === checked),
      }))
      if (!checkeds.length) {
        showToast({
          title: intl.formatMessage({
            id: 'refundTodo.refundEditProducts.checkeds.required',
            defaultMessage: '售后退货的商品不能小于一件',
          }),
          icon: 'none',
        })
        return
      }
      for (let i = 0; i < newData.length; i += 1) {
        const item = newData[i]
        if (item.returnCount! <= 0) {
          showToast({
            title: intl.formatMessage({
              id: 'refundTodo.refundEditProducts.returnCount.required',
              defaultMessage: '退货数量必须大于0',
            }),
            icon: 'none',
          })
          return
        }
      }

      if (!IS_WEB) {
        await requestSubscribeMessage({
          tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
          entityIds: [],
        }).catch(() => {})
      }

      onSubmit({
        products: newData,
      })
      Router.navigateBack()
    }
  }
  const handleJumpEditRefundAmount = (record: DataSourceItem) => {
    preload({
      ...params,
      payList: record.payList,
    })
    Router.navigateTo('afterService/afterTodo/refundPrSubmit/refundEditReturnmount')
  }
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={
            !isAdd
              ? intl.formatMessage({
                  id: 'refundTodo.refundEditProducts.edit',
                  defaultMessage: '修改退货数量',
                })
              : intl.formatMessage({
                  id: 'refundTodo.refundEditProducts.add',
                  defaultMessage: '填写退货数量',
                })
          }
        />
      }
    >
      <View className={styles['refund-edit-products']}>
        <View className={styles['refund-edit-products-list']}>
          <Checkbox.Group value={checkeds} onChange={(value) => setCheckeds(value as number[])}>
            {products.map((item) => (
              <View key={item.orderRecordId} className={styles['refund-edit-products-list-item']}>
                {!isAdd ? (
                  <View className={styles['refund-edit-products-list-item-left']}>
                    <Checkbox value={item.orderRecordId} />
                  </View>
                ) : null}
                <View className={styles['refund-edit-products-list-item-right']}>
                  <View
                    className={cx(
                      styles['refund-edit-products-list-item-head'],
                      !isAdd ? styles['refund-edit-products-list-item-head__border'] : '',
                    )}
                  >
                    {!isAdd ? (
                      <Text className={styles['refund-edit-products-list-item-name']}>{item.productName}</Text>
                    ) : (
                      <AsProductsItem data={item} />
                    )}
                  </View>
                  <Cell
                    customStyle={{
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    border={!isAdd}
                  >
                    <Cell.Item
                      title={`${intl.formatMessage({
                        id: 'refundTodo.refundEditProducts.returnCount',
                        defaultMessage: '退货数量',
                      })}：`}
                      value={
                        <Stepper
                          value={item.returnCount}
                          min={0}
                          max={item.remaining}
                          onChange={(value: number) => handleStepperChange(value, item.orderRecordId)}
                        />
                      }
                      customHeadStyle={{
                        paddingTop: pxTransform(themeLayout['padding-xs']),
                        paddingBottom: pxTransform(themeLayout['padding-xs']),
                      }}
                    />
                    <Cell.Item
                      title={`${intl.formatMessage({
                        id: 'refundTodo.refundEditProducts.refundAmount',
                        defaultMessage: '退款金额',
                      })}：`}
                      value={
                        <Text className={styles['refund-edit-products-list-item-amount']}>
                          {`${intl.formatMessage({
                            id: 'currency',
                            defaultMessage: '￥',
                          })} ${item.refundAmount}`}
                        </Text>
                      }
                      customHeadStyle={{
                        paddingTop: pxTransform(themeLayout['padding-xs']),
                        paddingBottom: pxTransform(themeLayout['padding-xs']),
                      }}
                      onPress={() => handleJumpEditRefundAmount(item)}
                      hasArrow
                      clickable
                    />
                  </Cell>
                </View>
              </View>
            ))}
          </Checkbox.Group>
        </View>
        {!isAdd ? (
          <View
            className={styles['refund-edit-products-actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={hanldeSubmit}>
              {intl.formatMessage({
                id: 'refundTodo.refundEditProducts.submit',
                defaultMessage: '提交',
              })}
            </Button>
          </View>
        ) : (
          <View
            className={styles['refund-edit-products-actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={hanldeSubmit}>
              {intl.formatMessage({
                id: 'refundTodo.refundEditProducts.confirm',
                defaultMessage: '确定',
              })}
            </Button>
          </View>
        )}
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RefundProducts)
