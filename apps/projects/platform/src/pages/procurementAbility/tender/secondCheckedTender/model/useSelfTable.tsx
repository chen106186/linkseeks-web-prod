import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { baseTenderListColumns } from '@/pages/procurement/constants'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待审核投标二级
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // if (record.interiorState === PurchaseOrderInsideWorkState.ONE_LEVEL_AUDIT_ORDER) {
    history.push(`/procurementAbility/tender/secondCheckedTender/detail?id=${record.id}`)
    // }
    // await postOrderQuotationBeReviewed({id})
    // ref.current.reloadCurrent()
  }
  const secondColumns: any[] = baseTenderListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="audit">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.audit' })}
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
