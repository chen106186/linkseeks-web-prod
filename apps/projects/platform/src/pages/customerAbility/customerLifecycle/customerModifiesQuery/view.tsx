/*
 * @Description: 变更申请单查询
 */
import React, { useMemo, useRef } from 'react'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import { formatTimeString } from '@/utils'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  GetMemberCustomerLifecycleSummaryPageResponseDetail,
  getMemberCustomerLifecycleSummaryPage,
  getMemberCustomerLifecycleStatusList,
} from '@apps/apis'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { querySchema } from './querySchema'
import modifiesColumn from '../common/columns/modifiesColumn'

const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  changeRequestFormNo: string
  changeRequestSummary: string
  changeRequestFromTimeStart: string
  changeRequestFromTimeEnd: string
  current: string
  pageSize: string
  status: string
}

const CustomerModifiesQueryIndex: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const ref = useRef<any>({})

  const intl = useIntl()

  const { name } = usePageStatus()

  const initialQueryValue = useMemo(
    () => ({
      name,
    }),
    [],
  )

  const defaultColumns = modifiesColumn<GetMemberCustomerLifecycleSummaryPageResponseDetail>(pathname)

  const fetchList = async (params: SearchFormValuesType) => {
    const { changeRequestFormNo, changeRequestFromTimeStart, changeRequestFromTimeEnd, ...rest } = params
    const payload: any = { ...rest }
    if (changeRequestFormNo) {
      payload.changeRequestFormNo = changeRequestFormNo
    }
    if (changeRequestFromTimeStart) {
      payload.changeRequestFromTimeStart = formatTimeString(+changeRequestFromTimeStart)
    }
    if (changeRequestFromTimeEnd) {
      payload.changeRequestFromTimeEnd = formatTimeString(+changeRequestFromTimeEnd)
    }
    const mergedPayload = {
      ...initialQueryValue,
      ...payload,
    }
    try {
      const res = await getMemberCustomerLifecycleSummaryPage(mergedPayload, { ctlType: 'none' })
      if (res.code === 1000) {
        return res.data
      }
      return { data: [], totalCount: 0 }
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
  }

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberCustomerLifecycleStatusList()

    if (res.code === 1000) {
      const { data } = res
      return {
        status: data?.map((item) => ({ label: item.message, value: item.code })),
      }
    }
    return {}
  }

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={defaultColumns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchList(params)}
          controlRender={
            <NiceForm
              initialValues={initialQueryValue}
              actions={formActions}
              onSubmit={handleReloadList}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(['status'], fetchSelectOptions)
              }}
              schema={querySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CustomerModifiesQueryIndex
