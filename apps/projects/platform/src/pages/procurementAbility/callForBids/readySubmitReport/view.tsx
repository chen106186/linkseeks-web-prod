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
import { postPurchaseInviteTenderGetEvaluationTenderReportList } from '@apps/apis'

// 待提交评标报告

export interface ReadySubmitReportProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseInviteTenderGetEvaluationTenderReportList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const ReadySubmitReport: React.FC<ReadySubmitReportProps> = (props) => {
  const { columns, ref } = useSelfTable()

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
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

ReadySubmitReport.defaultProps = {}

export default ReadySubmitReport
