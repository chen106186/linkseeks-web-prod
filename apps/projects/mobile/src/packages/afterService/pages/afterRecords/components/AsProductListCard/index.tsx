/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-03 14:50:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 13:55:43
 * @Description: 售后申请商品列表卡片，详情单展示用
 */
import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import { AsProductsItem, AsProductsItemProps } from '../../../afterTodo/components/AsProducts'
import styles from './index.module.scss'

type AsProductListCardItemType = AsProductsItemProps['data'] & {
  /**
   * 申请数量
   */
  applyCount: number
}

interface AsProductListCardProps {
  /**
   * 售后类型，1 维修 2 退货 3 换货
   */
  afterType: 1 | 2 | 3
  /**
   * 商品数据
   */
  dataSource: AsProductListCardItemType[]
  /**
   * 订单类型
   */
  orderType: number
}

const AsProductListCard: React.FC<AsProductListCardProps> = (props: AsProductListCardProps) => {
  const { afterType = 1, dataSource = [], orderType } = props

  const intl = useIntl()

  const AFTER_TYPE_NAME_MAP: { [key: number]: string } = {
    1: intl.formatMessage({ id: 'afterRecords.components.asProductListCard.repair', defaultMessage: '维修' }),
    2: intl.formatMessage({ id: 'afterRecords.components.asProductListCard.refund', defaultMessage: '退货' }),
    3: intl.formatMessage({ id: 'afterRecords.components.asProductListCard.exchange', defaultMessage: '换货' }),
  }

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'afterRecords.components.asProductListCard.products',
        afterType: AFTER_TYPE_NAME_MAP[afterType],
      })}
    >
      <View className={styles['as-products-card']}>
        {dataSource &&
          dataSource.map((item, index) => (
            <View
              className={classNames(
                styles['as-products-card-item'],
                index !== dataSource.length - 1 ? styles['as-products-card-item__notLast'] : null,
              )}
              key={index}
            >
              <AsProductsItem
                data={item}
                customRenderQuantity={() => (
                  <Text className={styles['as-products-card-item-count']} style={{ marginRight: pxTransform(0) }}>
                    {`${intl.formatMessage({
                      id: 'afterRecords.components.asProductListCard.applyCount',
                      afterType: AFTER_TYPE_NAME_MAP[afterType],
                    })}：${item.applyCount}`}
                  </Text>
                )}
                orderType={orderType}
              />
            </View>
          ))}
      </View>
    </MellowCard>
  )
}

export default AsProductListCard
