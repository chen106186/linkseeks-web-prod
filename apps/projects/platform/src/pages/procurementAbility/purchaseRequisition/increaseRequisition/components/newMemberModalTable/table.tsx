import React, { useEffect, useRef } from 'react'
import NiceForm from '@/components/NiceForm'
import StandardTable from '@/components/StandardTable'
import {
  createFormActions,
  FormEffectHooks,
  IAntdSchemaFormProps,
  ISchemaFormActions,
  ISchemaFormAsyncActions,
} from '@apps/formily'
import { ColumnType } from 'antd/lib/table/interface'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { isEmpty } from 'lodash'

export interface TableProps {
  /** 接口 */
  fetchdata?(queryParams?: any): Promise<any>
  /** 列表表头 */
  columns: ColumnType<any>[]
  tableProps?: {
    rowKey: string | ((record) => any)
  }
  mode?: 'checkbox' | 'radio'
  customizeRadio?: boolean
  customKey?: string
  /** 搜索的schema */
  schema?: any
  /** schema搜索第一个的name */
  effects?: string
  /** 是否可选 */
  ctl?: boolean
  currRef?: any
  /** 状态选择接口 */
  useBusinessEffects?: (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => void
  scroll?: {
    x?: string | number | true
    y?: string | number
  }
  searchFormProps?: IAntdSchemaFormProps
  /**
   * 格式化submit values方法
   */
  onFormatSubmitValues?: (values: any) => any
}

const formActions = createFormActions()

const TableLayout: React.FC<TableProps> = (props: TableProps) => {
  const selfRef = useRef<any>({})
  const {
    fetchdata,
    columns,
    tableProps,
    mode,
    customizeRadio,
    customKey,
    schema,
    effects,
    ctl,
    currRef,
    useBusinessEffects,
    scroll,
    searchFormProps,
    onFormatSubmitValues,
  } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({
    type: customizeRadio && mode === 'radio' ? 'checkbox' : mode,
    customKey: customKey,
  })

  const search = (values: any) => {
    if (onFormatSubmitValues) {
      values = onFormatSubmitValues(values)
    }
    selfRef.current.reload(values)
  }

  useEffect(() => {
    if (currRef) {
      currRef.current = {
        RowCtl,
        rowSelection,
      }
    }
  }, [RowCtl, rowSelection])

  return (
    <StandardTable
      keepAlive={false}
      currentRef={selfRef}
      columns={columns}
      tableProps={tableProps}
      rowSelection={
        ctl && {
          ...rowSelection,
          hideSelectAll: customizeRadio,
        }
      }
      scroll={!isEmpty(scroll) && scroll}
      fetchTableData={(params: any) => fetchdata(params)}
      controlRender={
        <NiceForm
          actions={formActions}
          onSubmit={(values) => search(values)}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, effects, FORM_FILTER_PATH)
            FormEffectHooks.onFieldChange$('category').subscribe((state) => {
              searchSelectGetSelectCategoryOptionEffect(actions, 'category')
            })
            useBusinessEffects && useBusinessEffects($, actions)
          }}
          schema={schema}
          {...searchFormProps}
        ></NiceForm>
      }
    />
  )
}

TableLayout.defaultProps = {
  mode: 'radio',
  ctl: true,
  customizeRadio: false,
  tableProps: {
    rowKey: 'memberId',
  },
}

export default TableLayout
