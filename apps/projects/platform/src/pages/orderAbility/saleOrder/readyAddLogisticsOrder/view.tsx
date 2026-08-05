import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import { useSelfTable } from './model/useSelfTable'
import { getOrderVendorCreateLogisticsPage } from '@apps/apis'

// 待新增物流单

export interface ReadyAddLogisticsOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderVendorCreateLogisticsPage(params)
  return data
}

const ReadyAddLogisticsOrder: React.FC<ReadyAddLogisticsOrderProps> = (props) => {
  const { columns } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          rowKey="orderNo"
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

ReadyAddLogisticsOrder.defaultProps = {}

export default ReadyAddLogisticsOrder
