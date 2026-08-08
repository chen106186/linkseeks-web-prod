import React, { useRef, useState } from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Tag, Badge, Typography, Space } from 'antd'
import { INQUIRY_EXTERNALSTATE_COLOR, INQUIRY_INTERNALSTATE_COLOR } from '../../constants'
import { getPurchasePurchaseInquiryStayExamineList1, postPurchasePurchaseInquiryExamine1Batch } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { Text } = Typography

const intl = getIntl()

const AuditInquiryOne = () => {
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  /** 批量审核 */
  const fetchSubmitBatch = async () => {
    const res = await postPurchasePurchaseInquiryExamine1Batch({ ids: rowkeys })
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNo' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/purchaseInquiry/auditInquiryOne/detail?id=${record.id}&number=${record.purchaseInquiryNo}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
      key: 'offerEndTime',
      dataIndex: 'offerEndTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={INQUIRY_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={INQUIRY_INTERNALSTATE_COLOR[text]} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          <AuthButton type="custom" code="audit">
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/procurementAbility/purchaseInquiry/auditInquiryOne/detail?id=${record.id}&number=${record.purchaseInquiryNo}`,
                )
              }
            >
              {intl.formatMessage({ id: 'table.purchase.audit' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  console.log(rowkeys, 'rowkeys')

  return (
    <Table
      selectedRow
      reload={ref}
      schemaType="INQUIRYWAITORDER_SCHEMA"
      columns={columns}
      effects="purchaseInquiryNo"
      fetch={getPurchasePurchaseInquiryStayExamineList1}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batchaudit">
              <Button disabled={rowkeys.length === 0} onClick={fetchSubmitBatch}>
                {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default AuditInquiryOne
