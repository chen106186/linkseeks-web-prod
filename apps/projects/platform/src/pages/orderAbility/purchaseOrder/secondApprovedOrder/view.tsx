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
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getOrderBuyerValidateGradeTwoPage, postOrderBuyerValidateGradeTwoBatch } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
// 二级待审核订单

export interface SecondApprovedOrderProps {}

const fetchTableData = async (params) => {
  const { data } = await getOrderBuyerValidateGradeTwoPage(params)
  return data
}

const SecondApprovedOrder: React.FC<SecondApprovedOrderProps> = (props) => {
  const { columns, ref } = useSelfTable()
  const intl = useIntl()
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const { run, loading } = useHttpRequest(postOrderBuyerValidateGradeTwoBatch)

  const handleSubmitBatch = async () => {
    if (rowSelectionCtl.selectRow.length === 0) {
      return message.error(
        intl.formatMessage({ id: 'purchaseOrder.qingxiangouxuanding', defaultMessage: '请先勾选订单' }),
      )
    }

    const { code } = await run(rowSelectionCtl.selectedRowKeys.map((item) => ({ orderId: item })))

    if (code === 1000) {
      // 清空选中的值
      ref.current.reloadCurrent()
      rowSelectionCtl.setSelectRow([])
      rowSelectionCtl.setSelectedRowKeys([])
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
          rowKey={'orderId'}
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
            layouts: {
              order: 2,
              span: 16,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="custom" code="submitBatch">
                  <Button onClick={handleSubmitBatch} loading={loading}>
                    {intl.formatMessage({ id: 'purchaseOrder.piliangtijiaoshen', defaultMessage: '批量提交审核' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              span: 8,
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

SecondApprovedOrder.defaultProps = {}

export default SecondApprovedOrder
