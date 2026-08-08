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
import { getOrderBuyerValidatePayPage } from '@apps/apis'

// 待支付订单

export interface ReadyPayOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerValidatePayPage(params)
  return data
}

const ReadyPayOrder: React.FC<ReadyPayOrderProps> = () => {
  const { ref, columns } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          currentRef={ref}
          columns={columns}
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

ReadyPayOrder.defaultProps = {}

export default ReadyPayOrder
