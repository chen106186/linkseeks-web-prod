import React, { useRef, useState } from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Button, Typography, Tag, Rate } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { authFullUrl } from '@apps/domains'
import {
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE_COLOR,
  OFFTER_CONFIRMINTERIORSTATE_COLOR,
  OFFTER_EXTERNALSTATE_TYPE,
  CHNUM_TYPE,
  BUTTONAUTHORITY,
} from '../../constants'
import ModalOperate from '../../components/modalOperate'
import {
  getPurchaseConfirmQuotedPriceList,
  getPurchasePurchaseInquiryExternalStatusPurchase,
  getPurchasePurchaseInquiryInteriorStatusPurchase,
  postPurchaseConfirmQuotedPriceAdjustTime,
} from '@apps/apis'
import { AuthButton } from '@apps/components'

const { Text } = Typography

const intl = getIntl()
const OfferInquire = () => {
  const ref = useRef<any>({})
  const [id, setId] = useState<number>()
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSoucre, setDataSoucre] = useState<number>()
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.dementNo' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          url={`/procurementAbility/confirmOffer/demand?id=${record.id}&number=${record.purchaseInquiryNo}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.details' }),
      key: 'details',
      dataIndex: 'details',
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
      width: 130,
      render: (text: any, record: any) => (
        <>
          {record.button === BUTTONAUTHORITY.FOUR && (
            <AuthButton type="custom" code="offerEndTime">
              <Button
                type="link"
                onClick={() => {
                  setDataSoucre(record.offerEndTime)
                  setId(record.id)
                  setVisible(true)
                }}
              >
                {intl.formatMessage({ id: 'table.purchase.offerEndTime' })}
              </Button>
            </AuthButton>
          )}
          <DetailAuthButton>
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/procurementAbility/confirmOffer/offerInquire/detail?id=${record.id}&turn=${record.turn}&preview=true`,
                )
              }
            >
              {intl.formatMessage({ id: 'table.purchase.see' })}
            </Button>
          </DetailAuthButton>
        </>
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
        schemaType="CONFIRMOFFERSERAH_SCHEMA"
        columns={columns}
        effects="purchaseInquiryNo"
        fetch={getPurchaseConfirmQuotedPriceList}
        externalStatusFetch={getPurchasePurchaseInquiryExternalStatusPurchase}
        interiorStatusFetch={getPurchasePurchaseInquiryInteriorStatusPurchase}
        reload={ref}
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'table.purchase.offerEndTime' })}
        visible={visible}
        modalType="date"
        data={dataSoucre}
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
        fetch={postPurchaseConfirmQuotedPriceAdjustTime}
      />
    </>
  )
}
export default OfferInquire
