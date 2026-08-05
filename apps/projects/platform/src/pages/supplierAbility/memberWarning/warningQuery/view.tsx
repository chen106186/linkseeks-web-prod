import React from 'react'
import { Card, Space, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import queryColumns from '../common/columns/queryColumns'
import querySchema from '../common/schema/querySchema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import useColumns from '../../memberRectification/common/hooks/useColumns'

interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const { columns } = useColumns(queryColumns)

  const handleFetch = async (params) => {
    // const result = fetchListData(getMemberSupplierAbilitySubPage, params);
    return {
      totalCount: 0,
      data: [],
    }
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
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
