import { useIntl, getIntl } from '@linkseeks/i18n'
import React from 'react'
import { Card, Space, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { setColumnsByLinks } from '../common/columns/queryColumns'
import { querySchema } from './schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getMemberSupplierRectifyWaitConfirmPage } from '@apps/apis'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import useColumns from '../common/hooks/useColumns'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const intl = getIntl()

interface Iprops {}

const queryColumns = setColumnsByLinks(
  {
    detail: '/supplierAbility/memberRectification/tobeConfirmRectification/detail',
  },
  ['agreeResultName'],
)

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const intl = useIntl()
  const { columns, fetchStatusOptions } = useColumns(
    queryColumns,
    [
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
        render: (text, record) => {
          const { sendOrUpdateOrDel } = record
          if (!record.confirm) {
            return null
          }
          return (
            <DetailAuthButton>
              <Space>
                <Link to={`/supplierAbility/memberRectification/tobeConfirmRectification/detail?id=${record.id}`}>
                  {intl.formatMessage({
                    id: 'member.memberEvaluate.tobeEvaluate.detail.confirm',
                  })}
                </Link>
              </Space>
            </DetailAuthButton>
          )
        },
      },
    ],
    { key: 'outerStatus' },
  )

  const handleFetch = async (params) => {
    const result = fetchListData(getMemberSupplierRectifyWaitConfirmPage, params)
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
            useAsyncSelect('outerStatus', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
