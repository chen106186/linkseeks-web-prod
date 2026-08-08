/**
 * 规则引擎-表格共用
 * @author: Crayon
 */
import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import NiceForm from '@/components/NiceForm'
import { ISchema } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { tableFormSchema } from './schema'

type PropsType = {
  rowKey?: string
  searchKey?: string
  schema?: ISchema
  fetchApi: Function
  fetchParams?: Object
  columns: ColumnType<any>[]
}

const CommonTable: React.FC<PropsType> = (props) => {
  const {
    schema = tableFormSchema,
    fetchApi,
    fetchParams = {},
    columns,
    searchKey = 'name',
    rowKey = 'processId',
  } = props
  const ref = useRef<any>({})
  const formActions = createFormActions()

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      fetchApi?.({
        ...params,
        ...fetchParams,
      }).then(({ code, data }) => {
        if (code === 1000) {
          resolve(data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          currentRef={ref}
          columns={columns}
          tableProps={{ rowKey }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, searchKey, FORM_FILTER_PATH)
              }}
              schema={schema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CommonTable
