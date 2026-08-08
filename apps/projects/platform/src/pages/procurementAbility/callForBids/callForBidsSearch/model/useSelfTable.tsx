import React, { useRef } from 'react'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()
// 招标查询
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
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaobianhao/' }),
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
          <div
            style={{ width: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            title={record['projectName']}
          >
            {record['projectName']}
          </div>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caigouleixing' }),
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
      render: (text, record) => formatTimeString(record.createTime),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.baomingkaishi/' }),
      align: 'left',
      dataIndex: 'registerStartTime',
      key: 'registerStartTime',
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.registerStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.registerEndTime)}
          </div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zigeyushenkai' }),
      align: 'left',
      dataIndex: 'checkStartTime',
      key: 'checkStartTime',
      render: (text, record) => (
        <>
          {record.preCheckStartTime ? (
            <div>
              <PlayCircleOutlined />
              &nbsp;{formatTimeString(record.preCheckStartTime)}
            </div>
          ) : null}
          {record.preCheckEndTime ? (
            <div>
              <PoweroffOutlined />
              &nbsp;{formatTimeString(record.preCheckEndTime)}
            </div>
          ) : null}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.toubiaokaishi/' }),
      align: 'left',
      dataIndex: 'inviteTenderStartTime',
      key: 'inviteTenderStartTime',
      render: (text, record) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.inviteTenderStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.inviteTenderEndTime)}
          </div>
        </>
      ),
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

  return {
    ref,
    columns: callForBidColumns,
  }
}
