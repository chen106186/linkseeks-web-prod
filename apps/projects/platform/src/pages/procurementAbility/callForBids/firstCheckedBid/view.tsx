import React from 'react'
import { Card, Button, Space, message } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import '../../utils/index.less'
import {
  postPurchaseInviteTenderCheckInviteTenderBatch,
  postPurchaseInviteTenderGetCheckInviteTenderList,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
const intl = getIntl()
// 一级待审核 招标

export interface FirstCheckedBidProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseInviteTenderGetCheckInviteTenderList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const FirstCheckedBid: React.FC<FirstCheckedBidProps> = (props) => {
  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()

  const { run, loading } = useHttpRequest(postPurchaseInviteTenderCheckInviteTenderBatch)

  const handleSubmitBatch = async () => {
    if (rowSelectionCtl.selectRow.length === 0) {
      message.error(intl.formatMessage({ id: 'table.purchase.qingxianxuanzezhao' }))
      return
    }
    // const canBitch = !rowSelectionCtl.selectRow.some(v => v.inviteTenderInStatus !== BidInsideWorkState.Not_Tender_Check)
    // if (canBitch) {
    const { code } = await run({ idList: rowSelectionCtl.selectedRowKeys })
    if (code === 1000) {
      ref.current.reloadCurrent()
      rowSelectionCtl.setSelectRow([])
      rowSelectionCtl.setSelectedRowKeys([])
    }
    // } else {
    //   message.error('只能批量提交内部状态为待审核招标的招标')
    // }
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          rowSelection={rowSelection}
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
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="custom" code="batch">
                  <Button onClick={handleSubmitBatch} loading={loading}>
                    {intl.formatMessage({ id: 'table.purchase.piliangshenhetong' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              span: 8,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

FirstCheckedBid.defaultProps = {}

export default FirstCheckedBid
