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
  postPurchaseSubmitTenderCheckSubmitTenderBatch,
  postPurchaseSubmitTenderGetCheckSubmitTenderList,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 一级待审核 投标

export interface FirstCheckedTenderProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseSubmitTenderGetCheckSubmitTenderList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const FirstCheckedTender: React.FC<FirstCheckedTenderProps> = (props) => {
  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()

  const { run, loading } = useHttpRequest(postPurchaseSubmitTenderCheckSubmitTenderBatch)

  const handleSubmitBatch = async () => {
    if (rowSelectionCtl.selectRow.length === 0) {
      message.error(intl.formatMessage({ id: 'table.purchase.qingxianxuanzetou' }))
      return
    }
    // const canBitch = !rowSelectionCtl.selectRow.some(v => v.submitTenderInStatus !== TenderInsideWorkState.Submitted_Check_Submit_Tender)
    // if (canBitch) {
    const { code } = await run({ idList: rowSelectionCtl.selectedRowKeys })
    if (code === 1000) {
      ref.current.reloadCurrent()
      rowSelectionCtl.setSelectRow([])
      rowSelectionCtl.setSelectedRowKeys([])
    }
    // } else {
    //   message.error('只能批量提交内部状态为已提交审核投标的招标')
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
                useStateFilterSearchLinkageEffect($, actions, 'submitTenderCode', FORM_FILTER_PATH)
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

FirstCheckedTender.defaultProps = {}

export default FirstCheckedTender
