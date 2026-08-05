---
group:
  title: 重型组件
---

# StandardFormTable

系统中用处最广泛的组件之一，几乎所有页面都有该组件的身影.

该组件主要包括两部分，上方表单搜索栏，下方表格显示栏，其中主要通过 columns 来控制整个组件的运作，通过配置即可获得表格的搜索，查询，分类等功能

### 基本用法

通常来说，我们有两个参数是必传的，`request`, `columns`， 这决定了该组件该以怎样的形式渲染

```jsx
import { StandardFormTable } from '@apps/components'

const dataList = [
  { id: 1, name: 'bob', age: 18 },
  { id: 2, name: 'bob', age: 18 },
  { id: 3, name: 'bob', age: 18 },
  { id: 4, name: 'bob', age: 18 },
  { id: 5, name: 'bob', age: 18 },
  { id: 6, name: 'bob', age: 18 },
  { id: 7, name: 'bob', age: 18 },
  { id: 8, name: 'bob', age: 18 },
  { id: 9, name: 'bob', age: 18 },
  { id: 10, name: 'bob', age: 18 },

  { id: 11, name: 'jim', age: 18 },
  { id: 12, name: 'jim', age: 18 },
  { id: 13, name: 'jim', age: 18 },
  { id: 14, name: 'jim', age: 18 },
  { id: 15, name: 'jim', age: 18 },
  { id: 16, name: 'jim', age: 18 },
  { id: 17, name: 'jim', age: 18 },
  { id: 18, name: 'jim', age: 18 },
  { id: 19, name: 'jim', age: 18 },
  { id: 20, name: 'jim', age: 18 },
]
const mockFetchList = ({ pageSize, current }) => {
  const mockData = {
    totalCount: dataList.length,
    data: dataList.slice(pageSize * (current - 1)),
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1 * 1000)
  })
}

export default () => {
  const columns = [
    {
      key: 'name',
      title: '名称',
      searchField: {
        main: true,
      },
    },
    {
      key: 'age',
      title: '年龄',
      searchField: 'Input',
    },
    {
      key: 'status',
      title: '状态',
      hidden: true,
      searchField: { name: 'status', type: 'Select' },
    },
    {
      key: 'date',
      title: '日期',
      hidden: true,
      searchField: [
        { name: 'startDate', title: '开始时间', type: 'DateSelect' },
        { name: 'endDate', title: '结束时间', type: 'DateSelect' },
      ],
    },
  ]
  return (
    <StandardFormTable
      request={mockFetchList}
      columns={columns}
      searchButtons={[{ children: '新增', icon: 'add', type: 'primary' }, { children: '审核' }, { children: '导出' }]}
    />
  )
}
```

### columns

在组件中，我们可以使用导出的 RecordColumns 来获得类型提示

其中有几个值得一提的参数和传统的 table 是有所不同的

- `key`
  - 每个 columnsItem 都应该有一个唯一 key
  - 将决定该项如果被搜索时可默认作为搜索项的`name`
  - 以前我们需要显式指定`dataIndex`用来操作表格显示的实际值，那么默认情况下`key`将作为`dataIndex`输入，若外部传入了`dataIndex`则优先级更高
- `searchField`

  - 如果配置了，代表该项将会被用作搜索，其中是通过配置一个`main`参数，来指明该字段属于高级筛选的默认筛选
  - 关于该字段有多种写法

    - 最简单的则是直接传入一个字符串(字段类型)，这会被解析成使用某一个搜索控件，例如

      `const columns = [{ key: 'name', searchField: 'input' }]`

    - 更多的时候我们会传入一个对象

      `const columns = [{ key: 'name', searchField: { type: 'input' } }]`

      > 注意这里没有给对象传递 name，则默认会取上层的 key 作为 name 值

    - 有时候会希望一个字段可出现两个搜索值，那么允许传递一个数组对象

      `const columns = [ { key: 'name', searchField: [ { type: 'input', name: 'startDate' }, { type: 'input', name: 'endDate' } ] } ]`

      :::warning 要注意的是，这里对象中是必须要指定 name 的，因为不可能取一样的 name 值 :::

  - 当字段类型为下拉框时，这里有两种实现方式
    - 当下拉框接口是分开请求的，可通过`valueEnum`字段传入一个固定的对象数组[{label: value}]形式
    - 当下拉框接口是一次性请求过来的，可通过 StandardFormTable 传入一个`searchSelectMaps`属性，这里的对象中的 key，对应 columns 中的 key
  - 如果需要扩展更多的字段类型请看[搜索字段类型](#搜索字段类型)

- `hidden`
  - 默认为 false，当设置为 true 时，该项不会在表格中显示
  - 通常可用作不在表格显示但可以筛选的情况
- `format`
  - 通常我们会使用`render`对表格项进行一些个性化的转化，例如时间戳转日期，例如各种审核状态，那么该字段将提供一些内置使用的渲染方案
  - 值得一提的是，由于有时候个性化的组件需要获得一些参数，那么我们提供了`formatPayload`一个默认对象，外部使用者可通过该对象传入参数供内部消费
  - 详情请看[格式化类型](#格式化类型)

### 搜索字段类型

```ts
enum SearchField {
  Input = 'input',
  Search = 'search',
  Select = 'select',
  Date = 'date',
  DateSelect = 'dateSelect',
  SearchSelect = 'searchSelect',
  NumberRanage = 'numberRanage',
}
```

### 格式化类型

```ts
enum RenderColumnItemFormat {
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
```

## StandardFormTableProps

```ts
export interface StandardFormTableProps<RecordType> extends TableProps<RecordType> {
  /**
   * 表格请求，刷新都是使用这个
   */
  request: any
  /**
   * 列
   */
  columns: RecordColumns<RecordType>[]

  rowKey?: string

  /**
   * 提供表格相关的一些方法，如reload
   */
  actionRef?: RefObject<ActionType>
  /**
   * 表单操作按钮
   */
  searchButtons?: SearchButtonsType[]

  /**
   * 搜索栏中，下拉框的统一调用
   * @todo 暂时不用，因为这个字段的使用需要后端将下拉框接口 将字段统一成{label, value}形式，在这之前可通过searchSelectMaps传递进来
   */
  searchSelectRequest?: any

  /**
   * 为搜索栏中，下拉框提供初始数据，这里的key会对应columns的key
   */
  searchSelectMaps?: any

  tableProps?: TableProps<RecordType>

  /**
   * 是否可编辑单元格
   *
   * 使用useEditTable hook即可直接传入
   *
   * 若设置了该属性，则columns上的editable开关开始生效
   */
  editableProps?: EditColProps

  /**
   * 是否开启选择功能
   */
  isRowSelection?: boolean

  /**
   * 是否需要自动推断滚动条显示
   */
  autoScrollX?: boolean
}
```
