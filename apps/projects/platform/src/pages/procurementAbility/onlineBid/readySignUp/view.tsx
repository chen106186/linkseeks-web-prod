import React, { useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Button, Badge, Typography, Space } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { ENTERPRISE_CENTER_URL } from '@/constants'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { getPurchaseOnlineBiddingStayExamineBiddingSignup } from '@apps/apis'

const intl = getIntl()
import { PurchaseBidButtons } from '../../constants/purchaseBid'

import Table from '../../components/table'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR } from '../../constants/purchaseBid'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const ReadySignUp = () => {
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
              url={`/procurementAbility/onlineBid/readySignUp/detail?id=${record.id}&number=${record.biddingNo}`}
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
        const _has =
          record?.buttons?.indexOf(PurchaseBidButtons.SIGN_UP) >= 0 ||
          record?.buttons?.indexOf(PurchaseBidButtons.RE_SIGN_UP) >= 0
        return (
          _has && (
            <AuthButton type="custom" code="signUp">
              <Button
                onClick={() => {
                  history.push(
                    `/procurementAbility/onlineBid/readySignUp/signUp?id=${record.id}&number=${record.biddingNo}`,
                  )
                }}
                type="link"
              >
                {record?.buttons?.indexOf(PurchaseBidButtons.SIGN_UP) >= 0
                  ? intl.formatMessage({ id: 'detail.purchase.label14' })
                  : intl.formatMessage({ id: 'detail.purchase.label15' })}
              </Button>
            </AuthButton>
          )
        )
      },
    },
  ]

  return (
    <Table
      schemaType="ONLINEBIDREADYSIGN_SCHEMA"
      columns={columns}
      effects="biddingNo"
      fetch={getPurchaseOnlineBiddingStayExamineBiddingSignup}
      reload={ref}
    />
  )
}
export default ReadySignUp
