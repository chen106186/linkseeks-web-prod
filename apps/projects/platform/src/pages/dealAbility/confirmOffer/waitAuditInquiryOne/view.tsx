import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Tag, Badge } from 'antd'
import { WAITAUDITINQUIRYONESCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeNotarizeEnquiryQuotedPriceAuditList,
  getTradeProductInquiryExternalStateEnum,
  getTradeProductInquiryInteriorStateEnum,
  postTradeNotarizeEnquiryQuotedPriceAuditAll,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const WaitAuditInquiryOne = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  /** 批量审核 */
  const fetchSubmitBatch = async () => {
    const res = await postTradeNotarizeEnquiryQuotedPriceAuditAll({ ids: rowkeys })
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
      key: 'quotationNo',
      dataIndex: 'quotationNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'custom', 'offer') ? 'link' : 'button'}
          url={`/dealAbility/confirmOffer/waitAuditInquiryOne/offer?id=${record.id}`}
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
        <EyeAuthButton
          type={authUrl(pathname, 'custom', 'inquiry') ? 'link' : 'button'}
          url={`/dealAbility/confirmOffer/waitAuditInquiryOne/inquiry?id=${record.inquiryListId}`}
        >
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
      title: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }),
      key: 'offerMemberName',
      dataIndex: 'offerMemberName',
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
      render: (text: any, record: any) => (
        <Tag color={EXTERNALSTATE_COLOR[text] || 'error'}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={INTERNALSTATE_COLOR[text] || 'error'} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'options',
      dataIndex: 'options',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="offer/detail">
          <Button
            type="link"
            onClick={() => history.push(`/dealAbility/confirmOffer/waitAuditInquiryOne/offer/detail?id=${record.id}`)}
          >
            {intl.formatMessage({ id: 'dealAbility.shenhe' })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  return (
    <Table
      selectedRow
      reload={ref}
      schema={WAITAUDITINQUIRYONESCHEMA}
      columns={columns}
      effects="quotationNo"
      fetch={getTradeNotarizeEnquiryQuotedPriceAuditList}
      externalStatusFetch={getTradeProductInquiryExternalStateEnum({ type: '2' })}
      interiorStatusFetch={getTradeProductInquiryInteriorStateEnum({ type: '2' })}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batch">
              <Button disabled={rowkeys.length === 0} onClick={fetchSubmitBatch}>
                {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitAuditInquiryOne
