import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { baseBidListColumns } from '@/pages/procurement/constants'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待审核招标二级 hook
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // if (record.interiorState === PurchaseOrderInsideWorkState.ONE_LEVEL_AUDIT_ORDER) {
    history.push(`/procurementAbility/callForBids/secondCheckedBid/detail?id=${record.id}&action=1`)
    // }
    // await postOrderQuotationBeReviewed({id})
    // ref.current.reloadCurrent()
  }
  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'center',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="submit">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.shenhe', defaultMessage: '审核' })}
          </Button>
        </AuthButton>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
