import React, { useRef, useState } from 'react'
import { Button, Badge, Typography, Space } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import Table from '../../components/table'
import ModalOperate from '../../components/modalOperate'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import {
  getPurchaseBiddingExternalStatus,
  getPurchaseBiddingInteriorStatus,
  getPurchaseBiddingList,
  postPurchaseBiddingDiscard,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const intl = getIntl()

const Search = () => {
  const ref = useRef<any>({})
  const [id, setId] = useState<number>()
  const [visible, setVisible] = useState<boolean>(false)
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
              url={`/procurementAbility/purchaseBid/search/detail?id=${record.id}&number=${record.biddingNo}`}
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
      render: (text: any, record: any) => {
        return (
          record?.buttons?.indexOf(PurchaseBidButtons.CANCEL) >= 0 && (
            <AuthButton type="custom" code="undo">
              <Button
                type="link"
                onClick={() => {
                  setId(record.id)
                  setVisible(true)
                }}
              >
                {intl.formatMessage({ id: 'table.purchase.undo' })}
              </Button>
            </AuthButton>
          )
        )
      },
    },
  ]

  const handleSubmit = () => {
    setVisible(false)
    ref.current.reloadCurrent()
  }

  return (
    <>
      <Table
        schemaType="PURCHASEBIDORDER_SCHEMA"
        columns={columns}
        effects="biddingNo"
        fetch={getPurchaseBiddingList}
        reload={ref}
        externalStatusFetch={getPurchaseBiddingExternalStatus}
        interiorStatusFetch={getPurchaseBiddingInteriorStatus}
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'table.purchase.undoCause' })}
        visible={visible}
        modalType="discard"
        maxNumber={50}
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
        fetch={postPurchaseBiddingDiscard}
      />
    </>
  )
}
export default Search
