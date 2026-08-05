import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { baseBidListColumns } from '@/pages/procurement/constants'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待审核报名 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})
  // const [rowSelection, rowSelectionCtl] = useRowSelectionTable({customKey: 'id', extendsSelection: {
  //   getCheckboxProps: record => ({
  //     // 不等于可提交审核的 都无法通过批量提交
  //     disabled: record.interiorState !== PurchaseOrderInsideWorkState.ONE_LEVEL_AUDIT_ORDER,
  //     interiorState: record.interiorState,
  //   })
  // }})

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readyConfirmBid/detail?id=${record.id}`)
  }
  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="tijiaoshenhe">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.tijiaoshenhe' })}
          </Button>
        </AuthButton>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
    // rowSelection,
    // rowSelectionCtl
  }
}
