import React from 'react'
import { Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from './schema'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import { postPurchaseSubmitTenderGetSubmitTenderList } from '@apps/apis'

const TenderSearch: React.FC<{}> = () => {
  const { ref, columns } = useSelfTable()

  const fetchTableData = async (params) => {
    let _params = params.submitTenderInStatusList
      ? { ...params, submitTenderInStatusList: [params.submitTenderInStatusList] }
      : { ...params }
    let __params = _params.submitTenderOutStatusList
      ? {
          ..._params,
          submitTenderOutStatusList: [_params.submitTenderOutStatusList],
        }
      : {
          ..._params,
          // submitTenderOutStatusList: [
          //   TenderOutWorkState.Not_Submit_Tender,
          //   TenderOutWorkState.Not_Open_Tender,
          //   TenderOutWorkState.Not_Selection_Tender,
          //   TenderOutWorkState.Not_Win_Notice,
          //   TenderOutWorkState.Finish_Invite_Tender,
          //   TenderOutWorkState.Discard_Tender
          // ]
        }
    const { data } = await postPurchaseSubmitTenderGetSubmitTenderList(__params, { ctlType: 'none' })
    return data
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          currentRef={ref}
          columns={columns}
          rowKey={'id'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'submitTenderCode', FORM_FILTER_PATH)
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

export default TenderSearch
