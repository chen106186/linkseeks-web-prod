import React, { useRef } from 'react'
import { Button, message } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { baseBidListColumns } from '@/pages/procurement/constants'
import { BidInsideWorkState } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
const intl = getIntl()
// 待审核招标一级 hook
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // if (record.inviteTenderInStatus === BidInsideWorkState.Not_Tender_Check) {
    history.push(`/procurementAbility/callForBids/firstCheckedBid/detail?id=${record.id}&action=1`)
    // } else {
    //   message.error('只能审核内部状态为待审核招标的招标')
    // }
  }
  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="submit">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.shenhe' })}
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
