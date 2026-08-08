/*
 * @Description: 会员校园卡
 */
import React, { CSSProperties } from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import './index.scss'

export type VenderType = {
  /**
   * 供应商id
   */
  id: number
  /**
   * 供应商名称
   */
  name: string
  /**
   * 供应商logo
   */
  logo: string
}

export interface SchoolCardProps {
  /**
   * 展示数据
   */
  data: {
    /**
     * 会员名称
     */
    name?: string
    /**
     * 会员ID
     */
    memberId?: number
    /**
     * 会员状态
     */
    status?: number
    /**
     * 会员状态名称
     */
    statusName?: string
  }
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
}

const SchoolCard: React.FC<SchoolCardProps> = (props: SchoolCardProps) => {
  const { data, customStyle } = props

  return (
    <View className="school-card" style={customStyle}>
      <View className="school-card-head">
        <View className="school-card-head-ribbon" />
        <View className="school-card-name">{data.name}</View>
      </View>
      <View className="school-card-body">
        <View className="school-card-id">{`ID：${data.memberId || ''}`}</View>
        {/* <View className={classNames('school-card-status', {
          'school-card-status-normal': data.status === 2,  // 正常
          'school-card-status-frezon': data.status === 1,  // 冻结
        })}>
          {data.statusName}
        </View> */}
        <View className={classNames('school-card-status')}>{data.statusName}</View>
      </View>
    </View>
  )
}

export default SchoolCard
