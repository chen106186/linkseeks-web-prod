/*
 * @Description: 供应商入库分类信息
 */
import React, { useMemo } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { themeLayout } from '@/constants/theme'
import CellListCard, { CellListCardProps } from '../CellListCard'
import ClassifyPayType, { ClassifyPreviewData } from '../ClassifyPayType'
import { CategoryType, getCategoryAllNames } from '../ClassifyPayType/utils'
import './index.scss'

export type CategoriesItemType = {
  /**
   * 入库分类信息-会员编码
   */
  code: string
  /**
   * 入库分类信息-合作关系名称
   */
  partnerTypeName: string
  /**
   * 入库分类信息-单次合作金额
   */
  maxAmount: string
  /**
   * 入库分类信息-适用区域 ,String
   */
  classifyAreas: string[]
  /**
   * 入库分类信息-主营品类 ,BusinessCategoryQueryVO
   */
  categories: {
    /**
     * 品类信息id
     */
    id: number
    /**
     * 品类列表 ,BusinessCategoryDetailQueryVO
     */
    details: {
      /**
       * 品类层级
       */
      level?: number
      /**
       * 品类Id
       */
      categoryId?: number
      /**
       * 父Id
       */
      parentId?: number
      /**
       * 品类名称
       */
      name?: string
      /**
       * 子品类 ,BusinessCategoryDetailQueryVO
       */
      children?: {}[]
    }[]
    /**
     * 结算方式，1-现结，2-账期(按天),3-账期(按月)，4-月结
     */
    payType: number
    /**
     * 结算方式名称
     */
    payTypeName: string
    /**
     * 月，结算方式为账期(按月)时大于0
     */
    month: number
    /**
     * 每月几号，结算方式为“账期(按月)”或“月结”时大于0
     */
    monthDay: number
    /**
     * 天，结算方式为账期(按天)时大于0
     */
    days: number
    /**
     * 发票类型，1-增值税专用发票，2-普通发票，3-机动车专用发票，4-机打发票，5-定额发票
     */
    invoiceType: number
    /**
     * 发票类型名称
     */
    invoiceTypeName: string
    /**
     * 税点，百分比的分子部分
     */
    taxPoint: string
    /**
     * 预付款：0:不需预付1：需要预付
     */
    advanceCharge: number
    /**
     * 预付款名称
     */
    advanceChargeName: string
    /**
     * 结算单据枚举,1、订单,2、物流单,3、生产通知单,4、发货单,5、收货单,6、发票单,7、收货单+发票单
     */
    settlementDocuments: number
    /**
     * 结算单据名称
     */
    settlementDocumentsName: string
    /**
     * 付款方式枚举,1、现金,2、转账,3、支票,4、电汇（TT）,5、信汇,6、银行汇票,7、银行承兑汇票3个月,8、银行承兑汇票6个月,9、DP付款交单,10、DA承兑交单,11、LC信用证
     */
    paymentType: number
    /**
     * 付款方式名称
     */
    paymentTypeName: string
  }[]
}

export interface SupplierClassifyInfoProps extends Omit<CellListCardProps, 'dataSource'> {
  /**
   * 考察信息
   */
  data: CategoriesItemType
}

const SupplierClassifyInfo: React.FC<SupplierClassifyInfoProps> = (props: SupplierClassifyInfoProps) => {
  const { data, ...restProps } = props

  const dataSource = useMemo(
    () => [
      {
        title: '会员编码',
        value: data?.code,
      },
      {
        title: '合作关系',
        value: data?.partnerTypeName,
      },
      {
        title: '单次合作金额',
        value: data?.maxAmount,
      },
      {
        title: '币别',
        value: data?.currencyTypeName,
      },
      {
        title: '备注',
        value: data?.remark,
      },
      {
        title: '适用区域',
        value: data?.classifyAreas.join('，'),
      },
    ],
    [data],
  )

  const previewData = useMemo(() => {
    const ret: ClassifyPreviewData = []
    if (data && data.categories) {
      for (let i = 0; i < data.categories.length; i++) {
        const item = data.categories[i]
        const entity: ClassifyPreviewData[0] = {
          payType: item.payTypeName,
          month: `${item.month}`,
          monthDay: `${item.monthDay}`,
          days: `${item.days}`,
          paymentType: item.paymentTypeName,
          invoiceType: item.invoiceTypeName,
          taxPoint: item.taxPoint,
          advanceCharge: item.advanceChargeName,
          settlementDocuments: item.settlementDocumentsName,
          details: item.details[0]
            ? getCategoryAllNames(item.details as unknown as CategoryType[]).map((item) => item.join('-'))
            : ['全部'],
        }
        ret.push(entity)
      }
    }
    return ret
  }, [data, data?.categories])

  return (
    <>
      <CellListCard title="分类信息" dataSource={dataSource} {...restProps} />
      <ClassifyPayType
        data={previewData}
        customStyle={{
          marginTop: pxTransform(themeLayout['padding-xs']),
        }}
      />
    </>
  )
}

export default SupplierClassifyInfo
