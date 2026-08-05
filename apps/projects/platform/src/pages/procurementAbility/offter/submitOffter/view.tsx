import React, { useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Badge, Tag, Space, Typography, Popconfirm, Rate } from 'antd'
import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
  CHNUM_TYPE,
} from '../../constants'
import {
  getPurchaseQuotedPriceStayCommitList,
  postPurchaseQuotedPriceStayCommit,
  postPurchaseQuotedPriceStayCommitBatch,
} from '@apps/apis'
import { AuthButton } from '@apps/components'

const { Text } = Typography
const intl = getIntl()
const SubmitOffter = () => {
  console.log('待新增采购需求单')
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoDtails' }),
      key: 'quotedPriceNo',
      dataIndex: 'quotedPriceNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/procurementAbility/offter/submitOffter/view?id=${record.id}&number=${record.quotedPriceNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoMember' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/procurementAbility/offter/submitOffter/detail?id=${record.purchaseInquiryId}&number=${record.purchaseInquiryNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.memberName}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
      key: 'offerEndTime',
      dataIndex: 'offerEndTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.turn' }),
      key: 'turn',
      dataIndex: 'turn',
      render: (text: any, record: any) => (
        <>
          <Rate
            count={3}
            character="▌"
            disabled
            className="rate_style"
            style={{
              fontSize: '12px',
              color: '#00A98F',
            }}
            value={text}
            allowHalf
          />
          <Text>{intl.formatMessage({ id: 'common.trun', data: text })}</Text>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={OFFTER_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={OFFTER_INTERNALSTATE_COLOR[text]} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          <AuthButton type="custom" code="offerSubmit">
            <Popconfirm
              title={intl.formatMessage({ id: 'table.purchase.popconfirm3' })}
              okText={intl.formatMessage({ id: 'table.purchase.okText' })}
              cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
              onConfirm={() => fetchSubmitBatch(record.id)}
            >
              <Button type="link">{intl.formatMessage({ id: 'table.purchase.offerSubmit' })}</Button>
            </Popconfirm>
          </AuthButton>
        </>
      ),
    },
  ]

  /** 多选操作 */
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [loading, setLoading] = useState<boolean>(false)

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    setLoading(true)
    let res = null
    if (id) {
      res = await postPurchaseQuotedPriceStayCommit({ id })
    } else {
      res = await postPurchaseQuotedPriceStayCommitBatch({ ids: rowkeys })
    }
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  return (
    <Table
      selectedRow
      reload={ref}
      fetchRowkeys={(e) => setRowKeys(e)}
      schemaType="OFFERSERAHAUDIT_SCHEMA"
      columns={columns}
      effects="quotedPriceNo"
      fetch={getPurchaseQuotedPriceStayCommitList}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batchsubmit">
              <Button loading={loading} onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default SubmitOffter
