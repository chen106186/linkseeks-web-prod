import React from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Button, Space, Typography, Tag, Rate } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import {
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE_COLOR,
  OFFTER_CONFIRMINTERIORSTATE_COLOR,
  OFFTER_EXTERNALSTATE_TYPE,
  CHNUM_TYPE,
} from '../../constants'
import { getPurchaseConfirmQuotedPriceStayConfirmAwardResultList } from '@apps/apis'
import { AuthButton } from '@apps/components'

const { Text } = Typography
const intl = getIntl()
const ConfirmResults = () => {
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNo' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/procurementAbility/confirmOffer/demand?id=${record.id}&number=${record.purchaseInquiryNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
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
      title: intl.formatMessage({ id: 'table.purchase.count' }),
      key: 'count',
      dataIndex: 'count',
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
        <>
          {record.externalState === OFFTER_EXTERNALSTATE_TYPE.WAITSUBMIOFFER_TYPE ? (
            <Tag color={OFFTER_INTERNALSTATE_COLOR[text]}>{record.interiorStateName}</Tag>
          ) : (
            <Tag color={OFFTER_CONFIRMINTERIORSTATE_COLOR[record.confirmInteriorState]}>
              {record.confirmInteriorStateName}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          <AuthButton type="custom" code="result">
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/procurementAbility/confirmOffer/confirmResults/detail?id=${record.id}&turn=${record.turn}`,
                )
              }
            >
              {intl.formatMessage({ id: 'table.purchase.result' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="see">
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/procurementAbility/confirmOffer/confirmResults/detail?id=${record.id}&turn=${record.turn}&preview=true`,
                )
              }
            >
              {intl.formatMessage({ id: 'table.purchase.see' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]
  return (
    <Table
      schemaType="CONFIRMOFFERSUBMITAPRICE_SCHEMA"
      columns={columns}
      effects="purchaseInquiryNo"
      fetch={getPurchaseConfirmQuotedPriceStayConfirmAwardResultList}
    />
  )
}
export default ConfirmResults
