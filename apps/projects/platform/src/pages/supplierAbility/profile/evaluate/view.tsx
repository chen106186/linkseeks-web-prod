import React from 'react'
import { Card, Space } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useEvaluateColumn from '../../memberEvaluate/hooks/useEvaluateColumn'
import { querySchema } from '../../memberEvaluate/tobeEvaluate/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { getMemberSupplierAppraisalResultPage, GetMemberAppraisalWaitGradePageResponseDetail } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { commonColumns } from './common/columns'

interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const handleFetch = async (params) => {
    const result = fetchListData(getMemberSupplierAppraisalResultPage, params)
    return result
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={commonColumns}
          schema={querySchema}
          fetchListData={handleFetch}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
