import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Tag, Badge } from 'antd'
import { WAITAUDITOFFERONESCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeAuditProductQuotationList,
  getTradeProductInquiryExternalStateEnum,
  getTradeProductInquiryInteriorStateEnum,
  postTradeProductQuotationtAuditAll,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const WaitAuditOfferOne = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  /** 批量审核 */
  const fetchSubmitBatch = async () => {
    const res = await postTradeProductQuotationtAuditAll({ ids: rowkeys })
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
          url={`/dealAbility/inquiryOffer/waitAuditOfferOne/offer/detail?id=${record.id}`}
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
          url={`/dealAbility/inquiryOffer/waitAuditOfferOne/inquiry?id=${record.inquiryListId}`}
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
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'options',
      dataIndex: 'options',
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="examine">
          <Button
            type="link"
            disabled={record.interiorState === 1}
            onClick={() => history.push(`/dealAbility/inquiryOffer/waitAuditOfferOne/offer?id=${record.id}`)}
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
      schema={WAITAUDITOFFERONESCHEMA}
      columns={columns}
      effects="quotationNo"
      fetch={getTradeAuditProductQuotationList}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={6}>
            <Button disabled={rowkeys.length === 0} onClick={fetchSubmitBatch}>
              {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
            </Button>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitAuditOfferOne
