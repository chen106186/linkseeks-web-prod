import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
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
      <DetailAuthButton>
        <EyeAuthButton
          type={AuthUrl('detail') ? 'link' : 'button'}
          url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
        <div>{record['projectName']}</div>
      </DetailAuthButton>
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
    title: intl.formatMessage({ id: 'table.purchase.fabushijian' }),
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (t, r) => formatTimeString(t),
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

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readyCheckedConfirmFirst/detail?id=${record.id}`)
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
  }
}
