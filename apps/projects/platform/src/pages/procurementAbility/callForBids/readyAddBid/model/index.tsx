import { useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { baseBidListColumns } from '@/pages/procurement/constants'
import { postPurchaseInviteTenderApplyCheckInviteTender, postPurchaseInviteTenderDeleteInviteTender } from '@apps/apis'
const intl = getIntl()
import { AuthButton } from '@apps/components'
// 待新增招标逻辑
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // // 从待新增直接传到一级审核, 状态写死
    // if(record.inviteTenderInStatus !== BidInsideWorkState.Not_Submitted_Check_Invite_Tender) {
    //   return message.error('只能提交内部状态为待提交审核招标的招标')
    // }
    await postPurchaseInviteTenderApplyCheckInviteTender({ idList: [record.id] })
    ref.current.reloadCurrent()
  }

  const handleDelete = async (record) => {
    // if(record.inviteTenderInStatus !== BidInsideWorkState.Not_Submitted_Check_Invite_Tender) {
    //   return message.error('只能删除内部状态为待提交审核且从未提交过审核的招标')
    // }
    await postPurchaseInviteTenderDeleteInviteTender({ idList: [record.id] })
    ref.current.reloadCurrent()
  }

  const handleEdit = (record: any) => {
    history.push(`/procurementAbility/callForBids/readyAddBid/edit?id=${record.id}`)
  }

  const secondColumns: any[] = baseBidListColumns.concat([
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
            <AuthButton type="edit" code="eidt">
              <Button type="link" onClick={() => handleEdit(record)}>
                {intl.formatMessage({ id: 'table.purchase.eidt' })}
              </Button>
            </AuthButton>

            {record.isAddTenderDelete && (
              <AuthButton type="custom" code="del">
                <Popconfirm
                  title={intl.formatMessage({ id: 'table.purchase.shifouyaoshanchu' })}
                  onConfirm={() => handleDelete(record)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'table.purchase.delete' })}</Button>
                </Popconfirm>
              </AuthButton>
            )}
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
