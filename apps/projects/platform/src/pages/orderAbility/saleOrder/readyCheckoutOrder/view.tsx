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
import { getOrderVendorValidateVerifyPage } from '@apps/apis'
import '../index.less'

// 待核销自提订单

export interface ReadyCheckoutOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorValidateVerifyPage(params)
  return data
}

const ReadyCheckoutOrder: React.FC<ReadyCheckoutOrderProps> = () => {
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

ReadyCheckoutOrder.defaultProps = {}

export default ReadyCheckoutOrder
