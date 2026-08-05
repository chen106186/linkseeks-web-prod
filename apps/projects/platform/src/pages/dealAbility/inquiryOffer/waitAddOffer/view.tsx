import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Space, Button, Popconfirm, Tag, Badge } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { WAITADDOFFERSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeProductInquiryExternalStateEnum,
  getTradeProductInquiryInteriorStateEnum,
  getTradeStayProductQuotationList,
  postTradeProductQuotationDelete,
  postTradeProductQuotationDeleteAll,
  postTradeProductQuotationtAll,
  postTradeProductQuotationtSubmit,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const WaitAddOffer = () => {
  const reload = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [rowkeys, setRowKeys] = useState<Array<number>>([])

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postTradeProductQuotationtSubmit({ id: Number(id) })
    } else {
      res = await postTradeProductQuotationtAll({ ids: rowkeys })
    }
    if (res.code === 1000) {
      reload.current.reloadCurrent()
      setRowKeys([])
    }
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fetchDeleteBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postTradeProductQuotationDelete({ id })
    } else {
      res = await postTradeProductQuotationDeleteAll({ ids: rowkeys })
    }
    if (res.code === 1000) {
      reload.current.reloadCurrent()
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
          type={authUrl(pathname, 'custom', 'offerPreview') ? 'link' : 'button'}
          url={`/dealAbility/inquiryOffer/waitAddOffer/offerPreview?id=${record.id}`}
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
          url={`/dealAbility/inquiryOffer/waitAddOffer/inquiry?id=${record.inquiryListId}`}
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
      width: 230,
      dataIndex: 'options',
      render: (text: any, record: any) => {
        console.log(record.interiorState)
        return (
          <>
            {record.interiorState !== 5 && record.interiorState !== 6 && (
              <Button type="link" onClick={() => fetchSubmitBatch(record.id)}>
                {intl.formatMessage({ id: 'dealAbility.tijiaoshenhe' })}
              </Button>
            )}
            <EditAuthButton>
              <Button
                type="link"
                onClick={() => history.push(`/dealAbility/inquiryOffer/waitAddOffer/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'dealAbility.xiugai' })}
              </Button>
            </EditAuthButton>

            {record.interiorState !== 5 && record.interiorState !== 6 && (
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  destroyTooltipOnHide
                  title={intl.formatMessage({ id: 'dealAbility.quedingyaoshanchuma' })}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchDeleteBatch(record.id)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'dealAbility.shanchu' })}</Button>
                </Popconfirm>
              </AuthButton>
            )}
          </>
        )
      },
    },
  ]

  const getCheckboxProps = (record) => {
    return { disabled: !record.isBatch }
  }

  return (
    <Table
      selectedRow
      reload={reload}
      schema={WAITADDOFFERSCHEMA}
      columns={columns}
      effects="quotationNo"
      fetch={getTradeStayProductQuotationList}
      fetchRowkeys={(e) => setRowKeys(e)}
      getCheckboxProps={getCheckboxProps}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AddAuthButton>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push(`/dealAbility/inquiryOffer/waitAddOffer/add`)}
                >
                  {intl.formatMessage({ id: 'dealAbility.xinjian' })}
                </Button>
              </AddAuthButton>
              <AuthButton type="custom" code="batch">
                <Button onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
                </Button>
              </AuthButton>
              <AuthButton type="custom" code="batch">
                <Button icon={<DeleteOutlined />} onClick={() => fetchDeleteBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'dealAbility.piliangshanchu' })}
                </Button>
              </AuthButton>
            </Space>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitAddOffer
