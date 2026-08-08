import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { baseTenderListColumns } from '@/pages/procurement/constants'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待提交投标
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/tender/readySubmitTender/detail?id=${record.id}`)
  }

  const secondColumns: any[] = baseTenderListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="submit">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.submit' })}
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
