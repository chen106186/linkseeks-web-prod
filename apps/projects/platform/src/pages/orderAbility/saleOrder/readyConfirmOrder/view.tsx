import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from '../constant'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import { getOrderVendorValidateConfirmPage } from '@apps/apis'

// 待确认订单

export interface ReadyConfirmOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorValidateConfirmPage(params)
  return data
}

const ReadyConfirmOrder: React.FC<ReadyConfirmOrderProps> = () => {
  const { columns } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          rowKey={'orderNo'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
          }}
          tableProps={{
            scroll: { x: 1200 },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

ReadyConfirmOrder.defaultProps = {}

export default ReadyConfirmOrder
