/** 考评结果查询 > 考评结果查询 */
import React from 'react'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import useFetchList from '../hooks/useFetchList'
import searchSchema from './searchSchema'
import moment from 'moment'
import { getMemberCustomerAppraisalResultPage, GetMemberCustomerAppraisalResultPageResponseDetail } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const intl = getIntl()

const List: React.FC<{}> = () => {
  const { pathname } = useLocation()
  const { fetchListData } = useFetchList()
  const handleFetch = async (params) => {
    const result = fetchListData(getMemberCustomerAppraisalResultPage, params)
    return result
  }

  const commonColumns: ColumnsType<GetMemberCustomerAppraisalResultPageResponseDetail> = [
    {
      title: intl.formatMessage({ id: 'supplier.supplierEvaluationResults.list.number', defaultMessage: '序号' }),
      width: 96,
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'supplier.supplierEvaluationResults.list.name',
        defaultMessage: '归属供应商名称',
      }),
      dataIndex: 'upperName',
      width: 360,
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierEvaluationResults.list.themes', defaultMessage: '考评主题' }),
      dataIndex: 'subject',
      width: 360,
      render: (subject, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`${pathname}/detail?id=${record.id}`}
        >
          {subject}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierEvaluationResults.list.scope', defaultMessage: '考评范围' }),
      dataIndex: 'appraisalDayStart',
      width: 320,
      render: (appraisalDayStart, record) => {
        return (
          <div>
            {`${appraisalDayStart} ${intl.formatMessage({ id: 'common.text.to', defaultMessage: '至' })} ${
              record.appraisalDayEnd
            }`}
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierEvaluationResults.list.time', defaultMessage: '考评完成时间' }),
      dataIndex: 'completeDay',
      width: 240,
      sorter: (_a, _b) =>
        moment(_a.completeDay, 'YYYY-MM-DD').valueOf() - moment(_b.completeDay, 'YYYY-MM-DD').valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierEvaluationResults.list.score', defaultMessage: '考评最终分' }),
      dataIndex: 'totalScore',
      width: 240,
      sorter: (_a, _b) => _a.totalScore - _b.totalScore,
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={commonColumns}
          schema={searchSchema}
          fetchListData={handleFetch}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'upperName', FORM_FILTER_PATH)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
