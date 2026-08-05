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
import '../index.less'
import { getOrderBuyerCreateReceivePage } from '@apps/apis'

// 待新增采购收货单

export interface ReadyAddPurchaseReceiveOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerCreateReceivePage(params)
  return data
}

const ReadyAddPurchaseReceiveOrder: React.FC<ReadyAddPurchaseReceiveOrderProps> = () => {
  const { columns, ref } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'orderNo', scroll: { x: '100%' } }}
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

ReadyAddPurchaseReceiveOrder.defaultProps = {}

export default ReadyAddPurchaseReceiveOrder
