import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import { postPurchaseInviteTenderGetWinTenderList } from '@apps/apis'

// 待发送中标公示 招标

export interface ReadyConfirmBidProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseInviteTenderGetWinTenderList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const ReadySendBidNotice: React.FC<ReadyConfirmBidProps> = (props) => {
  const {
    columns,
    ref,
    // rowSelection,
    // rowSelectionCtl
  } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          // rowSelection={rowSelection}
          columns={columns}
          currentRef={ref}
          rowKey={'id'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'inviteTenderCode', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 16,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

ReadySendBidNotice.defaultProps = {}

export default ReadySendBidNotice
