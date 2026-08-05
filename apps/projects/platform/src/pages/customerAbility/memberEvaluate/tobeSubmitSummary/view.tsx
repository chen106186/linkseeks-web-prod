import React, { useRef, useState } from 'react'
import { Card, Space, Button, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { evaluationListSchema } from '../schema'
import useFetchList from '../hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getMemberCustomerAppraisalWaitSubmitPage,
  GetMemberAppraisalWaitSubmitPageRequest,
  GetMemberAppraisalWaitSubmitPageResponseDetail,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { querySchema } from '../tobeEvaluate/schema'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const defaultColumns = setColumnsByLinks(
  {
    detail: '/customerAbility/memberEvaluate/tobeSubmitSummary/detail',
  },
  ['totalScore'],
)

interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const intl = useIntl()
  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalWaitSubmitPageResponseDetail>(
    defaultColumns,
    [
      {
        title: `${intl.formatMessage({
          id: 'member.memberInspection.common.columns.index.operate',
        })}`,
        render: (_text, _record) =>
          _record.submitOrUpdate && (
            <DetailAuthButton>
              <Space>
                <Link to={`/customerAbility/memberEvaluate/tobeSubmitSummary/detail?id=${_record.id}`}>
                  {intl.formatMessage({
                    id: 'member.memberEvaluate.components.FormilySelectMember.index.submit',
                  })}
                </Link>
                {/* <Link to={`/customerAbility/memberEvaluate/tobeSubmitSummary/detail?id=${_record.id}`}>{ intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.index.edit'}) }</Link> */}
              </Space>
            </DetailAuthButton>
          ),
      },
    ],
  )
  const handleFetch = async (params: GetMemberAppraisalWaitSubmitPageRequest) => {
    const result = fetchListData(getMemberCustomerAppraisalWaitSubmitPage, params)
    return result
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={columns}
          schema={querySchema}
          fetchListData={handleFetch}
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
