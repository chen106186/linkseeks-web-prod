import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { View, Text, Image, ScrollView } from '@apps/mobile-ui'
import { ProductItem } from '@/components/ProductList/Item'
import { TYPE_ARR, useSwitchListChange } from '@/components/SwitchListButton'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import ProductList from '@/components/ProductList'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const exchangeZoneIcon = getOssUrlPath('/miniprogram/assets/images/exchange_zone_icon.png')

interface ListParams {
  /**
   * 当前页
   */
  current?: number
  /**
   * 每页行数
   */
  pageSize?: number
}

interface RangeItemType {
  id: number
  title: string
  min: null | number
  max?: number
}

interface ExchangeZoneProps {
  currentRange: number
  _onChange: (e) => void
  commodityList: ProductItem[]
}

const ExchangeZone: React.FC<ExchangeZoneProps> = (props) => {
  const { currentRange, _onChange, commodityList } = props
  const { listType } = useSwitchListChange(TYPE_ARR[1], TYPE_ARR)
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const pointRangList: RangeItemType[] = [
    {
      id: 1,
      title: intl.formatMessage({ id: 'integral.jifen', defaultMessage: '0-100积分', data: '0-100' }),
      min: null,
      max: 100,
    },
    {
      id: 2,
      title: intl.formatMessage({ id: 'integral.jifen', defaultMessage: '101-500积分', data: '101-500' }),
      min: 101,
      max: 500,
    },
    {
      id: 3,
      title: intl.formatMessage({ id: 'integral.jifen', defaultMessage: '501-1000积分', data: '501-1000' }),
      min: 501,
      max: 1000,
    },
    {
      id: 4,
      title: intl.formatMessage({ id: 'integral.jifenyishang', defaultMessage: '1001积分以上', data: '1001' }),
      min: 1001,
    },
  ]
  return (
    <View className={styles['exchangeZone']}>
      <View className={styles['exchangeZone-exchange_title']}>
        <Image className={styles['exchangeZone-exchange_icon']} src={exchangeZoneIcon} />
        <Text className={styles['exchangeZone-exchange_title_text']}>
          {intl.formatMessage({ id: 'integral.duihuanzhuanqu', defaultMessage: '兑换专区' })}
        </Text>
      </View>
      <ScrollView horizontal className={styles['exchangeZone-pointRang']}>
        {pointRangList.map((item) => (
          <View
            className={cx(
              styles['exchangeZone-pointItem'],
              currentRange === item.id ? styles['exchangeZone-pointItemActive'] : null,
            )}
            key={`rangItem_${item.id}`}
            onClick={() => _onChange(item)}
          >
            <Text
              className={cx(
                styles['exchangeZone-pointItemText'],
                currentRange === item.id ? styles['exchangeZone-pointItemTextActive'] : null,
              )}
            >
              {item.title}
            </Text>
          </View>
        ))}
      </ScrollView>
      <ProductList
        dataSource={commodityList}
        type={listType}
        onClickItem={(item) => jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, { commodityId: item.id })}
      />
    </View>
  )
}

export default ExchangeZone
