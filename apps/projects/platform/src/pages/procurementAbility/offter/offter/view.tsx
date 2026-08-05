import React from 'react'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { OFFTER_EXTERNALSTATE_COLOR, OFFTER_INTERNALSTATE_COLOR, CHNUM_TYPE } from '../../constants'
import { Badge, Tag, Space, Typography, Rate } from 'antd'
import {
  getPurchasePurchaseInquiryExternalStatusPurchase,
  getPurchasePurchaseInquiryInteriorStatusPurchase,
  getPurchaseQuotedPriceList,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { Text } = Typography
const intl = getIntl()
const Offter = () => {
  console.log('采购需求单查询')
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoDtails' }),
      key: 'quotedPriceNo',
      dataIndex: 'quotedPriceNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/offter/offter/detail?id=${record.id}&number=${record.quotedPriceNo}&turn=${record.turn}&preview=true`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
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
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('preview') ? 'link' : 'button'}
              url={`/procurementAbility/offter/offter/preview?id=${record.purchaseInquiryId}&number=${record.purchaseInquiryNo}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
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
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoCreateTime' }),
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
      title: intl.formatMessage({ id: 'table.purchase.isWin' }),
      key: 'isPrize',
      dataIndex: 'isPrize',
      render: (text: any) =>
        text ? (
          <Text type="success">{intl.formatMessage({ id: 'table.purchase.okText' })}</Text>
        ) : (
          <Text type="warning">{intl.formatMessage({ id: 'table.purchase.cancelText' })}</Text>
        ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={OFFTER_EXTERNALSTATE_COLOR[text] || 'warning'}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={OFFTER_INTERNALSTATE_COLOR[text] || 'warning'} text={record.interiorStateName} />
      ),
    },
  ]
  return (
    <Table
      schemaType="OFFERSERAH_SCHEMA"
      columns={columns}
      effects="purchaseInquiryNo"
      fetch={getPurchaseQuotedPriceList}
      externalStatusFetch={getPurchasePurchaseInquiryExternalStatusPurchase}
      interiorStatusFetch={getPurchasePurchaseInquiryInteriorStatusPurchase}
    />
  )
}
export default Offter
