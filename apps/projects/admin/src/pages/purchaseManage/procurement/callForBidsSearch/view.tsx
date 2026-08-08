import React from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { postPurchaseInviteTenderPlatformGetInviteTenderList } from '@apps/apis'

const callForBidsSearch: React.FC<{}> = () => {
  const { ref, columns } = useSelfTable()

  const fetchTableData = async (params) => {
    const payload = { ...params }
    const { data } = await postPurchaseInviteTenderPlatformGetInviteTenderList(payload, { ctlType: 'none' })
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

export default callForBidsSearch
