import React from 'react'
import { Card, Space, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { setColumnsByLinks } from '../common/columns/queryColumns'
import { querySchema } from '../tobeConfirmRectification/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import useColumns from '../common/hooks/useColumns'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getMemberSupplierRectifySummaryPage, GetMemberRectifySummaryPageRequest } from '@apps/apis'

interface Iprops {}

const queryColumns = setColumnsByLinks({
  detail: '/supplierAbility/memberRectification/rectificationQuery/detail',
})

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const { columns, fetchStatusOptions } = useColumns(queryColumns, [], { key: 'outerStatus' })
  const intl = useIntl()
  const controllerBtns = (
    <div>
      <Link to={'/supplierAbility/memberRectification/rectificationAdd/add'}>
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
        </Button>
      </Link>
    </div>
  )

  const handleFetch = async (params: GetMemberRectifySummaryPageRequest) => {
    const result = fetchListData(getMemberSupplierRectifySummaryPage, params)
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
            useAsyncSelect('outerStatus', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
