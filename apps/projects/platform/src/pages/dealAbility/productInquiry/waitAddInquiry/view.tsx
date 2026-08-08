import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Space, Button, Tag, Badge, Popconfirm, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { WAITADDINQURYSCHEMA } from './schema'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import {
  getTradeInquiryList,
  postTradeInquiryListDelete,
  postTradeInquiryListDeleteAll,
  postTradeInquiryListSubmit,
  postTradeInquiryListSubmitAll,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const { Text } = Typography
const WaitAddInquiry = () => {
  const reload = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const [rowkeys, setRowKeys] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    setLoading(true)
    let res = null
    if (id) {
      res = await postTradeInquiryListSubmit({ id: Number(id) })
    } else {
      res = await postTradeInquiryListSubmitAll({ ids: rowkeys })
    }
    if (res.code !== 1000) {
      setLoading(false)
      return
    }
    reload.current.reloadCurrent()
    setRowKeys([])
    setLoading(false)
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fetchDeleteBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postTradeInquiryListDelete({ id })
    } else {
      res = await postTradeInquiryListDeleteAll({ ids: rowkeys })
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
          url={`/dealAbility/productInquiry/waitAddInquiry/detail?id=${record.id}`}
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
      width: 230,
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return (
          <>
            {record.isSubmit && (
              <AuthButton type="custom" code="submit">
                <Popconfirm
                  title={intl.formatMessage({ id: 'dealAbility.quedingyaotijiaoma' })}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchSubmitBatch(record.id)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'dealAbility.tijiaoshenhe' })}</Button>
                </Popconfirm>
              </AuthButton>
            )}
            {record.isUpdate && (
              <EditAuthButton>
                <Button
                  type="link"
                  onClick={() => history.push(`/dealAbility/productInquiry/waitAddInquiry/edit?id=${record.id}`)}
                >
                  {intl.formatMessage({ id: 'dealAbility.bianji' })}
                </Button>
              </EditAuthButton>
            )}
            {record.isDelete && (
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  title={intl.formatMessage({ id: 'dealAbility.quedingyaoshanchuma' })}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchDeleteBatch(record.id)}
                >
                  <Button disabled={record.interiorState !== 1 && record.externalState !== 1} type="link">
                    {intl.formatMessage({ id: 'dealAbility.shanchu' })}
                  </Button>
                </Popconfirm>
              </AuthButton>
            )}
          </>
        )
      },
    },
  ]

  return (
    <Table
      selectedRow
      reload={reload}
      schema={WAITADDINQURYSCHEMA}
      columns={columns}
      effects="inquiryListNo"
      fetch={getTradeInquiryList}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AddAuthButton>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push(`/dealAbility/productInquiry/waitAddInquiry/add`)}
                >
                  {intl.formatMessage({ id: 'dealAbility.xinjian' })}
                </Button>
              </AddAuthButton>
              <AuthButton type="custom" code="batch">
                <Space direction="horizontal" size={16}>
                  <Button loading={loading} onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                    {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
                  </Button>
                  <Button icon={<DeleteOutlined />} onClick={() => fetchDeleteBatch()} disabled={rowkeys.length === 0}>
                    {intl.formatMessage({ id: 'dealAbility.piliangshanchu' })}
                  </Button>
                </Space>
              </AuthButton>
            </Space>
          </Col>
        </Row>
      }
    />
  )
}
export default WaitAddInquiry
