import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import Detail from './view'

const GroupCommodityDetail: React.FC<{}> = (props: any) => {
  const { groupId, skuId } = useQuery()

  return <Detail {...props} type={3} groupId={Number(groupId)} skuId={skuId} />
}

export default GroupCommodityDetail
