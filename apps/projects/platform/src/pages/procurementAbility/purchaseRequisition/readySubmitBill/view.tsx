import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model/useSelfTable'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import { tableListSchema } from '../constant'
import { getPurchaseRequisitionSubmitPage } from '@apps/apis'
import { getMemberUserPage } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'

// 待提交请购单

export interface ReadySubmitBillProps {}

const fetchTableData = async (params) => {
  const { data } = await getPurchaseRequisitionSubmitPage(params)
  return data
}

const ReadySubmitBill: React.FC<ReadySubmitBillProps> = () => {
  const { columns, ref } = useSelfTable()
  const formActions = createFormActions()
  const handleSearch = async (value) => {
    if (!value) {
      formActions.setFieldState('requisitionerId', (fieldState) => {
        fieldState.props.enum = []
      })
      return
    }
    const data: any = { name: value, status: '1', pageSize: 10, current: 1 }
    const res = await getMemberUserPage(data)
    const list = res.data.data.map((item) => {
      return { label: item.name, value: item.userId }
    })
    formActions.setFieldState('requisitionerId', (fieldState) => {
      fieldState.props.enum = list
    })
  }
  const controllerBtns = null
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          currentRef={ref}
          rowKey="id"
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
                handleSearch,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'requisitionNo', FORM_FILTER_PATH)
              }}
              schema={tableListSchema()}
              components={{
                DateRangePickerUnix,
                Submit,
              }}
            />
          }
          tableProps={{
            scroll: {
              x: '100%',
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

ReadySubmitBill.defaultProps = {}

export default ReadySubmitBill
