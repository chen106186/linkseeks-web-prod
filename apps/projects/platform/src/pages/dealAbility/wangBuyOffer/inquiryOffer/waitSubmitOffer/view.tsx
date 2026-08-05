import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { Row, Col, Space, Button, Popconfirm } from 'antd'
import { postTradeAskPurchaseQuotePage, postTradeAskPurchaseQuoteSubmitQuote } from '@apps/apis'
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
    let res: any = null
    if (id) {
      res = await postTradeAskPurchaseQuoteSubmitQuote({ ids: [Number(id)] })
    } else {
      res = await postTradeAskPurchaseQuoteSubmitQuote({ ids: rowkeys })
    }
    if (res.code !== 1000) {
      setLoading(false)
      return
    }
    reload.current.reloadCurrent()
    setRowKeys([])
    setLoading(false)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.xuqiudanhao',
        defaultMessage: '需求单号',
      }),
      key: 'askPurchaseNo',
      dataIndex: 'askPurchaseNo',
      render: (text: any, record: any) => (
        <EyeAuthButton type={'link'} url={`/dealAbility/wangBuyOffer/list/detail?id=${record.askPurchaseId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.xuqiuzhaiyao',
        defaultMessage: '需求摘要',
      }),
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
      title: intl.formatMessage({
        id: 'transaction_components.caigoushangmingcheng',
        defaultMessage: '采购商名称',
      }),
      key: 'purchaseMemberName',
      dataIndex: 'purchaseMemberName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiajiezhishijian',
        defaultMessage: '报价截止时间',
      }),
      key: 'quoteEndTime',
      dataIndex: 'quoteEndTime',
      render: (text: any) => format(text),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanhao',
        defaultMessage: '报价单号',
      }),
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
      title: intl.formatMessage({
        id: 'transaction_components.baojiashijian',
        defaultMessage: '报价时间',
      }),
      key: 'quoteTime',
      dataIndex: 'quoteTime',
      render: (text: any) => (text ? format(text) : ''),
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
      width: 120,
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return (
          <>
            <AuthButton code="submit" type="custom">
              <Popconfirm
                title={intl.formatMessage({
                  id: 'transaction_components.shifoutijiaofabuqiugou',
                  defaultMessage: '是否提交发布求购需求',
                })}
                okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                onConfirm={() => fetchSubmitBatch(record.quoteId)}
              >
                <Button type="link">{translate('web.common.submit')}</Button>
              </Popconfirm>
            </AuthButton>
          </>
        )
      },
    },
  ]

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
      fetchRowkeys={(e) => setRowKeys(e)}
      defaultParams={{ innerStatus: 4 }}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AuthButton code="patchSubmit" type="custom">
                <Space direction="horizontal" size={16}>
                  <Button loading={loading} onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                    {intl.formatMessage({
                      id: 'transaction_components.piliangshenhe',
                      defaultMessage: '批量审核',
                    })}
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
