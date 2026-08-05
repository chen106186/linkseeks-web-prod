/*
 * @Description: 结算方式，受控组件
 */
import React, { useEffect, useState } from 'react'
import { pxTransform, preload, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Empty from '@/components/Empty'
import { SelectOptions } from '@/components/Select'
import Cell from '@/components/Cell'
import { CategoryType, getCategoryAllKeys } from './utils'
import './index.scss'

export type ClassifyValueType = {
  /**
   * 发票类型
   */
  invoiceType: number
  /**
   * 税点，只要百分比的分子部分，不要转换为小数
   */
  taxPoint: number
  /**
   * 预付款
   */
  advanceCharge: number
  /**
   * 结算单据
   */
  settlementDocuments: number
  /**
   * 付款方式
   */
  paymentType: number
  /**
   * 结算方式
   */
  payType: number
  month?: number
  monthDay?: number
  days?: number
  details: CategoryType[]
}[]

export type ClassifyPreviewData = {
  /**
   * 结算方式
   */
  payType: string
  /**
   * 账期，几月
   */
  month: string
  /**
   * 结算日，每月几号
   */
  monthDay: string
  /**
   * 结算天数
   */
  days: string
  /**
   * 付款方式
   */
  paymentType?: string
  /**
   * 发票类型
   */
  invoiceType: string
  /**
   * 税点
   */
  taxPoint: string
  /**
   * 预付款
   */
  advanceCharge: string
  /**
   * 结算单据
   */
  settlementDocuments: string
  /**
   * 品类
   */
  details: string[]
}[]

export interface ClassifyPayTypeProps {
  /**
   * 值
   */
  value?: ClassifyValueType
  /**
   * 资质证明改变触发事件
   */
  onChange?: (value: ClassifyValueType) => void
  /**
   * 展示的数据
   */
  data?: ClassifyPreviewData
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 自定义渲染样式
   */
  customStyle?: React.CSSProperties
  /**
   * 结算方式选项
   */
  payTypes?: SelectOptions
  /**
   * 预付款选项
   */
  advanceCharges?: SelectOptions
  /**
   * 结算单据选项
   */
  settlementDocuments?: SelectOptions
  /**
   * 付款方式选项
   */
  paymentTypes?: SelectOptions
  /**
   * 发票类型选项
   */
  invoiceTypes?: SelectOptions
  /**
   * 税点选项
   */
  taxPoints?: SelectOptions
}

const ClassifyPayType: React.FC<ClassifyPayTypeProps> = (props: ClassifyPayTypeProps) => {
  const {
    value = [
      {
        payType: '',
        month: '',
        monthDay: '',
        days: '',
        paymentType: '',
        invoiceType: '',
        taxPoint: '0',
        advanceCharge: '',
        settlementDocuments: '',
        details: ['全部'],
      },
    ],
    onChange,
    data,
    editable,
    customStyle,
    payTypes,
    advanceCharges,
    settlementDocuments,
    paymentTypes,
    invoiceTypes,
    taxPoints,
  } = props

  const params = getCurrentInstance().preloadData as any

  const [previewData, setPreviewData] = useState<ClassifyPreviewData>(value)

  useEffect(() => {
    if ('data' in props && data) {
      setPreviewData(data)
    }
  }, [data])

  const handleClassifyPayTypeChange = (value: ClassifyValueType, namesMaps: Record<string, any>[]) => {
    onChange?.(value)
    const normalized: ClassifyPreviewData = namesMaps.map(
      ({ details, ...rest }) =>
        ({
          ...rest,
          details: details?.map((item) => item.join('-')) || ['全部'],
        } as ClassifyPreviewData[0]),
    )
    setPreviewData(normalized)
  }

  const handleJump = () => {
    preload({
      ...params,
      onConfirm: handleClassifyPayTypeChange,
      defaultValue: value?.map(({ details, ...rest }) => ({
        ...rest,
        details: details[0] && details[0] != '全部' ? getCategoryAllKeys(details) : ['全部'],
      })),
      payTypes,
      advanceCharges,
      settlementDocuments,
      paymentTypes,
      invoiceTypes,
      taxPoints,
    })
    Router.navigateTo('supplierAbility/supplierDepositClassifyPayType/index')
  }

  return (
    <MellowCard
      title="结算方式"
      extra={editable ? <Shuttle describe="添加结算方式" onJump={handleJump} /> : null}
      bodyStyle={{
        padding: 0,
      }}
      headStyle={{
        paddingRight: 0,
        paddingLeft: 0,
        marginRight: pxTransform(themeLayout['margin-s']),
        marginLeft: pxTransform(themeLayout['margin-s']),
      }}
      style={customStyle}
    >
      <View className="classify-payType-list">
        {previewData?.map((item, index) => (
          <View className="classify-payType-list-item" key={index}>
            <View className="classify-payType-list-item-title">{`结算方式${index + 1}`}</View>
            <Cell border={false} transposition>
              <Cell.Item title="预付款" value={item.advanceCharge} />
              <Cell.Item title="结算单据" value={item.settlementDocuments} />
              <Cell.Item
                title="结算方式"
                value={`${item.payType || ''}${+item?.month ? '：' + item.month + '个月' : ''}${
                  +item?.monthDay ? `，结算日：` + item.monthDay + '号' : ''
                }${+item?.days ? '：' + item.days + '天' : ''}`}
                customHeadStyle={{
                  alignItems: 'flex-start',
                }}
              />
              <Cell.Item title="付款方式" value={item.paymentType} />
              <Cell.Item title="发票类型" value={item.invoiceType} />
              <Cell.Item title="税点" value={`${item.taxPoint}%`} />
              <Cell.Item
                title="适用品类"
                value={item.details?.join('，')}
                customHeadStyle={{
                  alignItems: 'flex-start',
                }}
              />
            </Cell>
          </View>
        ))}
        {!previewData || !previewData.length ? <Empty /> : null}
      </View>
    </MellowCard>
  )
}

export default ClassifyPayType
