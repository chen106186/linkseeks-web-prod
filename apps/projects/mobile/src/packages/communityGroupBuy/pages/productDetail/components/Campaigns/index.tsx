/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 11:00:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 13:56:26
 * @Description: 活动列表
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { TagsItem } from '@/components/ProductList/components/Tags'
import './index.scss'

type CampaignType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 活动类型
   */
  type?: number
  /**
   * 活动类型名称
   */
  typeName?: string
  /**
   * 活动名称
   */
  name: string
}

interface CampaignsItemProps {
  /**
   * 数据
   */
  data: CampaignType
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义外部className
   */
  customClassName?: string
}

export const CampaignsItem: React.FC<CampaignsItemProps> = (props: CampaignsItemProps) => {
  const { data, customStyle, customClassName } = props

  return (
    <View className={classNames('campaigns-item', customClassName)} style={customStyle}>
      {data.type && (
        <View className="campaigns-item-left">
          <TagsItem data={data.typeName!} />
        </View>
      )}
      <View className="campaigns-item-right">
        <View className="campaigns-item-text">{data.name}</View>
      </View>
    </View>
  )
}

CampaignsItem.defaultProps = {
  customStyle: {},
}

interface IProps {
  /**
   * 数据
   */
  dataSource: CampaignType[]
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
}

const Campaigns: React.FC<IProps> = (props: IProps) => {
  const { dataSource, customStyle } = props

  return (
    <View className="campaigns" style={customStyle}>
      {dataSource.map((item, index) => (
        <CampaignsItem
          customClassName={index !== dataSource.length - 1 ? 'campaigns-item__notLast' : ''}
          data={item}
          key={item.id}
        />
      ))}
    </View>
  )
}

Campaigns.defaultProps = {
  customStyle: {},
}

export default Campaigns
