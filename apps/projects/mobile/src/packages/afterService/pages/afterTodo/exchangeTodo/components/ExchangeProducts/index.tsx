/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-15 18:19:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-15 18:27:56
 * @Description: 换货商品
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import Descriptions from '@/components/Descriptions'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Empty from '@/components/Empty'
import SteamerTicket from '../../../../afterRecords/components/SteamerTicket'
import styles from './index.module.scss'

export interface DataSourceItem {
  /**
   * 订单id
   */
  orderId: number
  /**
   * 订单记录id
   */
  orderRecordId: number
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand?: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 换货数量
   */
  replaceCount: number
  /**
   * 是否需要退货
   */
  isNeedReturn?: number
  /**
   * 是否选中的
   */
  checked?: boolean
  /**
   * 商品主图
   */
  skuPic: string
  /**
   * 商品工作流key
   */
  processKey?: string
  /**
   * 是否含税
   */
  isHasTax?: number
  /**
   * 税率
   */
  taxRate?: number
  /**
   * 合同id
   */
  contractId?: number
  /**
   * 合同编号
   */
  contractNo?: string
  /**
   * 关联商品名称
   */
  associated?: string
  /**
   * 关联商品id
   */
  associatedProductId?: string
  /**
   * 关联商品名称、规格
   */
  associatedProductName?: string
  /**
   * 关联商品规格
   */
  associatedType?: string
  /**
   * 关联商品品类
   */
  associatedCategory?: string
  /**
   * 关联商品品牌
   */
  associatedBrand?: string
  /**
   * 关联商品单位
   */
  associatedUnit?: string
  /**
   * 商品skuId
   */
  skuId: number
  /**
   * 剩余可申请数量
   */
  remaining: number
  /**
   * 订单类型
   */
  orderType: number
}

interface IProps {
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 数据源
   */
  dataSource: DataSourceItem[]
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 更改商品触发提交事件
   */
  onChange?: (value: DataSourceItem[]) => void
}

const RefundProducts: React.FC<IProps> = (props: IProps) => {
  const { isEdit, dataSource, customStyle, onChange } = props

  const intl = useIntl()

  const handleSubmit = (values: any) => {
    const { products } = values
    if (onChange) {
      onChange(products)
    }
  }

  const handleJump = () => {
    // navigation.navigate('ExchangeEditProducts', {
    //   dataSource,
    //   onSubmit: handleSubmit,
    // });
  }

  const filtered = dataSource.filter((item) => item.checked)

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'exchangeTodo.components.exchangeProducts.title', defaultMessage: '换货商品' })}
      extra={
        isEdit ? (
          <Shuttle
            describe={intl.formatMessage({
              id: 'exchangeTodo.components.exchangeProducts.required',
              defaultMessage: '请选择',
            })}
            onJump={handleJump}
          />
        ) : null
      }
      style={customStyle}
    >
      <View className={styles['list']}>
        {filtered.map((item) => (
          <View key={item.orderRecordId} className={styles['list-item']}>
            <SteamerTicket>
              <Text className={styles['list-item-title']}>{item.productName}</Text>
              <Descriptions column={2}>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'exchangeTodo.components.exchangeProducts.purchaseCount',
                    defaultMessage: '采购数量',
                  })}
                >
                  {item.purchaseCount}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'exchangeTodo.components.exchangeProducts.replaceCount',
                    defaultMessage: '换货数量',
                  })}
                >
                  {item.replaceCount}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'exchangeTodo.components.exchangeProducts.isNeedReturn',
                    defaultMessage: '是否需要退货',
                  })}
                  customStyle={{ marginBottom: pxTransform(0), alignItems: 'center' }}
                >
                  <Text className={styles['list-item-flag']}>
                    {item.isNeedReturn === 1
                      ? intl.formatMessage({
                          id: 'exchangeTodo.components.exchangeProducts.isNeedReturn.yes',
                          defaultMessage: '是',
                        })
                      : intl.formatMessage({
                          id: 'exchangeTodo.components.exchangeProducts.isNeedReturn.no',
                          defaultMessage: '否',
                        })}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </SteamerTicket>
          </View>
        ))}
      </View>
      {!filtered.length ? <Empty /> : null}
    </MellowCard>
  )
}

RefundProducts.defaultProps = {
  isEdit: false,
  customStyle: {},
  onChange: undefined,
}

export default RefundProducts
