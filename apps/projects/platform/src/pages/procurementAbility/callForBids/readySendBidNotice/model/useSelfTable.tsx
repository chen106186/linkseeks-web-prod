import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 待发送中标公示 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readySendBidNotice/detail?id=${record.id}&action=1`)
  }

  const baseBidListColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.code' }),
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => {
        const { pathname } = useLocation()
        return (
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('fasongzhongbiaogong') ? 'link' : 'button'}
              url={`${pathname}/detail?id=${record.id}`}
            >
              {text}
            </EyeAuthButton>
            <div>{record['projectName']}</div>
          </DetailAuthButton>
        )
      },
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

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <AuthButton type="custom" code="fasongzhongbiaogong">
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'table.purchase.fasongzhongbiaogong' })}
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
