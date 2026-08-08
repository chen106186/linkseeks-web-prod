/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-21 11:13:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-16 14:29:47
 * @Description:
 */
import type { TableProps, ColumnType } from 'antd/lib/table'
import { PaginationProps } from 'antd/lib/pagination'
import { SearchFormIProps } from './SearchForm'

export type PaginationPositionType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

export type SearchValuesType = { [key: string]: any }

export type FetchParamsType = SearchValuesType & {
  /**
   * 当前页
   */
  current?: number
  /**
   * 当前页数
   */
  pageSize?: number
}

export type FetchResponse<T> = {
  /**
   * 数据
   */
  data: T[]
  /**
   * 总条数
   */
  totalCount: number
}

export type NormalTableRefHandleType = {
  /**
   * 重新加载数据
   */
  reload: (params?: FetchParamsType & { [key: string]: any }) => void
}

export interface NormalTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  /**
   * 获取数据方法，如果外部有传入 dataSource 则无效
   */
  fetchDataSource?: (params: FetchParamsType) => Promise<FetchResponse<T>>
  /**
   * 查询formily表单props
   */
  searchFormProps?: SearchFormIProps
  /**
   * 自定义渲染查询Form
   */
  customRenderSearchForm?: () => React.ReactNode
  /**
   * 查询formily提交触发事件
   */
  onSearchSubmit?: (values: SearchValuesType) => void
  /**
   * 分页器props，默认 current 1，默认 pageSize 10
   */
  pagination?: PaginationProps | null
  /**
   * 分页器位置，默认 bottomRight
   */
  paginationPosition?: PaginationPositionType
  /**
   * 默认 current，只在首次请求生效
   */
  defaultCurrent?: number
  /**
   * 默认 pageSize
   */
  defaultPageSize?: number
  /**
   * 分页器改变触发事件
   */
  onPaginationChange?: (page: number, size: number) => void
  /**
   * 是否占满父容器，默认为false，注意当开启该属性会跟 scroll 属性冲突
   */
  full?: boolean
  /**
   * 渲染底部内容
   */
  renderFootContent?: () => React.ReactNode
}

export interface EditableCellProps {
  onSave?: (row: any) => void
  onValidateError?: (error: any) => void
  record?: any
  index?: number
  dataIndex?: string | number
  title?: React.ReactNode
  editable?: boolean
  children?: React.ReactNode
  rules?: Array<any>
  addonAfter?: React.ReactNode
}

export interface ChangedFieldsItem {
  errors: string[]
  name: string[]
  touched: boolean
  validating: boolean
  value: string
}

export interface EditableRowProps extends React.HTMLAttributes<HTMLElement> {
  onFieldsChange?: (changedFields: ChangedFieldsItem[]) => void
}

export interface EditableColumns<T = any> extends ColumnType<T> {
  dataIndex?: string | number
  editable?: boolean
  rules?: Array<any>
}
