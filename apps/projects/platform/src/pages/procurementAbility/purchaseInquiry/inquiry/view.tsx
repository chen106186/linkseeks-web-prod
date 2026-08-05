import React, { useRef, useState } from 'react'
import Table from '../../components/table'
import { Button, Tag, Badge, Typography, Space } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { INQUIRY_EXTERNALSTATE_COLOR, INQUIRY_INTERNALSTATE_COLOR } from '../../constants'
import ModalOperate from '../../components/modalOperate'
import {
  getPurchasePurchaseInquiryExternalStatusPurchase,
  getPurchasePurchaseInquiryInteriorStatusPurchase,
  getPurchasePurchaseInquiryList,
  postPurchasePurchaseInquiryCancel,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { Text } = Typography

const intl = getIntl()

const Inquiry = () => {
  const ref = useRef<any>({})
  const [id, setId] = useState<number>()
  const [visible, setVisible] = useState<boolean>(false)
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
              url={`/procurementAbility/purchaseInquiry/inquiry/detail?id=${record.id}&number=${record.purchaseInquiryNo}&preview=true`}
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
        <AuthButton type="custom" code="undo">
          <Button
            type="link"
            disabled={record.interiorState === -1 || record.externalState === -1 || record.externalState === 99}
            // onClick={() => history.push(`/procurementAbility/purchaseInquiry/inquiry/detail?id=${record.id}&number=${record.purchaseInquiryNo}`)}
            onClick={() => {
              setId(record.id)
              setVisible(true)
            }}
          >
            {intl.formatMessage({ id: 'table.purchase.undo' })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  const handleSubmit = () => {
    setVisible(false)
    ref.current.reloadCurrent()
  }

  return (
    <>
      <Table
        schemaType="INQUIRYDEMANDORDER_SCHEMA"
        columns={columns}
        effects="purchaseInquiryNo"
        fetch={getPurchasePurchaseInquiryList}
        externalStatusFetch={getPurchasePurchaseInquiryExternalStatusPurchase}
        interiorStatusFetch={getPurchasePurchaseInquiryInteriorStatusPurchase}
        reload={ref}
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'table.purchase.undoCause' })}
        visible={visible}
        modalType="abandon"
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
        fetch={postPurchasePurchaseInquiryCancel}
      />
    </>
  )
}
export default Inquiry
