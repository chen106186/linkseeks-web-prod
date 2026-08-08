import React from 'react'
import { Card, Space, Button, message } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../../utils/index.less'
import {
  postPurchaseSubmitTenderGetAddSubmitTenderList,
  postPurchaseSubmitTenderSubmitCheckSubmitTender,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待新增投标

export interface ReadyAddTenderProps {}

const fetchTableData = async (params) => {
  const { data } = await postPurchaseSubmitTenderGetAddSubmitTenderList(
    {
      ...params,
    },
    { ctlType: 'none' },
  )
  return data
}

const ReadyAddTender: React.FC<ReadyAddTenderProps> = () => {
  const { loading, run } = useHttpRequest(postPurchaseSubmitTenderSubmitCheckSubmitTender)

  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()

  const handleBitchPush = async () => {
    const canBitch = !rowSelectionCtl.selectRow.some((v) => v.isSubmitCheck === false)
    if (!rowSelectionCtl.selectRow.length)
      return message.error(intl.formatMessage({ id: 'table.purchase.qingxianxuanzetou' }))
    if (canBitch) {
      const { code } = await run({ idList: rowSelectionCtl.selectedRowKeys })
      if (code === 1000) {
        ref.current.reloadCurrent()
        rowSelectionCtl.setSelectRow([])
        rowSelectionCtl.setSelectedRowKeys([])
      }
    } else {
      message.error(intl.formatMessage({ id: 'table.purchase.zhinengtijiaodaishenhe' }))
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          rowSelection={rowSelection}
          columns={columns}
          currentRef={ref}
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
                  <Button onClick={handleBitchPush} loading={loading}>
                    {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
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

ReadyAddTender.defaultProps = {}

export default ReadyAddTender
