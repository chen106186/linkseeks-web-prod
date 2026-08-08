import { useRef } from 'react'
import { Button } from 'antd'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { baseTenderListColumns } from '@/pages/procurement/constants'
import { postPurchaseSubmitTenderSubmitCheckSubmitTender } from '@apps/apis'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 待新增投标逻辑
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // if(record.submitTenderInStatus !== TenderInsideWorkState.Not_Submitted_Check_Submit_Tender) {
    //   return message.error('只能提交待提交审核投标的投标')
    // }
    const res = await postPurchaseSubmitTenderSubmitCheckSubmitTender({ idList: [record.id] })
    if (res.code === 1000) {
      ref.current.reloadCurrent()
    }
  }

  const handleEdit = (record: any) => {
    history.push(`/procurementAbility/tender/readyAddTender/edit?id=${record.id}`)
  }

  const secondColumns: any[] = baseTenderListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      width: 200,
      render: (text, record) => {
        return (
          <>
            {record.isSubmitCheck && (
              <AuthButton type="custom" code="submit">
                <Button type="link" onClick={() => handleSubmit(record)}>
                  {intl.formatMessage({ id: 'table.purchase.submit' })}
                </Button>
              </AuthButton>
            )}
            <AuthButton type="edit" code="edit">
              <Button type="link" onClick={() => handleEdit(record)}>
                {intl.formatMessage({ id: 'table.purchase.eidt' })}
              </Button>
            </AuthButton>
          </>
        )
      },
    },
  ])

  return {
    columns: secondColumns,
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
