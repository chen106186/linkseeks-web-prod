import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Tag, Badge, Modal } from 'antd'
import { WAITALLOTORDERSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeProductInquiryExternalStateEnum,
  getTradeProductInquiryInteriorStateEnum,
  getTradeProductInquiryNotAssignedAssigned,
  getTradeProductInquiryNotAssignedList,
  postTradeProductInquiryNotAssignedAssignedBatch,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const WaitAllotOrder = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [loading, setLoading] = useState<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: string, index?: number) => {
    let res = null
    if (id) {
      setLoading({ [index]: true })
      res = await getTradeProductInquiryNotAssignedAssigned({ inquiryId: id })
    } else {
      setLoading({ load: true })
      res = await postTradeProductInquiryNotAssignedAssignedBatch({ idList: rowkeys })
    }
    if (res.code !== 1000) {
      setLoading({})
      return
    }
    setLoading({})
    ref.current.reloadCurrent()
    Modal.success({
      content: intl.formatMessage({ id: 'purchaseOrder.lingquchenggong', defaultMessage: '领取成功' }),
    })
    setRowKeys([])
  }
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/dealAbility/inquiryOffer/waitAllotOrder/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.beixunjiahuiyuan' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.jiaofuriqi' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      key: 'voucherTime',
      dataIndex: 'voucherTime',
      render: (text: any) => formatTimeString(text),
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
      render: (text: any, record: any, index: number) => (
        <AuthButton type="custom" code="collect">
          <Button type="link" loading={loading[index]} onClick={() => fetchSubmitBatch(record.id, index)}>
            {intl.formatMessage({ id: 'purchaseOrder.lingqu', defaultMessage: '领取' })}
          </Button>
        </AuthButton>
      ),
    },
  ]
  return (
    <Table
      selectedRow
      reload={ref}
      schema={WAITALLOTORDERSCHEMA}
      columns={columns}
      effects="inquiryListNo"
      fetch={getTradeProductInquiryNotAssignedList}
      externalStatusFetch={getTradeProductInquiryExternalStateEnum({ type: '2' })}
      interiorStatusFetch={getTradeProductInquiryInteriorStateEnum({ type: '2' })}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batch">
              <Button loading={loading?.load} disabled={rowkeys.length === 0} onClick={() => fetchSubmitBatch()}>
                {intl.formatMessage({ id: 'purchaseOrder.pilianglingqu', defaultMessage: '批量领取' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitAllotOrder
