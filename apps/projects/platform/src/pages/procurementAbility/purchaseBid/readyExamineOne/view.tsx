import React, { useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { Row, Col, Space, Button, Typography, Badge } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import {
  postPurchaseBiddingExamine1,
  postPurchaseBiddingExamine1Batch,
  getPurchaseBiddingStayExamineList1,
} from '@apps/apis'
import { formatTimeString } from '@/utils'

import ModalOperate from '../../components/modalOperate'
import Table from '../../components/table'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const intl = getIntl()

const ReadyExamineOne = () => {
  /** 多选操作 */
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [id, setId] = useState<any>()
  const [visible, setVisible] = useState<boolean>(false)
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
              url={`/procurementAbility/purchaseBid/readyExamineOne/detail?id=${record.id}&number=${text}`}
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

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postPurchaseBiddingExamine1({ id, state: 1 })
    } else {
      res = await postPurchaseBiddingExamine1Batch({ ids: rowkeys })
    }
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }

  const handleExamine = (record: any) => {
    history.push(
      `/procurementAbility/purchaseBid/readyExamineOne/detail?id=${record.id}&number=${record.biddingNo}&action=1`,
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
        selectedRow
        reload={ref}
        fetchRowkeys={(e) => setRowKeys(e)}
        schemaType="PURCHASEBIDREADYADD_SCHEMA"
        columns={columns}
        effects="biddingNo"
        fetch={getPurchaseBiddingStayExamineList1}
        controllerBtns={
          <Row>
            <Col span={24}>
              <Space size={16}>
                <AuthButton type="custom" code="batchsubmit">
                  <Button onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                    {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
                  </Button>
                </AuthButton>
              </Space>
            </Col>
          </Row>
        }
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'table.purchase.modelTitle' })}
        modalType="audit"
        visible={visible}
        fetch={postPurchaseBiddingExamine1}
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}
export default ReadyExamineOne
