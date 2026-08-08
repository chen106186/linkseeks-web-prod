import React from 'react'
import { Card, Button, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from './schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { SaleOrderInsideWorkState } from '@/constants/order'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import '../index.less'
import { useIntl } from '@linkseeks/i18n'

// 待归档订单

export interface FirstApprovedOrderProps {}

const fetchTableData = async (params) => {
  // const { data } = await getOrderListOfOrdersToBeFiled(params)
  return []
}

// TODO
const FirstApprovedOrder: React.FC<FirstApprovedOrderProps> = (props) => {
  const { columns, ref, rowSelection, rowSelectionCtl } = useSelfTable()
  // const { run, loading } = useHttpRequest(postOrderOfOrdersToBeFiledAll)
  const intl = useIntl()
  const handleSubmitBatch = async () => {
    // if (rowSelectionCtl.selectRow.length === 0) {
    //   message.error('请先勾选订单')
    //   return ;
    // }
    // const canBitch = !rowSelectionCtl.selectRow.some(v => v.purchaseOrderInteriorState !== SaleOrderInsideWorkState.FILLING_ORDER)
    // if (canBitch) {
    //   const { code } = await run({ids: rowSelectionCtl.selectedRowKeys})
    //   if (code === 1000) {
    //     rowSelectionCtl.setSelectRow([])
    //     rowSelectionCtl.setSelectedRowKeys([])
    //     ref.current.reloadCurrent()
    //   }
    // } else {
    //   message.error('只能批量提交内部状态为待确认归档的订单')
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
          tableProps={{ rowKey: 'id', scroll: { x: 1200 } }}
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
                <Button onClick={handleSubmitBatch}>
                  {intl.formatMessage({ id: 'saleOrder.piliangtijiaoshen', defaultMessage: '批量提交审核' })}
                </Button>
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

FirstApprovedOrder.defaultProps = {}

export default FirstApprovedOrder
