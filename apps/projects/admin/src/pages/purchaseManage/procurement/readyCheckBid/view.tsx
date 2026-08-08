import React, { useState } from 'react'
import { message } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'

const fetchTableData = async (params) => {
  // const payload = { ...params }
  // const { data } = await postPurchaseInviteTenderPlatformGetCheckInviteTenderList({
  //   ...payload
  // }, { ctlType: "none" })
  return []
}

// 待审核 招标
const ReadyCheckBid: React.FC = (props) => {
  const { columns, ref } = useSelfTable()

  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmitBatch = async () => {
    if (ref.current.selectionKeys.length === 0) {
      message.error('请先选择招标')
      return
    }
    // const canBitch = !ref.current.getSelectionItems().some(v => v.inviteTenderOutStatus !== BidOuterWorkState.Platform_Not_Check_Invite_Tender)
    // if (canBitch) {
    // setLoading(true)
    // postPurchaseInviteTenderPlatformPlatformCheckInviteTenderBatch({idList: ref.current.selectionKeys}).then(res => {
    //   if(res.code === 1000) {
    //     ref.current.reload()
    //   }
    // }).finally(() => setLoading(false))

    // } else {
    //   message.error('只能批量提交外部状态为待平台审核招标的招标')
    // }
  }
  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchTableData(params)}
        rowKey="id"
        actionRef={ref}
        isRowSelection
        searchButtons={[
          {
            key: 'examineBatch',
            children: '批量审核通过',
            loading: loading,
            onClick() {
              handleSubmitBatch()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default ReadyCheckBid
