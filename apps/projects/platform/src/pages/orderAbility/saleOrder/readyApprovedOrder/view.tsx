import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useSelfTable } from './model/useSelfTable'
import '../index.less'
import { tableListSchema } from '../constant'
import { getOrderVendorValidateSubmitPage } from '@apps/apis'

// 待提交审核订单

export interface ReadyApprovedOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorValidateSubmitPage(params)
  return data
}

const ReadyApprovedOrder: React.FC<ReadyApprovedOrderProps> = () => {
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

ReadyApprovedOrder.defaultProps = {}

export default ReadyApprovedOrder
