import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import Descriptions from '@/components/Descriptions'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Empty from '@/components/Empty'
import { Values } from '../../repairPrSubmit/repairEditProducts'
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
   * 维修数量
   */
  repairCount: number
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

const RepairProducts: React.FC<IProps> = (props: IProps) => {
  const { isEdit, dataSource, customStyle, onChange } = props

  const intl = useIntl()

  const handleSubmit = (values: Values) => {
    const { products } = values
    if (onChange) {
      onChange(products)
    }
  }

  const handleJump = () => {
    // navigation.navigate('RepairEditProducts', {
    //   dataSource,
    //   onSubmit: handleSubmit,
    // });
  }

  const filtered = dataSource.filter((item) => item.checked)

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'repairTodo.components.repairProducts.title', defaultMessage: '维修商品' })}
      extra={
        isEdit ? (
          <Shuttle
            describe={intl.formatMessage({
              id: 'repairTodo.components.repairProducts.placeholder',
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
              <Descriptions labelWidth={66} column={1}>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'repairTodo.components.repairProducts.repairCount',
                    defaultMessage: '维修数量',
                  })}
                >
                  {item.repairCount}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({
                    id: 'repairTodo.components.repairProducts.repairReason',
                    defaultMessage: '维修原因',
                  })}
                  customStyle={{ marginBottom: pxTransform(0) }}
                >
                  {' '}
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

RepairProducts.defaultProps = {
  isEdit: false,
  customStyle: {},
  onChange: undefined,
}

export default RepairProducts
