import { ButtonProps } from '@linkseeks/ui/src/Button'
import { FormInstance, FormItemProps } from '@linkseeks/ui'
import { ColumnType } from 'antd/lib/table'
import useEditTable from './hooks/useEditTable'
import { ReactElement, ReactNode } from 'react'

export type ActionType = {
  // 会重置表单，注意注入有传入初始化值，则会重置到初始化值的时候
  reset(): void
  // 不会重置表单，只是发起请求
  reload(): void
  submit(): void
  /**
   * 多选状态下，被选中的key
   */
  selectionKeys: any[]

  /**
   * 多选状态下，选中的项
   */
  selectionItems: any[]
  /**
   * 在开启多选状态下，可手动设置多选的key
   */
  setSelectionKeys(keys: any[]): void

  setSelectionItems(items: any[], isConcat?: boolean): void
  /**
   * 开启多选状态下，可以获取到选中项的当前行数据
   */
  getSelectionItems(): any[]

  /**
   * 清空所有选中内容
   */
  clearSelection(): void
}
type SearchFieldTuple = keyof typeof SearchField

interface OptionEnum {
  label: string
  value: any
  children?: OptionEnum[]
}
export interface SearchFieldProps extends FormItemProps {
  type?: SearchFieldTuple
  /**
   * 会自动取columns上的key作为name
   */
  name?: string | string[]

  // 会自动取columns上的title
  title?: any

  /**
   * 该字段在整个表单中的排序
   */
  order?: number

  /**
   * 作为高级筛选的搜索项, 一个columns中只应该出现一个main字段
   */
  main?: boolean | { name: string }

  /**
   * 下拉框手动指定下拉数据，该优先级最高，会覆盖掉自动填充的数据
   */
  valueEnum?: OptionEnum[]

  /**
   * 是否有联动方法
   */
  linkage?(value, searchAction: LinkageAction, tableAction): void

  /**
   * 是否显示在页面上
   */
  display?: boolean

  /**
   * 可传入数组，对应name的顺序
   */
  placeholder?: string | string[]

  /**
   * 字段取值时使用不同key
   */
  fieldValueProps?: {
    label?: string
    value?: string
    children?: string
    disabled?: string
  }

  /**
   * 组件属性，当使用内置字段时，该属性会传给对应的组件
   */
  componentProps?: any
  [key: string]: any
}

interface FieldAction {
  hide(): void
  show(): void
}
/**
 * 联动可调用的方法
 */
export interface LinkageAction {
  (name: string): FieldAction
}
export type SearchFieldSet = SearchFieldTuple | SearchFieldProps | SearchFieldProps[]
export interface RecordColumns<RecordType = any> extends ColumnType<RecordType> {
  // 设置key为必填，同时会关联dataIndex

  key: string

  /**
   * 搜索字段
   *
   * 若需要表格字段出现在头部可被筛选，则可以通过这个字段进行配置，查询时会自动收集该字段的值
   *
   * 总共有三种使用方式
   *
   * @example
   *
   * 'Select'	// 使用字符串
   *
   * { name: 'status', type: 'Select' } // 传入一个对象，重新指定name，这样就不会跟随表格字段，而是自定义字段
   *
   * [{ name: 'status', type: 'Select' }, { name: 'age', type: 'Input' }]  // 可传入一个数组，该数组会再次解析，有时候一个字段会被拆成多个筛选条件，即可覆盖该场景
   */
  searchField?: SearchFieldSet

  // 是否隐藏，不显示在表格中, 常用于不需要在表格中显示，但可以进行筛选的场景
  hidden?: boolean

  /**
   * 可用于状态值切换时调用的方法
   */
  confirm?(record: RecordType): any

  /**
   * 支持自动格式化显示内容，但优先级没有render高
   */
  format?: RenderColumnsItemFormatTuple

  /**
   * 当使用自动格式化后，如果格式化需要传递参数的，可使用该属性
   *
   * 默认是传递一个对象，这个对象可以是任意的key value组合
   */
  formatPayload?: Record<string, any>

  /**
   * 是否可编辑该单元格
   */
  editable?: boolean
}

export interface SearchButtonsProps extends ButtonProps {}
export type SearchButtonIconType = 'add' | 'delete' | (string & {})

export interface SearchButtonsType extends ButtonProps {
  icon?: SearchButtonIconType | ReactElement
  key?: string
  toolTip?: string
  // 是否包裹在更多列表里面
  more?: boolean
}

/**
 * columns可以自动渲染格式的类型
 */
export enum RenderColumnItemFormat {
  Date = 'date',
  /**
   * 是否有效无效
   */
  Enabled = 'enabled',
  Control = 'control',
  /**
   * 状态值显示-带颜色
   */
  Status = 'status',
}

export type RenderColumnsItemFormatTuple = keyof typeof RenderColumnItemFormat

export enum SearchField {
  Input = 'input',
  InputNumber = 'inputNumber',
  Search = 'search',
  Select = 'select',
  Date = 'date',
  DateSelect = 'dateSelect',
  SearchSelect = 'searchSelect',
  NumberRanage = 'numberRanage',
  Cascader = 'cascader',
  DateRange = 'DateRange',
}

export interface FormSearchType extends FormInstance {}

export type EditColProps = ReturnType<typeof useEditTable>
