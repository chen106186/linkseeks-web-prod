import React, { useRef } from 'react'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import CustomTag from '@/pages/procurement/components/customTag'
import { getIntl } from '@linkseeks/i18n'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

// 投标查询
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const callForBidColumns: any[] = [
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
      dataIndex: 'memberId',
      key: 'memberId',
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
            {record.inviteTender.code}
          </EyeAuthButton>
          <div>{record.inviteTender.projectName}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.toubiaobianhao/' }),
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <>
          {text ? (
            <DetailAuthButton>
              <EyeAuthButton
                type={AuthUrl('detail') ? 'link' : 'button'}
                url={`/procurementAbility/callForBids/tenderSearch/detail?id=${record.id}`}
              >
                {text}
              </EyeAuthButton>
            </DetailAuthButton>
          ) : null}
          <div>{record.memberName}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.tenderStartTime' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => formatTimeString(record.submitTenderTime),
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
      align: 'left',
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => formatTimeString(record.inviteTender.openTenderTime),
      width: 200,
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
      dataIndex: 'inviteTender',
      key: 'inviteTender',
      render: (text, record) => (
        <CustomTag text={record.submitTenderOutStatusValue} color={record.submitTenderOutStatusColor} />
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
    //   align: 'left',
    //   dataIndex: 'interiorState',
    //   key: 'interiorState',
    //   render: (text) => <CustomBadge status={text} type='inside' />
    // },
  ]

  return {
    ref,
    columns: callForBidColumns,
  }
}
