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
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
const intl = getIntl()

const baseBidListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
    align: 'left',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.code' }),
    align: 'left',
    dataIndex: 'code',
    key: 'code',
    render: (text, record) => (
      <>
        <EyeAuthButton url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
        <div>{record['projectName']}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.purchaseType' }),
    align: 'left',
    dataIndex: 'purchaseType',
    key: 'purchaseType',
    render: (t) => PURCHASE_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
    align: 'left',
    dataIndex: 'inviteTenderType',
    key: 'inviteTenderType',
    render: (t) => CALLFORBID_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.evaluationEndTime' }),
    align: 'left',
    dataIndex: 'evaluationStartTime',
    key: 'evaluationStartTime',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(record.evaluationStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.evaluationEndTime)}
        </div>
      </>
    ),
    width: 180,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
    align: 'left',
    dataIndex: 'inviteTenderOutStatusValue',
    key: 'inviteTenderOutStatusValue',
    render: (text, r) => <CustomTag text={text} color={r.inviteTenderOutStatusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'inviteTenderInStatusValue',
    key: 'inviteTenderInStatusValue',
    render: (text, r) => <CustomBadge text={text} color={r.inviteTenderInStatusColor} />,
  },
]

export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readySubmitReport/detail?id=${record.id}&action=1`)
  }

  const handlePreview = async (record) => {
    history.push(`/procurementAbility/callForBids/readySubmitReport/detail?id=${record.id}`)
  }

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="tijiaopinggubao">
            <Button type="link" onClick={() => handleSubmit(record)}>
              {intl.formatMessage({ id: 'table.purchase.tijiaopinggubao' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="zhakan">
            <Button type="link" onClick={() => handlePreview(record)}>
              {intl.formatMessage({ id: 'table.purchase.zhakan' })}
            </Button>
          </AuthButton>
        </>
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
