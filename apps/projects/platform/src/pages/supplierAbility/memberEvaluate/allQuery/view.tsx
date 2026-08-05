import { useIntl } from '@linkseeks/i18n'
import React, { useRef } from 'react'
import { Card, Space, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { querySchema } from './schema'
import useFetchList from '../hooks/useFetchList'
import { createFormActions } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
// import { GetMemberAppraisalWaitPublishPageRequest, GetMemberAppraisalWaitPublishPageResponse, GetMemberAppraisalWaitPublishPageResponseDetail } from '@apps/apis';
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  GetMemberAppraisalSummaryPageResponseDetail,
  GetMemberAppraisalSummaryPageRequest,
  GetMemberAppraisalSummaryPageResponse,
  getMemberSupplierAppraisalSummaryPage,
} from '@apps/apis'

// const formActions = createFormActions();
const defaultColumns = setColumnsByLinks({
  detail: '/supplierAbility/memberEvaluate/allQuery/detail',
})
interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalSummaryPageResponseDetail>(
    defaultColumns,
    [],
  )
  const intl = useIntl()
  const controllerBtns = (
    <div>
      <Link to={'/supplierAbility/memberEvaluate/createEvaluate/add'}>
        <Button type="primary">
          <PlusOutlined />
          {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
        </Button>
      </Link>
    </div>
  )

  const handleFetch = async (params: Partial<GetMemberAppraisalSummaryPageRequest>) => {
    const result = fetchListData<Partial<GetMemberAppraisalSummaryPageRequest>, GetMemberAppraisalSummaryPageResponse>(
      getMemberSupplierAppraisalSummaryPage,
      params,
    )
    return result
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={columns}
          schema={querySchema}
          fetchListData={handleFetch}
          expressionScope={{
            controllerBtns,
          }}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            useAsyncSelect('status', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
