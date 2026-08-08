/*
 * @Description: 待审核变更申请单(二级)
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card } from 'antd'
import { formatTimeString } from '@/utils'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  GetMemberSupplierLifecycleWaitConfirmPageResponseDetail,
  getMemberSupplierLifecycleWaitConfirmPage,
} from '@apps/apis'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import modifiesColumn from '../common/columns/modifiesColumn'
import useModifiesQuerySchema from '../common/schemas/useModifiesQuerySchema'
import { useWebIntl } from '@apps/locales'

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

const SupplierModifiesConfirmIndex: React.FC<any> = (props) => {
  const { pathname } = useLocation()

  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()
  const handleJumpVerify = (record: GetMemberSupplierLifecycleWaitConfirmPageResponseDetail) => {
    history.push(`${pathname}/edit?id=${record.id}`)
  }

  const defaultColumns = modifiesColumn<GetMemberSupplierLifecycleWaitConfirmPageResponseDetail>(pathname).concat({
    title: translate('web.common.control'),
    dataIndex: 'actions',
    align: 'center',
    fixed: 'right',
    width: 200,
    render: (text: any, record) => (
      <>
        <EditAuthButton>
          <Button type="link" onClick={() => handleJumpVerify(record)}>
            {translate('web.common.approved')}
          </Button>
        </EditAuthButton>
      </>
    ),
  })

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
    try {
      const res = await getMemberSupplierLifecycleWaitConfirmPage(payload, { ctlType: 'none' })
      if (res.code === 1000) {
        return res.data
      }
      return { data: [], totalCount: 0 }
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
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
              actions={formActions}
              onSubmit={handleReloadList}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              }}
              schema={useModifiesQuerySchema()}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default SupplierModifiesConfirmIndex
