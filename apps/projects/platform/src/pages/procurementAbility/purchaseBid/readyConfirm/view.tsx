import React, { useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { Space, Button, Typography, Badge } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { ENTERPRISE_CENTER_URL } from '@/constants'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { getPurchaseBiddingStayConfirmBiddingList, postPurchaseBiddingStayConfirmBidding } from '@apps/apis'
import { formatTimeString } from '@/utils'

import ConfirmBidResultModal from '../components/confirmBidResultModal'
import Table from '../../components/table'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const intl = getIntl()

const ReadyConfirm = () => {
  const ref = useRef<any>({})
  // 确认竞价结果
  const [confirmBidResultVisible, setConfirmBidResultVisible] = useState<boolean>(false)
  const [confirmRecord, setConfirmRecord] = useState<any>()
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
              url={`/procurementAbility/purchaseBid/readyConfirm/detail?id=${record.id}&number=${text}&memberName=${record.memberName}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase..biddingMemberName' }),
      key: 'memberName',
      dataIndex: 'memberName',
      render: (text: any, record: any) => (
        <EyeAuthButton type="button" class>
          {text}
        </EyeAuthButton>
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
        record?.buttons?.indexOf(PurchaseBidButtons.CONFIRM__AUCTION_RESULTS) >= 0 && (
          <AuthButton type="custom" code="confirm">
            <Button
              onClick={() => {
                handleConfirm(record)
              }}
              type="link"
            >
              {intl.formatMessage({ id: 'table.purchase.confirm' })}
            </Button>
          </AuthButton>
        ),
    },
  ]

  const handleConfirm = (record: any) => {
    history.push(
      `/procurementAbility/purchaseBid/readyConfirm/detail?id=${record.id}&number=${record.biddingNo}&memberName=${record.memberName}&action=1`,
    )
    // setConfirmRecord(record);
    // setConfirmBidResultVisible(true);
  }

  const handleOnOk = () => {
    setConfirmBidResultVisible(false)
    ref.current.reloadCurrent()
  }

  return (
    <>
      <Table
        reload={ref}
        schemaType="PURCHASEBIDOSIGNUP_SCHEMA"
        columns={columns}
        effects="biddingNo"
        fetch={getPurchaseBiddingStayConfirmBiddingList}
      />
      <ConfirmBidResultModal
        record={confirmRecord}
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle11' })}
        visible={confirmBidResultVisible}
        fetch={postPurchaseBiddingStayConfirmBidding}
        onCancel={() => setConfirmBidResultVisible(false)}
        onOk={handleOnOk}
      />
    </>
  )
}
export default ReadyConfirm
