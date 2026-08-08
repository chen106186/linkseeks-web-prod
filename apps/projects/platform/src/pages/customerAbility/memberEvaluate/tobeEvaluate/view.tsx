import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Card, Space } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { querySchema } from './schema'
import useFetchList from '../hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { getMemberCustomerAppraisalWaitGradePage, GetMemberAppraisalWaitGradePageResponseDetail } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { Link } from '@linkseeks/router-core'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface Iprops {}
const defaultColumns = setColumnsByLinks(
  {
    detail: '/customerAbility/memberEvaluate/tobeEvaluate/detail',
  },
  ['totalScore'],
)

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const intl = useIntl()

  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalWaitGradePageResponseDetail>(
    defaultColumns,
    [
      {
        title: `${intl.formatMessage({
          id: 'member.memberInspection.common.columns.index.operate',
        })}`,
        render: (_text, _record) => (
          <DetailAuthButton>
            <Space>
              <Link to={`/customerAbility/memberEvaluate/tobeEvaluate/detail?id=${_record.id}`}>
                {intl.formatMessage({
                  id: 'member.memberEvaluate.tobeEvaluate.detail.evaluateScore',
                })}
              </Link>
            </Space>
          </DetailAuthButton>
        ),
      },
    ],
  )

  const handleFetch = async (params) => {
    const result = fetchListData(getMemberCustomerAppraisalWaitGradePage, params)
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
