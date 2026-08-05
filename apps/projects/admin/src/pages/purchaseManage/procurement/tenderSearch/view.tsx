import React from 'react'
import { useSelfTable } from './model/useSelfTable'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { postPurchaseInviteTenderPlatformGetSubmitTenderList } from '@apps/apis'

const TenderSearch: React.FC<{}> = () => {
  const { ref, columns } = useSelfTable()

  const fetchTableData = async (params) => {
    const { data } = await postPurchaseInviteTenderPlatformGetSubmitTenderList(params, { ctlType: 'none' })
    return data
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchTableData(params)}
        rowKey="id"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default TenderSearch
