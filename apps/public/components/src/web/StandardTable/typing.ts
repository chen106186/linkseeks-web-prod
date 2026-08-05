import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { FormInstance, FormProps } from 'antd/lib/form'
import { NamePath } from 'antd/lib/form/interface'
import { SpinProps } from 'antd/lib/spin'
import { ColumnType, TableProps } from 'antd/lib/table'
import { CSSProperties, ReactNode } from 'react'
import { ColumnsState } from './Provide'
import {
  LightWrapperProps,
  ProSchema,
  ProSchemaComponentTypes,
  ProTableEditableFnType,
  SearchTransformKeyFn,
} from './utils/typing'
import type { ColumnFilterItem, CompareFn } from 'antd/lib/table/interface'
import type { ListToolBarProps } from './components/ListToolBar'

export type PageInfo = {
  pageSize: number
  total: number
  current: number
  simple?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  size?: 'default' | 'small' | undefined
  pageSizeOptions?: string[]
}

/** 操作类型 */
export type ActionType<T = {}> = {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>
  /** @name 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>
  /** @name 重置任何输入项，包括表单 */
  reset?: () => void
  /** @name 清空选择 */
  clearSelected?: () => void
  /** @name p页面的信息都在里面 */
  pageInfo?: PageInfo
  setPageInfo?: (page: Partial<PageInfo>) => void
} & T

export type UseFetchDataAction<T = any> = {
  dataSource: T[]
  setDataSource: (dataSource: T[]) => void
  loading: boolean | SpinProps | undefined
  pageInfo: PageInfo
  reload: () => Promise<void>
  fullScreen?: () => void
  reset: () => void
  pollingLoading: boolean
  setPageInfo: (pageInfo: Partial<PageInfo>) => void
}

export type ExtraProColumnType<T> = Omit<
  ColumnType<T>,
  'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter'
> & {
  sorter?:
    | string
    | boolean
    | CompareFn<T>
    | {
        compare?: CompareFn<T>
        /** Config multiple sorter order priority */
        multiple?: number
      }
}

export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType<T> & {
    index?: number
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number

    /** 搜索表单的默认值 */
    initialValue?: any

    /** @name 是否缩略 */
    ellipsis?: ColumnType<T>['ellipsis']
    /** @name 是否拷贝 */
    copyable?: boolean

    /** @deprecated Use `search=false` instead 在查询表单中隐藏 */
    hideInSearch?: boolean

    /** 在查询表单中隐藏 */
    search?:
      | false
      | {
          /**
           * Transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
           *
           * @name 转化值的key, 一般用于事件区间的转化
           */
          transform: SearchTransformKeyFn
        }

    /** @name 在 table 中隐藏 */
    hideInTable?: boolean

    /** @name 在新建表单中删除 */
    hideInForm?: boolean

    /** @name 不在配置工具中显示 */
    hideInSetting?: boolean

    /** @name 表头的筛选菜单项 */
    filters?: boolean | ColumnFilterItem[]

    /** @name 筛选的函数，设置为 false 会关闭自带的本地筛选 */
    onFilter?: boolean | ColumnType<T>['onFilter']

    /** @name Form 的排序 */
    order?: number

    /** @name 可编辑表格是否可编辑 */
    editable?: boolean | ProTableEditableFnType<T>

    /** @private */
    listKey?: string

    /** @name 只读 */
    readonly?: boolean

    /** @name 列设置的 disabled */
    disable?:
      | boolean
      | {
          checkbox: boolean
        }
  },
  ProSchemaComponentTypes,
  ValueType,
  {
    lightProps?: LightWrapperProps
  }
>

export type ProColumnGroupType<RecordType, ValueType> = {
  children: ProColumns<RecordType>[]
} & ProColumnType<RecordType, ValueType>

export type ProColumns<T = any, ValueType = 'text'> = ProColumnGroupType<T, ValueType> | ProColumnType<T, ValueType>

export type RequestData<T> = {
  data: T[] | undefined
  success?: boolean
  totalCount?: number
} & Record<string, any>

/**
 * 用于定义 useFetch 的参数类型
 * @typedef {Object} UseFetchProps
 * @property {any} [dataSource] - 数据源，可选参数
 * @property {UseFetchDataAction['loading']} loading - 数据加载状态，必须参数
 * @property {(loading: UseFetchDataAction['loading']) => void} [onLoadingChange] - 加载状态改变时的回调函数，可选参数
 * @property {(dataSource: any[], extra: any) => void} [onLoad] - 数据加载完成时的回调函数，可选参数
 * @property {(dataSource?: any) => void} [onDataSourceChange] - 数据源改变时的回调函数，可选参数
 * @property {any} postData - 发送到后端的数据，必须参数
 * @property {{current?: number; pageSize?: number; defaultCurrent?: number; defaultPageSize?: number;} | false} pageInfo - 分页信息，可选参数，false 表示不启用分页
 * @property {(pageInfo: PageInfo) => void} [onPageInfoChange] - 分页信息改变时的回调函数，可选参数
 * @property {any[]} [effects] - 依赖的其它 Hook 或其它变量，可选参数
 * @property {(e: Error) => void} [onRequestError] - 请求出错时的回调函数，可选参数
 * @property {boolean} manual - 是否手动触发请求，必须参数
 * @property {number} [debounceTime] - 延迟时间，可选参数，单位为毫秒
 * @property {number | ((dataSource: any[]) => number)} [polling] - 轮询时间，可选参数，单位为毫秒或一个返回时间的函数
 * @property {boolean} [revalidateOnFocus] - 是否在焦点回到页面时重新验证数据，可选参数
 */
export type UseFetchProps = {
  /**
   * 数据源
   * @type {any}
   */
  dataSource?: any

  /**
   * 是否处于加载状态
   * @type {UseFetchDataAction['loading']}
   */
  loading: UseFetchDataAction['loading']

  /**
   * 加载状态改变时的回调函数
   * @type {(loading: UseFetchDataAction['loading']) => void}
   */
  onLoadingChange?: (loading: UseFetchDataAction['loading']) => void

  /**
   * 数据加载完成后的回调函数
   * @type {(dataSource: any[], extra: any) => void}
   */
  onLoad?: (dataSource: any[], extra: any) => void

  /**
   * 数据源变化时的回调函数
   * @type {(dataSource?: any) => void}
   */
  onDataSourceChange?: (dataSource?: any) => void

  /**
   * 请求时附带的数据
   * @type {any}
   */
  postData: (dataSource: any[]) => any[]

  /**
   * 分页信息
   * @type {{
   *   current?: number;
   *   pageSize?: number;
   *   defaultCurrent?: number;
   *   defaultPageSize?: number;
   * } | false}
   */
  pageInfo:
    | {
        current?: number
        pageSize?: number
        defaultCurrent?: number
        defaultPageSize?: number
      }
    | false

  /**
   * 分页信息变化时的回调函数
   * @type {(pageInfo: PageInfo) => void}
   */
  onPageInfoChange?: (pageInfo: PageInfo) => void

  /**
   * 请求相关的副作用
   * @type {any[]}
   */
  effects?: any[]

  /**
   * 请求出错时的回调函数
   * @type {(e: Error) => void}
   */
  onRequestError?: (e: Error) => void

  /**
   * 是否手动触发请求
   * @type {boolean}
   */
  manual: boolean

  /**
   * 请求防抖时间
   * @type {number}
   */
  debounceTime?: number

  /**
   * 数据源轮询间隔时间或轮询触发条件
   * @type {number | ((dataSource: any[]) => number)}
   */
  polling?: number | ((dataSource: any[]) => number)

  /**
   * 是否在页面获得焦点时重新验证数据
   * @type {Boolean}
   */
  revalidateOnFocus?: boolean
}

export type BorderedType = 'search' | 'table'

export type Bordered =
  | boolean
  | {
      search?: boolean
      table?: boolean
    }

// 支持的变形，还未完全支持完毕
/** 支持的变形，还未完全支持完毕 */
export type ComponentTypes = 'form' | 'list' | 'descriptions' | 'table' | 'cardList' | undefined

export type RowEditableType = 'single' | 'multiple'

export type ActionTypeText<T> = {
  deleteText?: React.ReactNode
  cancelText?: React.ReactNode
  saveText?: React.ReactNode
  editorType?: 'Array' | 'Map'
  addEditRecord?: (row: T, options?: AddLineOptions) => boolean
}

export type ActionRenderConfig<T, LineConfig = NewLineConfig<T>> = {
  editableKeys?: RowEditableConfig<T>['editableKeys']
  recordKey: RecordKey
  index?: number
  cancelEditable: (key: RecordKey) => void
  onSave: RowEditableConfig<T>['onSave']
  onCancel: RowEditableConfig<T>['onCancel']
  onDelete?: RowEditableConfig<T>['onDelete']
  deletePopconfirmMessage: RowEditableConfig<T>['deletePopconfirmMessage']
  setEditableRowKeys: (value: React.Key[]) => void
  newLineConfig?: LineConfig
  tableName?: NamePath

  children?: React.ReactNode
} & ActionTypeText<T>

export type AddLineOptions = {
  position?: 'top' | 'bottom'
  recordKey?: RecordKey
  newRecordType?: 'dataSource' | 'cache'
  /** 要增加到哪个节点下，一般用于多重嵌套表格 */
  parentKey?: RecordKey
}

export type NewLineConfig<T> = {
  defaultValue?: T
  options: AddLineOptions
}

export type ActionRenderFunction<T> = (
  row: T,
  config: ActionRenderConfig<T, NewLineConfig<T>>,
  defaultDoms: {
    save: React.ReactNode
    delete: React.ReactNode
    cancel: React.ReactNode
  },
) => React.ReactNode[]

export type RecordKey = React.Key | React.Key[]

export type RowEditableConfig<DataType> = {
  /** @name 控制可编辑表格的 From的设置 */
  formProps?: Omit<
    FormProps<DataType> & {
      formRef?: React.Ref<FormInstance | undefined>
      onInit?: (values: DataType, form: FormInstance) => void
    },
    'onFinish'
  >
  /** @name 控制可编辑表格的 form */
  form?: FormInstance
  /**
   * @type single | multiple
   * @name 编辑的类型，支持单选和多选
   */
  type?: RowEditableType
  /** @name 正在编辑的列 */
  editableKeys?: React.Key[]
  /** 正在编辑的列修改的时候 */
  onChange?: (editableKeys: React.Key[], editableRows: DataType[] | DataType) => void
  /** 正在编辑的列修改的时候 */
  onValuesChange?: (record: DataType, dataSource: DataType[]) => void
  /** @name 自定义编辑的操作 */
  actionRender?: ActionRenderFunction<DataType>
  /** 行保存的时候 */
  onSave?: (
    /** 行 id，一般是唯一id */
    key: RecordKey,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number },
    /** 新建一行的配置，一般无用 */
    newLineConfig?: NewLineConfig<DataType>,
  ) => Promise<any | void>

  /** 行保存的时候 */
  onCancel?: (
    /** 行 id，一般是唯一id */
    key: RecordKey,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number },
    /** 新建一行的配置，一般无用 */
    newLineConfig?: NewLineConfig<DataType>,
  ) => Promise<any | void>
  /** 行删除的时候 */
  onDelete?: (key: RecordKey, row: DataType & { index?: number }) => Promise<any | void>
  /** 删除行时的确认消息 */
  deletePopconfirmMessage?: React.ReactNode
  /** 只能编辑一行的的提示 */
  onlyOneLineEditorAlertMessage?: React.ReactNode
  /** 同时只能新增一行的提示 */
  onlyAddOneLineAlertMessage?: React.ReactNode
  /** Table 上设置的name，用于拼接name来获取数据 */
  tableName?: NamePath
  /** 保存一行的文字 */
  saveText?: React.ReactNode
  /** 取消编辑一行的文字 */
  cancelText?: React.ReactNode
  /** 删除一行的文字 */
  deleteText?: React.ReactNode
}

export type TableTypes = 'small' | 'normal'

export type DensitySize = 'middle' | 'small' | 'large' | undefined

// BaseQueryFilterProps
export type SearchConfig = {
  filterType?: 'query' | 'light'
}

export type TableRowSelection = TableProps<any>['rowSelection']

export type ColumnStateType = {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   *
   * @param localStorage 设置在关闭浏览器后也是存在的
   * @param sessionStorage 关闭浏览器后会丢失
   */
  persistenceType?: 'localStorage' | 'sessionStorage'
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  defaultValue?: Record<string, ColumnsState>
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  value?: Record<string, ColumnsState>
  onChange?: (map: Record<string, ColumnsState>) => void
}

export type IStandardTableProps<RecordType, ValueType = 'text'> = {
  // onRowDoubleClick?: (record: TableRowSelection<RecordType>) => void
  /** @name 选择项配置 */
  rowSelection?:
    | TableProps<RecordType>['rowSelection'] & {
        alwaysShowAlert?: boolean
      }

  style?: React.CSSProperties
  /** 支持 ProTable 的类型 */
  type?: ComponentTypes
  /**
   * @name 初始化的参数，可以操作 table
   *
   * @example 重新刷新表格
   * currentRef.current?.reload();
   *
   * @example 重置表格
   * currentRef.current?.resetField();
   */
  currentRef?: React.Ref<ActionType | undefined>
  /** 自定义Table控制层 */
  controlRender?: React.ReactNode
  /** @name 一个获得 dataSource 的方法 */
  fetchTableData?: (
    params: {
      pageSize?: number
      current?: number
      keyword?: string
    } & Record<string, any>,
  ) => Promise<Partial<RequestData<RecordType>>>
  /** @name 对数据进行一些处理 */
  postData?: any
  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params?: Record<string, any>
  /** @name 去抖时间 */
  debounceTime?: number
  /**
   * 只在request 存在的时候生效，可编辑表格也不会生效
   *
   * @default true
   * @name 窗口聚焦时自动重新请求
   */
  revalidateOnFocus?: boolean
  // 可在上方的表单前后增加jsx元素, children为formily元素， pagination为自定义分页器
  formRender?: (children: ReactNode, pagination?: ReactNode) => ReactNode
  /** 可配置的table属性， 用于覆盖默认table配置 */
  tableProps?: TableProps<RecordType>
  /** 引入可配置的国际化 */
  formatMessage?: (params?: any) => string
  /**
   * 'small' | 'normal'
   * 当值为small时，会将分页器隐藏
   */
  tableType?: TableTypes
  /** 是否开启记录页码状态和筛选状态 */
  keepAlive?: boolean
  /** 自定义样式 */
  tableClassName?: string
  /** @name 默认的数据 */
  defaultData?: RecordType[]
  /**
   * @name, 可编辑表格的name,通过这个name 可以直接与 form通信，无需嵌套
   */
  name?: NamePath
  /**
   * @name 编辑行相关的配置
   *
   * @example 支持多行编辑
   * editable={{type:"multiple"}}
   *
   * @example 保存的时候请求后端
   * editable={{ onSave:async (rows)=>{ await save(rows) } }}
   */
  editable?: RowEditableConfig<RecordType>
  /**
   * @name 可编辑表格修改数据的改变
   */
  onDataSourceChange?: (dataSource: RecordType[]) => void
  /**
   * @name 数据加载完成后触发
   */
  onLoad?: (dataSource: RecordType[]) => void

  /**
   * @name loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean | SpinProps | undefined) => void

  /**
   * @name 数据加载失败时触发
   */
  onRequestError?: (e: Error) => void
  /**
   * 是否轮询 ProTable 它不会自动提交表单，如果你想自动提交表单的功能，需要在 onValueChange 中调用 formRef.current?.submit()
   *
   * @param dataSource 返回当前的表单数据，你可以用它判断要不要打开轮询
   */
  polling?: number | ((dataSource: RecordType[]) => number)
  /**
   * @type SearchConfig
   * @name 是否显示搜索表单
   */
  search?: false | SearchConfig
  onSizeChange?: (size: DensitySize) => void
  /** @name 给封装的 table 的 style */
  tableStyle?: CSSProperties
  /** 默认的表格大小 */
  defaultSize?: SizeType
  /** @name 是否手动触发请求 */
  manualRequest?: boolean
  /** @name 空值时显示 */
  columnEmptyText?: string | false
  /**
   * @name 操作自带的 form
   */
  formRef?: any // TableFormItem<RecordType>['formRef'];
  /** @name 格式化搜索表单提交数据 */
  beforeSearchSubmit?: (params: Partial<Record<string, any>>) => any
  /** @name 列状态的配置，可以用来操作列功能 */
  columnsState?: ColumnStateType
  /**
   * @name 列配置能力，支持一个数组
   */
  columns?: ProColumns<RecordType, ValueType>[]
  /**
   * @name ListToolBar 的属性
   */
  toolbar?: ListToolBarProps
  /** @name 提交表单时触发 */
  onSubmit?: (params: Record<string, any>) => void
  /** @name 重置表单时触发 */
  onReset?: () => void
} & Omit<TableProps<RecordType>, 'columns' | 'rowSelection'>
