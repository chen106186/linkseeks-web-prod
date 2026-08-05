import React, { useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { Space, Button, Typography, Badge } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import { ENTERPRISE_CENTER_URL } from '@/constants'
import Table from '../../components/table'
import ModalOperate from '../../components/modalOperate'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import { getPurchaseBiddingStayExaminBiddingList, postPurchaseBiddingExaminBiddingSignup } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const intl = getIntl()

const ReadyExamineSignUp = () => {
  const ref = useRef<any>({})
  const [id, setId] = useState<any>()
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
              url={`/procurementAbility/purchaseBid/readyExamineSignUp/detail?id=${record.biddingId}&number=${text}&signUpId=${record.id}&createMemberId=${record.createMemberId}&createMemberRoleId=${record.createMemberRoleId}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.signUpTime' }),
      key: 'signUpTime',
      dataIndex: 'signUpTime',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton type="button" class>
            {record.createMemberName}
          </EyeAuthButton>
          <Text type="secondary">{formatTimeString(record.signUpTime)}</Text>
        </Space>
      ),
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
        record?.buttons?.indexOf(PurchaseBidButtons.AUDIT) >= 0 && (
          <AuthButton type="custom" code="audit">
            <Button
              onClick={() => {
                handleExamine(record)
              }}
              type="link"
            >
              {intl.formatMessage({ id: 'table.purchase.audit' })}
            </Button>
          </AuthButton>
        ),
    },
  ]

  const handleExamine = (record: any) => {
    history.push(
      `/procurementAbility/purchaseBid/readyExamineSignUp/detail?id=${record.biddingId}&number=${record.biddingNo}&signUpId=${record.id}&action=1&createMemberId=${record.createMemberId}&createMemberRoleId=${record.createMemberRoleId}`,
    )
    // setId(id);
    // setVisible(!visible);
  }

  const handleSubmit = () => {
    setVisible(false)
    ref.current.reloadCurrent()
  }

  return (
    <>
      <Table
        reload={ref}
        schemaType="PURCHASEBIDOSIGNUP_SCHEMA"
        columns={columns}
        effects="biddingNo"
        fetch={getPurchaseBiddingStayExaminBiddingList}
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'table.purchase.modelTitle' })}
        modalType="audit"
        visible={visible}
        fetch={postPurchaseBiddingExaminBiddingSignup}
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}
export default ReadyExamineSignUp
