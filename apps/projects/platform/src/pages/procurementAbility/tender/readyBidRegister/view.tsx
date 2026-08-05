import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import { postPurchaseSubmitTenderGetSubmitTenderRegisterList } from '@apps/apis'

// 待招标报名 投标

export interface ReadyBidRegisterProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseSubmitTenderGetSubmitTenderRegisterList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const ReadyBidRegister: React.FC<ReadyBidRegisterProps> = (props) => {
  const { columns, ref } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          currentRef={ref}
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

ReadyBidRegister.defaultProps = {}

export default ReadyBidRegister
