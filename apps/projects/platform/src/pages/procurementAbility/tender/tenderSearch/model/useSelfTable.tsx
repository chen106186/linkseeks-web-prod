import React, { useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { TenderInsideWorkState, TenderOutWorkState } from '@/constants/procurement'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 投标查询
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const handleEdit = (param) => {
    history.push(`/procurementAbility/tender/readyAddTender/edit?id=${param.id}`)
  }

  const callForBidColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.tendeCode' }),
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <>
          {text ? (
            <DetailAuthButton>
              <EyeAuthButton
                type={AuthUrl('detail') ? 'link' : 'button'}
                url={`/procurementAbility/tender/tenderSearch/detail?id=${record.id}`}
              >
                {text}
              </EyeAuthButton>
            </DetailAuthButton>
          ) : null}
          <div>{record.inviteTender.projectName}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.inviteTender' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => (
        <>
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('callForBidsSearch') ? 'link' : 'button'}
              url={`/procurementAbility/tender/callForBidsSearch/detail?id=${record.inviteTender.id}`}
            >
              {record.inviteTender.code}
            </EyeAuthButton>
          </DetailAuthButton>
          <div>{record.inviteTender.memberName}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.tenderStartTime' }),
      align: 'left',
      dataIndex: 'memberId',
      key: 'memberId',
      render: (text, record) => formatTimeString(record.inviteTender.inviteTenderStartTime),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.inviteTenderEndTime' }),
      align: 'left',
      dataIndex: 'memberRoleId',
      key: 'memberRoleId',
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.inviteTender.inviteTenderStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.inviteTender.inviteTenderEndTime)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.isWin' }),
      align: 'left',
      dataIndex: 'isWin',
      key: 'isWin',
      render: (t, r) =>
        t === true
          ? intl.formatMessage({ id: 'table.purchase.shi' })
          : t === false
          ? intl.formatMessage({ id: 'table.purchase.fou' })
          : t,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderOutStatusValue',
      key: 'submitTenderOutStatusValue',
      render: (text, r) => <CustomTag text={text} color={r.submitTenderOutStatusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderInStatusValue',
      key: 'submitTenderInStatusValue',
      render: (text, r) => <CustomBadge text={text} color={r.submitTenderInStatusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) =>
        record.isSubmitTenderUpdate && (
          <AuthButton type="edit" code="edit">
            <Button type="link" onClick={() => handleEdit(record)}>
              {intl.formatMessage({ id: 'table.purchase.eidt' })}
            </Button>
          </AuthButton>
        ),
    },
  ]

  return {
    ref,
    columns: callForBidColumns,
  }
}
