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

// 待审核报名 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const handleSubmit = async (id) => {
    history.push(`/procurementAbility/callForBids/readyCheckedRegister/detail?id=${id}&action=1`)
  }

  const baseBidListColumns = [
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
      dataIndex: 'inviteTender',
      key: 'inviteTender',
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
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (t, r) => PURCHASE_TYPE[r.inviteTender.purchaseType],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (t, r) => CALLFORBID_TYPE[r.inviteTender.inviteTenderType],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.inviteMemberName' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => record.memberName,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.inviteTenderCreateTime' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) =>
        record?.submitTenderRegister?.createTime ? formatTimeString(record.submitTenderRegister.createTime) : null,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.baomingkaishi/' }),
      align: 'left',
      dataIndex: 'memberRoleId',
      key: 'memberRoleId',
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.inviteTender.registerStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.inviteTender.registerEndTime)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderOutStatusValue',
      key: 'submitTenderOutStatusValue',
      render: (text, r) => <CustomTag text={r.submitTenderOutStatusValue} color={r.submitTenderOutStatusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
      align: 'left',
      dataIndex: 'submitTenderInStatusValue',
      key: 'submitTenderInStatusValue',
      render: (text, r) => (
        <CustomBadge
          text={intl.formatMessage({ id: 'table.purchase.daishenhebaoming' })}
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
        <AuthButton type="custom" code="submit">
          <Button type="link" onClick={() => handleSubmit(record.id)}>
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
