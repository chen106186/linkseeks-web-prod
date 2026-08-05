import React, { useRef } from 'react'
import { Badge, Typography, Space } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import {
  getPurchaseOnlineBiddingList,
  getPurchaseOnlineBiddingExternalStatus,
  getPurchaseOnlineBiddingInteriorStatus,
} from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import Table from '../../components/table'

const intl = getIntl()

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR } from '../../constants/purchaseBid'
import { getIntl } from '@linkseeks/i18n'

const { Text } = Typography

const Search = () => {
  const ref = useRef<any>({})
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.id' }),
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.biddingNo' }),
      key: 'biddingNo',
      dataIndex: 'biddingNo',
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <DetailAuthButton>
            <EyeAuthButton
              class
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/onlineBid/search/detail?id=${record.id}&number=${record.biddingNo}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.createMemberName' }),
      key: 'createMemberName',
      dataIndex: 'createMemberName',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.biddingStartTime' }),
      key: 'biddingStartTime',
      dataIndex: 'biddingStartTime',
      render: (text: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.biddingStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.biddingEndTime)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.startSignUp' }),
      key: 'startSignUp',
      dataIndex: 'startSignUp',
      render: (text: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.startSignUp)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.endSignUp)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.isWin' }),
      key: 'isPrize',
      dataIndex: 'isPrize',
      render: (text: any, record: any) => (
        <>
          {text !== 1 && text !== 0 ? null : (
            <StatusTag
              type={text ? 'success' : 'danger'}
              title={
                text
                  ? intl.formatMessage({ id: 'table.purchase.okText' })
                  : intl.formatMessage({ id: 'table.purchase.cancelText' })
              }
            />
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <StatusTag type={BID_EXTERNALSTATE_COLOR(text)} title={record.externalStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={BID_INTERNALSTATE_COLOR(text)} text={record.interiorStateName} />
      ),
    },
  ]

  return (
    <Table
      schemaType="ONLINEBIDORDER_SCHEMA"
      columns={columns}
      effects="biddingNo"
      fetch={getPurchaseOnlineBiddingList}
      externalStatusFetch={getPurchaseOnlineBiddingExternalStatus}
      interiorStatusFetch={getPurchaseOnlineBiddingInteriorStatus}
      reload={ref}
    />
  )
}
export default Search
