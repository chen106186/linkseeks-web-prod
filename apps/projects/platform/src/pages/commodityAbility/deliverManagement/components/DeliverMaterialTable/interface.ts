import type React from 'react'
import type { GetMemberManageSupplyMemberResponseDetail } from '@apps/apis'
import type { Moment } from 'moment'

export type Enums = { value: string | number; label: string }[]

export type ShopListItem = {
  /**
   * 序号
   */
  index: number
  /**
   * 商品id
   */
  skuId: string
  /**
   * 商品名字
   */
  name: string
  /**
   * 品类
   */
  category: string
  /**
   * 品类id
   */
  categoryId: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 需求数量
   */
  demandQuantity: string
  /**
   * 需求时间
   */
  demandTime: Moment
  /**
   * 需求人
   */
  demandPerson: string
  /**
   * 需求部门
   */
  demandDepartment: string
  /**
   * 需求附件
   */
  attachment: any[]
  /**
   * 只读列表
   */
  readOnlyList: {
    skuId: boolean
    name: boolean
    spec: boolean
    category: boolean
    brand: boolean
  }
  /**
   * 数据源 来源1.选择已有商品、物料 2.自建商品、物料
   */
  source: number
  /**
   * 禁用
   */
  disabled: boolean
  /**
   * 规格型号
   */
  spec: string
  /**
   * 全部只读
   */
  readOnlyAll?: boolean
  // 以下是为了兼容srm
  /**
   * id
   */
  id?: number
  /**
   * 品类名称
   */
  customerCategoryName?: string
  /**
   * 品类id
   */
  customerCategoryId?: string
  /**
   * 品牌名称
   */
  brandName?: string
  /**
   * 单位名称
   */
  unitName?: string
  /**
   * 规格名称
   */
  type?: string
  /**
   * 规格名称
   */
  unitEnums?: Enums
}

export type Props = {
  /**
   * 是否显示选择商品弹窗
   */
  showSelectModalBtn?: boolean
  /**
   * 是否显示添加按钮
   */
  showAddBtn?: boolean
  /**
   * 角色类型 1:srm 2:b2b
   */
  roleType?: 1 | 2
  /**
   * 外部传递进来的表格列描述数据对象
   */
  columns: Record<string, any>[]
  /**
   * 扩展显示表格上面内容
   */
  prefix?: React.ReactNode
  /**
   * 扩展显示表格下面内容
   */
  suffix?: React.ReactNode
  /**
   * 表格数据
   */
  dataSource?: ShopListItem[]
  /**
   * 表格行 key 的取值
   */
  rowKey: string
  /**
   * 弹窗选择数据的回调事件
   */
  confirm?: (item: ShopListItem[]) => void
  /**
   * 自定义表格单元格内各个文本框或操作栏回调事件
   */
  handleChange?: (record: ShopListItem, dataIndex: keyof ShopListItem) => void
  /**
   * 添加按钮事件
   */
  addHandle?: (e: Event) => void
  /**
   * 是否提示未选择商品的消息弹窗
   */
  showWarning?: boolean
  /**
   * 外部传递进来选择的会员信息
   */
  supplier?: {
    current: Partial<GetMemberManageSupplyMemberResponseDetail>
  }
  /**
   * 外部传递进来的单位信息
   */
  selectUnit?: {
    current: Enums
  }
  /**
   * 物料/商品的key
   */
  shopTableKey?: string
  isFieldComponent?: boolean
  /**
   * 可拓展的其他参数
   */
  [key: string]: any
}

export interface DeliverMaterialTableProps {
  props?: {
    'x-component-props': Props
    [key: string]: any
  }
  value?: ShopListItem[]
  dataSource?: Props['dataSource']
  isFieldComponent?: boolean
}
