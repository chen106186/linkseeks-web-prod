import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import CustomTag from '@/pages/procurement/components/customTag'
import { ExpertRectractStatus } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
const intl = getIntl()

const baseBidListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
    align: 'left',
    dataIndex: 'id',
    key: 'id',
    render: (t, r, i) => ++i,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.code' }),
    align: 'left',
    dataIndex: ['inviteTender', 'code'],
    key: ['inviteTender', 'code'],
    render: (text, record) => (
      <>
        <EyeAuthButton url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
          {text}
        </EyeAuthButton>
        <div>{record.inviteTender.projectName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.expertNumber' }),
    align: 'left',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.evaluationStartTime' }),
    align: 'left',
    dataIndex: ['inviteTender', 'evaluationStartTime'],
    key: ['inviteTender', 'evaluationEndTime'],
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          {formatTimeString(record.inviteTender.evaluationStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          {formatTimeString(record.inviteTender.evaluationEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
    align: 'left',
    dataIndex: ['inviteTender', 'inviteTenderOutStatusValue'],
    key: ['inviteTender', 'inviteTenderOutStatusValue'],
    render: (text, r) => <CustomTag text={text} color={r.inviteTender.inviteTenderOutStatusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'status',
    key: 'status',
    render: (t) => ExpertRectractStatus[t],
  },
]

// 待专家评标 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readyExpertRemark/detail?id=${record.id}`)
  }
  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) =>
        new Date().getTime() < record.inviteTender.evaluationEndTime && (
          <AuthButton type="custom" code="pinbiao">
            <Button type="link" onClick={() => handleSubmit(record)}>
              {intl.formatMessage({ id: 'table.purchase.pingbiao' })}
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
