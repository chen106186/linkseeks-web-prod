import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import cx from 'classnames'
import { View, Text, Checkbox, Button } from '@apps/mobile-ui'
import { getCurrentInstance, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Cell from '@/components/Cell'
import Stepper from '@/components/Stepper'
import { DataSourceItem } from '../../components/RepairProducts'
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
  const { dataSource, onSubmit, isAdd = false } = params
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
      newData.splice(index, 1, {
        ...newData[index],
        repairCount: value,
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
            id: 'repairTodo.repairEditProducts.checkeds.required',
            defaultMessage: '售后维修的商品不能小于一件',
          }),
          icon: 'none',
        })
        return
      }
      for (let i = 0; i < newData.length; i += 1) {
        const item = newData[i]
        if (item.repairCount <= 0) {
          showToast({
            title: intl.formatMessage({
              id: 'repairTodo.repairEditProducts.repairCount.required',
              defaultMessage: '维修数量必须大于0',
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
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={
            !isAdd
              ? intl.formatMessage({
                  id: 'repairTodo.repairEditProducts.edit',
                  defaultMessage: '修改退货数量',
                })
              : intl.formatMessage({
                  id: 'repairTodo.repairEditProducts.add',
                  defaultMessage: '填写退货数量',
                })
          }
        />
      }
    >
      <View className={styles['repair-edit-products']}>
        <View className={styles['repair-edit-products-list']}>
          <Checkbox.Group value={checkeds} onChange={(value) => setCheckeds(value as number[])}>
            {products.map((item) => (
              <View key={item.orderRecordId} className={styles['repair-edit-products-list-item']}>
                {!isAdd ? (
                  <View className={styles['repair-edit-products-list-item-left']}>
                    <Checkbox value={item.orderRecordId} />
                  </View>
                ) : null}
                <View className={styles['repair-edit-products-list-item-right']}>
                  <View
                    className={cx(
                      styles['repair-edit-products-list-item-head'],
                      !isAdd ? styles['repair-edit-products-list-item-head__border'] : '',
                    )}
                  >
                    {!isAdd ? (
                      <Text className={styles['repair-edit-products-list-item-name']}>{item.productName}</Text>
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
                        id: 'repairTodo.repairEditProducts.repairCount',
                        defaultMessage: '维修数量',
                      })}：`}
                      value={
                        <Stepper
                          value={item.repairCount}
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
                  </Cell>
                </View>
              </View>
            ))}
          </Checkbox.Group>
        </View>
        {!isAdd ? (
          <View
            className={styles['repair-edit-products-actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={hanldeSubmit}>
              {intl.formatMessage({
                id: 'repairTodo.repairEditProducts.submit',
                defaultMessage: '提交',
              })}
            </Button>
          </View>
        ) : (
          <View
            className={styles['repair-edit-products-actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={hanldeSubmit}>
              {intl.formatMessage({
                id: 'repairTodo.repairEditProducts.confirm',
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
