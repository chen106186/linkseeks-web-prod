import React, { useRef, useState } from 'react'
import { useLocation } from '@linkseeks/router-core'
import Table from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Popconfirm, Tag, Badge } from 'antd'
import { WAITSUBMITINQUIRYSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import { getTradeSubmitInquirySheetList, postTradeInquirySubmit, postTradeInquirySubmitAll } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const WaitSubmitInquiry = () => {
  const reload = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postTradeInquirySubmit({ id: Number(id) })
    } else {
      res = await postTradeInquirySubmitAll({ ids: rowkeys })
    }
    if (res.code === 1000) {
      reload.current.reloadCurrent()
      setRowKeys([])
    }
  }
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/dealAbility/productInquiry/waitSubmitInquiry/detail?id=${record.id}`}
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
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
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
        <AuthButton type="custom" code="submit">
          <Popconfirm
            title={intl.formatMessage({ id: 'dealAbility.quedingyaotijiaoma' })}
            okText={intl.formatMessage({ id: 'dealAbility.shi' })}
            cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
            onConfirm={() => fetchSubmitBatch(record.id)}
          >
            <Button type="link">{intl.formatMessage({ id: 'dealAbility.tijiaoxunjiadan' })}</Button>
          </Popconfirm>
        </AuthButton>
      ),
    },
  ]
  return (
    <Table
      selectedRow
      reload={reload}
      schema={WAITSUBMITINQUIRYSCHEMA}
      columns={columns}
      effects="inquiryListNo"
      fetch={getTradeSubmitInquirySheetList}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batch">
              <Button disabled={rowkeys.length === 0} onClick={() => fetchSubmitBatch()}>
                {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitSubmitInquiry
