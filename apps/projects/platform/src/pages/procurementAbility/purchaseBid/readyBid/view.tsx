import React, { useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { Space, Button, Typography, Badge } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { getPurchaseBiddingStayBiddingList } from '@apps/apis'
import { formatTimeString } from '@/utils'

import Table from '../../components/table'

const intl = getIntl()

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import { AuthButton } from '@apps/components'

const { Text } = Typography

const ReadyBid = () => {
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
              url={`/procurementAbility/purchaseBid/readyBid/detail?id=${record.id}&number=${text}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
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
      title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text),
      width: 180,
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
    {
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      align: 'center',
      render: (text: any, record: any) =>
        record?.buttons?.indexOf(PurchaseBidButtons.BID_MANAGEMENT) >= 0 && (
          <AuthButton type="custom" code="manage">
            <Button
              onClick={() =>
                history.push(
                  `/procurementAbility/purchaseBid/readyBid/manage?id=${record.id}&number=${record.biddingNo}`,
                )
              }
              type="link"
            >
              {intl.formatMessage({ id: 'table.purchase.bidManage' })}
            </Button>
          </AuthButton>
        ),
    },
  ]

  return (
    <Table
      reload={ref}
      schemaType="PURCHASEBIDOSIGNUP_SCHEMA"
      columns={columns}
      effects="biddingNo"
      fetch={getPurchaseBiddingStayBiddingList}
    />
  )
}
export default ReadyBid
