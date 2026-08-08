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
import { getOrderVendorValidateReceiptConfirmPage } from '@apps/apis'
import '../index.less'

// 待确认回单

export interface ReadyConfirmReturnOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorValidateReceiptConfirmPage(params)
  return data
}

const ReadyConfirmReturnOrder: React.FC<ReadyConfirmReturnOrderProps> = (props) => {
  const { columns } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          tableProps={{ rowKey: 'orderId', scroll: { x: '100%' } }}
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
        />
      </Card>
    </PageHeaderWrapper>
  )
}

ReadyConfirmReturnOrder.defaultProps = {}

export default ReadyConfirmReturnOrder
