import React, { useRef } from 'react'
import Table from '@/components/TableLayout'
import { useIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
import { Tag, Badge } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { OFFERSEARCHSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeProductQuotationList,
  getTradeQuotationtInquiryExternalStateEnum,
  postTradeQuotationtInquiryInteriorStateEnum,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
const OfferSearch = () => {
  const reload = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
      key: 'quotationNo',
      dataIndex: 'quotationNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'custom', 'offer') ? 'link' : 'button'}
          url={`/dealAbility/inquiryOffer/offerSearch/offer?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/dealAbility/inquiryOffer/offerSearch/inquiry?id=${record.inquiryListId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      key: 'voucherTime',
      dataIndex: 'voucherTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => <Tag color={EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => <Badge status={INTERNALSTATE_COLOR[text]} text={record.interiorStateName} />,
    },
  ]

  return (
    <Table
      schema={OFFERSEARCHSCHEMA}
      columns={columns}
      effects="quotationNo"
      fetch={getTradeProductQuotationList}
      reload={reload}
      externalStatusFetch={getTradeQuotationtInquiryExternalStateEnum()}
      interiorStatusFetch={postTradeQuotationtInquiryInteriorStateEnum({}, { ctlType: 'none' })}
    />
  )
}

export default OfferSearch
