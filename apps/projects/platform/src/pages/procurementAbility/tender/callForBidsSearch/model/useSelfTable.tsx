import React, { useRef } from 'react'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
import { customAuthUrl as AuthUrl } from '@apps/domains'
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
      title: intl.formatMessage({ id: 'table.purchase.code' }),
      align: 'left',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <>
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/tender/callForBidsSearch/detail?id=${record.id}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <div
            style={{ width: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            title={record['projectName']}
          >
            {record['projectName']}
          </div>
        </>
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.purchaseType' }),
    //   align: 'left',
    //   dataIndex: 'purchaseType',
    //   key: 'purchaseType',
    //   render: (t) => PURCHASE_TYPE[t]
    // },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
    //   align: 'left',
    //   dataIndex: 'inviteTenderType',
    //   key: 'inviteTenderType',
    //   render: (t) => CALLFORBID_TYPE[t]
    // },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
      align: 'left',
      dataIndex: 'openTenderTime',
      key: 'openTenderTime',
      render: (text, record) => formatTimeString(record.openTenderTime),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.fabushijian' }),
      align: 'left',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => formatTimeString(record.createTime),
      width: 180,
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
      width: 180,
    },
    // {
    //   title: intl.formatMessage({ id: 'table.purchase.preCheckStartTime' }),
    //   align: 'left',
    //   dataIndex: 'checkStartTime',
    //   key: 'checkStartTime',
    //   render: (text, record) => <>
    //     {record.preCheckStartTime ? <div><PlayCircleOutlined />&nbsp;{formatTimeString(record.preCheckStartTime)}</div> : null}
    //     {record.preCheckEndTime ? <div><PoweroffOutlined />&nbsp;{formatTimeString(record.preCheckEndTime)}</div> : null}
    //   </>,
    //   width: 180
    // },
    {
      title: intl.formatMessage({ id: 'table.purchase.inviteTenderStartTime' }),
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
      width: 180,
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
  ]

  return {
    ref,
    columns: callForBidColumns,
  }
}
