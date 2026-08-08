import React from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Button, Space, Typography, Tag } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { INQUIRY_EXTERNALSTATE, INQUIRY_EXTERNALSTATE_COLOR } from '../../constants'
import { getPurchaseQuotedPricePurchaseInquiryList } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const { Text } = Typography
const intl = getIntl()
const Inquiry = () => {
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.dementNo' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            type={AuthUrl('preview') ? 'link' : 'button'}
            url={`/procurementAbility/offter/inquiry/preview?id=${record.id}&number=${record.purchaseInquiryNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.member' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any, record: any) => formatTimeString(text),
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
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={INQUIRY_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="offer">
          <Button
            disabled={!!record.isQuotedPrice}
            onClick={() =>
              history.push(
                `/procurementAbility/offter/addOffter/add?id=${record.id}&number=${record.purchaseInquiryNo}&type=quote`,
              )
            }
            type="link"
          >
            {intl.formatMessage({ id: 'table.purchase.offer' })}
          </Button>
        </AuthButton>
      ),
    },
  ]
  return (
    <Table
      schemaType="OFFERDEMANDSERAH_SCHEMA"
      columns={columns}
      effects="purchaseInquiryNo"
      fetch={getPurchaseQuotedPricePurchaseInquiryList}
    />
  )
}
export default Inquiry
