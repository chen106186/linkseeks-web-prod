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
import SubmitResultModal from '../components/submitResultModal'

const intl = getIntl()

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import {
  getPurchaseBiddingStaySubmitBiddingList,
  postPurchaseBiddingSubmitExamineBiddingReturn,
  postPurchaseBiddingUpdateBiddingReturn,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const ReadySubmitExamineResult = () => {
  /** 多选操作 */
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [id, setId] = useState<number>()
  const [buttonType, setButtonType] = useState<number>()
  const [visible, setVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const columns: ColumnType<any>[] = [
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
              url={`/procurementAbility/purchaseBid/readySubmitExamineResult/detail?id=${record.id}&number=${text}&button=${record.button}`}
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
      render: (text: any, record: any) => {
        const _has =
          record?.buttons?.indexOf(PurchaseBidButtons.SUBMIT_FOR_REVIEW_BIDDING_RESULTS) >= 0 ||
          record?.buttons?.indexOf(PurchaseBidButtons.EDIT_AUCTION_RESULTS) >= 0
        return (
          _has && (
            <AuthButton type="custom" code="audit">
              <Button disabled={!_has} onClick={() => handleSubmit(record)} type="link">
                {record?.buttons?.indexOf(PurchaseBidButtons.EDIT_AUCTION_RESULTS) >= 0
                  ? intl.formatMessage({ id: 'table.purchase.eidt' })
                  : intl.formatMessage({ id: 'detail.purchase.submit' })}
              </Button>
            </AuthButton>
          )
        )
      },
    },
  ]

  const handleSubmit = (record: any) => {
    history.push(
      `/procurementAbility/purchaseBid/readySubmitExamineResult/detail?id=${record.id}&number=${
        record.biddingNo
      }&button=${record.buttons?.[0] === PurchaseBidButtons.SUBMIT_FOR_REVIEW_BIDDING_RESULTS ? 0 : 1}&action=1`,
    )
    // setId(id);
    // setButtonType(type);
    // setVisible(true);
  }

  const _handleBiddingReturn = (signUpIdea: string, urls: any) => {
    if (confirmLoading) {
      return
    }
    const _params = {
      biddingId: id,
      signUpIdea,
      urls,
    }
    const _fetch =
      buttonType === 1 ? postPurchaseBiddingUpdateBiddingReturn : postPurchaseBiddingSubmitExamineBiddingReturn
    setConfirmLoading(true)
    _fetch(_params)
      .then((res) => {
        if (res.code === 1000) {
          setVisible(false)
          ref.current.reloadCurrent()
        }
      })
      .finally(() => setConfirmLoading(false))
  }

  return (
    <>
      <Table
        // selectedRow
        reload={ref}
        fetchRowkeys={(e) => setRowKeys(e)}
        schemaType="PURCHASEBIDOSIGNUP_SCHEMA"
        columns={columns}
        effects="biddingNo"
        fetch={getPurchaseBiddingStaySubmitBiddingList}
      />
      <SubmitResultModal
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle12' })}
        visible={visible}
        onOk={_handleBiddingReturn}
        onCancel={() => {
          setVisible(false)
        }}
        confirmLoading={confirmLoading}
      />
    </>
  )
}
export default ReadySubmitExamineResult
