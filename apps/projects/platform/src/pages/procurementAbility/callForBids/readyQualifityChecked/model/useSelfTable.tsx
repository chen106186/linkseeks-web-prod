import React, { useRef } from 'react'
import { Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 待资格预审 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const handleSubmit = async (record) => {
    history.push(`/procurementAbility/callForBids/readyQualifityChecked/detail?id=${record.id}&action=1`)
  }

  const baseBidListColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.code' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteTender.id}`}
          >
            {record.inviteTender.code}
          </EyeAuthButton>
          <div>{record.inviteTender.projectName}</div>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseType' }),
      align: 'left',
      dataIndex: 'purchaseType',
      key: 'purchaseType',
      render: (t, r) => PURCHASE_TYPE[r.inviteTender.purchaseType],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
      align: 'left',
      dataIndex: 'inviteTenderType',
      key: 'inviteTenderType',
      render: (t, r) => CALLFORBID_TYPE[r.inviteTender.inviteTenderType],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.submitQualificationsCheckTime' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => (
        <>
          <div>{record.memberName}</div>
          <div>{formatTimeString(record.submitQualificationsCheckTime)}</div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zigeyushenkai' }),
      align: 'left',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) =>
        record?.inviteTender?.preCheckStartTime ? (
          <>
            <div>
              <PlayCircleOutlined />
              &nbsp;{formatTimeString(record.inviteTender.preCheckStartTime)}
            </div>
            <div>
              <PoweroffOutlined />
              &nbsp;{formatTimeString(record.inviteTender.preCheckEndTime)}
            </div>
          </>
        ) : null,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderOutStatusValue',
      key: 'submitTenderOutStatusValue',
      render: (text, r) => <CustomTag text={text} color={r.inviteTender.inviteTenderOutStatusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderInStatusValue',
      key: 'submitTenderInStatusValue',
      render: (text, r) => (
        <CustomBadge
          text={intl.formatMessage({ id: 'table.purchase.daishenhezige' })}
          color={r.submitTenderInStatusColor}
        />
      ),
    },
  ]

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="zigeyushen">
            <Button type="link" onClick={() => handleSubmit(record)}>
              {intl.formatMessage({ id: 'table.purchase.zigeyushen' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
  }
}
