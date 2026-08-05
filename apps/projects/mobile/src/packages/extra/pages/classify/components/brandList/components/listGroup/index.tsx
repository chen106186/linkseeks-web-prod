/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-19 16:22:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 10:05:01
 * @Description:
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import cx from 'classnames'
import { View, Text } from '@apps/mobile-ui'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import styles from './index.module.scss'

export interface IDataItem {
  /**
   * id
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * logo
   */
  logoUrl: string
}
interface ListGroupProps {
  /**
   * 数据
   */
  data: IDataItem
}

const ListGroup: React.FC<ListGroupProps> = (props: ListGroupProps) => {
  const { data } = props

  /**
   * 选择品牌跳转
   * @param item BrandItem
   */
  const handleFilterBrand = (item: IDataItem) => {
    Router.navigateTo('extra/search', { type: 1, brandId: item.id })
  }

  return (
    <View className={styles['list-group']}>
      <MellowCard
        bodyStyle={{
          padding: `0px ${pxTransform(12)}`,
          flexDirection: 'column',
        }}
        style={{
          borderRadius: 0,
        }}
      >
        <View
          className={cx(styles['list-group-item'], styles['list-group-item__border'])}
          onClick={() => handleFilterBrand(data)}
        >
          <View className={styles['list-group-item-avatar']}>
            <ImageBox
              source={data.logoUrl}
              width="100%"
              height="100%"
              className={styles['list-group-item-avatar-img']}
            />
          </View>
          <Text className={styles['list-group-item-name']}>{data.name}</Text>
        </View>
      </MellowCard>
    </View>
  )
}

export default ListGroup
