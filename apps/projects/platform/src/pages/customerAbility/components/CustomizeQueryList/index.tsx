/**
 * 通用的列表页
 */

import React, { useImperativeHandle, useRef } from 'react'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { createFormActions, ISchema } from '@apps/formily'
import { ColumnsType } from 'antd/es/table'

interface Iprops {
  columns: ColumnsType
  schema: ISchema
  fetchListData: (params: any) => Promise<{ totalCount: number; data: any[] }>
  /**
   * 格式化搜索参数
   */
  formatData?: <T, P>(params: T) => P
  effects: ($: any, actions: any) => void
  expressionScope?: any
  components?: any
  tableProps?: {
    rowKey: string | ((record: any) => any)
  }
  rowSelection?: {
    type?: 'radio' | 'checkbox'
    onSelect?: (record: any, selected: boolean, selectedRows: any[]) => void
    selectedRowKeys?: string[] | number[]
  } & { [key: string]: any }
  ref?: any
}

const formActions = createFormActions()

const CustomizeQueryList: React.FC<Iprops> = React.forwardRef((props: Iprops, ref: any) => {
  const { columns, schema, fetchListData, expressionScope, effects, rowSelection, tableProps, formatData, components } =
    props
  const tableRef = useRef<any>({})

  useImperativeHandle(ref, () => ({
    reload: (value: any) => {
      tableRef.current?.reload(value)
    },
    submit: () => {
      formActions.submit()
    },
  }))

  const handleEffects = ($, action) => {
    effects?.($, action)
  }

  const onRresh = (values: any) => {
    const data = formatData?.(values) || values
    console.log('format', data)
    tableRef.current?.reload(data)
  }

  return (
    // <Card>
    <StandardTable
      scroll={{ x: 1600 }}
      tableProps={tableProps}
      rowSelection={rowSelection}
      columns={columns}
      currentRef={tableRef}
      fetchTableData={(params: any) => fetchListData(params)}
      controlRender={
        <NiceForm
          schema={schema}
          actions={formActions}
          onSubmit={(values) => onRresh(values)}
          expressionScope={expressionScope}
          components={components}
          effects={($, actions) => handleEffects($, actions)}
        />
      }
    />
    // </Card>
  )
})

CustomizeQueryList.defaultProps = {
  expressionScope: {},
  components: {},
  effects: null,
  tableProps: {
    rowKey: 'id',
  },
  rowSelection: null,
}

export default CustomizeQueryList
