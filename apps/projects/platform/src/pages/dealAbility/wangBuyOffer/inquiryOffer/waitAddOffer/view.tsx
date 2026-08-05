import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { Row, Col, Space, Button, Popconfirm } from 'antd'
import {
  postTradeAskPurchaseQuotePage,
  postTradeAskPurchaseQuoteDelete,
  postTradeInquiryListDeleteAll,
  postTradeAskPurchaseQuoteSubmitAudit,
} from '@apps/apis'
import { AuthButton, EyeAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { wangBuyScemaBuy } from '../../list/schema/wangBuyScema'
import { quoteStatusList, sourcingStatusList } from '../../../wangBuy/constats'

const intl = getIntl()

const index: React.FC = () => {
  const reload = useRef<any>({})
  const translate = useWebIntl()

  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }

  const [rowkeys, setRowKeys] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    setLoading(true)
    let ids: number[] = []
    let fn = postTradeAskPurchaseQuoteSubmitAudit
    if (id) {
      ids = [Number(id)]
    } else {
      ids = rowkeys
    }
    fn({ ids })
      .then((res) => {
        console.log(res, 'ssss')
        if (res.code !== 1000) {
          setLoading(false)
          return
        }
        reload.current.reloadCurrent()
        setRowKeys([])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fetchDeleteBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postTradeAskPurchaseQuoteDelete({ id })
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
      title: intl.formatMessage({ id: 'dealAbility.xuqiudanhao' }),
      key: 'askPurchaseNo',
      dataIndex: 'askPurchaseNo',
      render: (text: any, record: any) => (
        <EyeAuthButton type={'link'} url={`/dealAbility/wangBuyOffer/list/detail?id=${record.askPurchaseId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xuqiuzhaiyao' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.deal.xuqiudanzhuangtai'),
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (text: any) => text && intl.formatMessage({ id: sourcingStatusList[text] }),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushangmingzi' }),
      key: 'purchaseMemberName',
      dataIndex: 'purchaseMemberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
      key: 'quoteEndTime',
      dataIndex: 'quoteEndTime',
      render: (text: any) => format(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
      key: 'quoteNo',
      dataIndex: 'quoteNo',
      render: (text: any, record: any) =>
        text ? (
          <EyeAuthButton
            type={'link'}
            url={`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/detail?id=${record.quoteId}`}
          >
            {text}
          </EyeAuthButton>
        ) : (
          '-'
        ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiashijian' }),
      key: 'quoteTime',
      dataIndex: 'quoteTime',
      render: (text: any) => {
        if (text) {
          return format(text)
        }
        return '-'
      },
    },
    {
      title: translate('web.resource.deal.baojiadanzhuangtai'),
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text: any) => text && intl.formatMessage({ id: quoteStatusList[text] }),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'options',
      width: 200,
      dataIndex: 'options',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            {record.innerStatus === 1 && (
              <>
                <AuthButton code="shenhe" type="custom">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'transaction_components.shifoutijiaofabuqiugou',
                      defaultMessage: '是否提交发布求购需求',
                    })}
                    okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                    cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                    onConfirm={() => fetchSubmitBatch(record.quoteId)}
                  >
                    <Button type="link">{intl.formatMessage({ id: 'saleOrder.tijiaoshenhe' })}</Button>
                  </Popconfirm>
                </AuthButton>
                <AuthButton code="edit" type="custom">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/edit?quoteId=${record.quoteId}`)
                    }
                  >
                    {intl.formatMessage({ id: 'purchaseRequisition.xiugai' })}
                  </Button>
                </AuthButton>
                <AuthButton code="delete" type="custom">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'transaction_components.shifoushanchuqiugou',
                      defaultMessage: '是否删除发布求购需求',
                    })}
                    okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                    cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                    onConfirm={() => fetchDeleteBatch(record.quoteId)}
                  >
                    <Button type="link">{intl.formatMessage({ id: 'purchaseRequisition.shanchu' })}</Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
            {(record.innerStatus === 6 || record.innerStatus === 7) && (
              <>
                <AuthButton code="edit" type="custom">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/edit?quoteId=${record.quoteId}`)
                    }
                  >
                    {intl.formatMessage({ id: 'purchaseRequisition.xiugai' })}
                  </Button>
                </AuthButton>
                <AuthButton code="delete" type="custom">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'transaction_components.shifoushanchuqiugou',
                      defaultMessage: '是否删除发布求购需求',
                    })}
                    okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                    cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                    onConfirm={() => fetchDeleteBatch(record.quoteId)}
                  >
                    <Button type="link">{intl.formatMessage({ id: 'purchaseRequisition.shanchu' })}</Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
          </>
        )
      },
    },
  ]
  const fnSelectRowKey = (e) => {
    setRowKeys(e)
  }
  return (
    <Table
      selectedRow
      reload={reload}
      schema={wangBuyScemaBuy}
      columns={columns}
      effects="quoteNo"
      rowKey="quoteId"
      activeKey="quoteId"
      fetch={postTradeAskPurchaseQuotePage}
      fetchRowkeys={(e) => fnSelectRowKey(e)}
      defaultParams={{ innerStatusList: [1, 6, 7] }}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AuthButton code="submit" type="custom">
                <Space direction="horizontal" size={16}>
                  <Button loading={loading} onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                    {intl.formatMessage({ id: 'dealAbility.piliangtijiaoshenhe' })}
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
export default index
