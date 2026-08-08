import React, { Fragment, useRef } from 'react'
import { AuthButton, EyeAuthButton, StandardFormTable } from '@apps/components'
import moment from 'moment'
import {
  postTradeAskPurchaseQuoteDelete,
  postTradeAskPurchaseQuotePage,
  postTradeAskPurchaseQuoteSubmitAudit,
  postTradeAskPurchaseQuoteSubmitQuote,
  postTradeMobileAskPurchaseQuoteInvalidate,
} from '@apps/apis'
import { sourcingStatusList, quoteStatusList, INNER_STATUS } from '../../wangBuy/constats'
import { Button, Popconfirm, Space } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

const format = (text, fmt?: string) => {
  return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
}

const QuoteList = () => {
  const intl = useIntl()
  const tableRef = StandardFormTable.useTableRef()
  const loadingRef = useRef<boolean>(false)
  const translate = useWebIntl()

  /** 批量审核 */
  const fetchSubmit = async (id: number) => {
    if (loadingRef.current) {
      return
    }
    loadingRef.current = true
    postTradeAskPurchaseQuoteSubmitAudit({ ids: [Number(id)] })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .catch(() => {
        loadingRef.current = false
      })
  }

  /**
   * 删除
   * */
  const fetchDelete = async (id: number) => {
    const res = await postTradeAskPurchaseQuoteDelete({ id })

    if (res.code === 1000) {
      tableRef.current.reload()
    }
  }

  /** 提交报价单 */
  const fetchSubmitQuote = async (id: number) => {
    const res = await postTradeAskPurchaseQuoteSubmitQuote({ ids: [Number(id)] })
    if (res.code === 1000) {
      tableRef.current.reload()
    }
  }

  /** 过期作废 */
  const handleExpired = async (id: number) => {
    const res = await postTradeMobileAskPurchaseQuoteInvalidate({ ids: [id] } as any)
    if (res.code === 1000) {
      tableRef.current.reload()
    }
  }

  const columns = StandardFormTable.createColumns([
    {
      title: translate('web.resource.order.baojiadanhao'),
      key: 'quoteNo',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => {
        if (text) {
          return (
            <EyeAuthButton
              type="link"
              url={`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/detail?id=${record.quoteId}`}
            >
              {text}
            </EyeAuthButton>
          )
        }
        return '-'
      },
    },
    {
      title: translate('web.resource.order.baojiadanzhaiyao'),
      key: 'quoteName',
    },
    {
      title: translate('web.resource.deal.baojiadanzhuangtai'),
      key: 'innerStatus',
      render: (text: any) => text && quoteStatusList[text],
    },
    {
      title: translate('web.resource.mall.baojiajiezhishijian'),
      key: 'quoteEndTime',
      render: (text: any) => format(text),
    },
    {
      title: translate('web.resource.deal.baojiadanjushijian'),
      key: 'quoteTime',
      render: (text: any) => text && format(text),
    },
    {
      title: translate('web.resource.deal.xuqiudanzhaiyao'),
      key: 'name',
      hidden: true,
      searchField: 'Input',
    },
    {
      title: translate('web.resource.mall.xuqiudanhao'),
      key: 'askPurchaseNo',
      searchField: 'Input',
      render: (text: any, record: any) => (
        <EyeAuthButton type="link" url={`/dealAbility/wangBuyOffer/list/detail?id=${record.askPurchaseId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.member.caigoushangmingchen'),
      key: 'purchaseMemberName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.applyTime'),
      key: 'quoteTime',
      hidden: true,
      searchField: {
        type: 'DateRange',
        showTime: true,
        name: ['billStartTime', 'billEndTime'],
        placeholder: [translate('web.common.kaishishijian'), translate('web.common.jieshushijian')],
      },
    },
    {
      title: translate('web.resource.deal.xuqiudanzhuangtai'),
      key: 'outerStatus',
      render: (text: any) => text && sourcingStatusList[text],
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: translate('web.resource.mall.baojiazhong'),
            value: 2,
          },
          {
            label: translate('web.resource.deal.bijiazhong'),
            value: '3,4,5,6,7,8',
          },
          {
            label: translate('web.resource.mall.finshed'),
            value: 9,
          },
          {
            label: translate('web.common.yizuofei'),
            value: 12,
          },
        ],
      },
    },
    {
      title: translate('web.resource.deal.baojiadanzhuangtai'),
      key: 'innerStatus',
      hidden: true,
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.zhuangtaidaitijiaoshenhe',
            }),
            value: INNER_STATUS.waitAduit,
          },
          {
            label: intl.formatMessage({ id: 'transaction_components.daishenheyiji' }),
            value: INNER_STATUS.waitAduitFirst,
          },
          {
            label: intl.formatMessage({ id: 'transaction_components.daishenheerji' }),
            value: INNER_STATUS.waitAduitSecond,
          },
          {
            label: intl.formatMessage({ id: 'transaction_components.daitijiaobaojiadan' }),
            value: INNER_STATUS.waitSubmit,
          },
          {
            label: intl.formatMessage({ id: 'transaction_components.yitijiao' }),
            value: INNER_STATUS.submited,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.zhuangtaishenhebutongguoyiji',
            }),
            value: INNER_STATUS.unPassFirst,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.zhuangtaishenhebutongguoerji',
            }),
            value: INNER_STATUS.unPassSecond,
          },
          {
            label: translate('web.resource.deal.zhongbiao'),
            value: INNER_STATUS.winningBid,
          },
          {
            label: translate('web.resource.deal.weizhongbiao'),
            value: INNER_STATUS.noSuccessBid,
          },
        ],
      },
    },
    {
      title: translate('web.common.control'),
      key: 'option',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        if (record.outerStatus === 10 && [2, 3, 4, 6, 7].includes(record.innerStatus)) {
          return (
            <Popconfirm
              title={translate('web.resource.deal.shifouquerenzuofeigaibaojiadan')}
              okText={intl.formatMessage({ id: 'dealAbility.shi' })}
              cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
              onConfirm={() => handleExpired(record.quoteId)}
            >
              <Button type="link">{translate('web.resource.deal.guoqizuofei')}</Button>
            </Popconfirm>
          )
        }
        return (
          <Space>
            {record.innerStatus === 1 && (
              <>
                <Popconfirm
                  title={translate('web.resource.deal.shifoutijiaoshenhe')}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchSubmit(record.quoteId)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'saleOrder.tijiaoshenhe' })}</Button>
                </Popconfirm>

                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/edit?quoteId=${record.quoteId}`)
                  }
                >
                  {intl.formatMessage({ id: 'purchaseRequisition.xiugai' })}
                </Button>
                <Popconfirm
                  title={translate('web.resource.deal.shifouquerenshanchugaibaojiadan')}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchDelete(record.quoteId)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'purchaseRequisition.shanchu' })}</Button>
                </Popconfirm>
              </>
            )}
            {(record.innerStatus === 2 || record.innerStatus === 3) && (
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/detail?id=${record.quoteId}&verify=${
                      record.innerStatus === 2 ? 1 : 2
                    }`,
                  )
                }}
              >
                {intl.formatMessage({
                  id: 'transaction_components.shenhe',
                  defaultMessage: '审核',
                })}
              </Button>
            )}
            {(record.innerStatus === 6 || record.innerStatus === 7) && (
              <>
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/edit?quoteId=${record.quoteId}`)
                  }
                >
                  {intl.formatMessage({ id: 'purchaseRequisition.xiugai' })}
                </Button>
                <Popconfirm
                  title={translate('web.resource.deal.shifouquerenshanchugaibaojiadan')}
                  okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                  cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                  onConfirm={() => fetchDelete(record.quoteId)}
                >
                  <Button type="link">{intl.formatMessage({ id: 'purchaseRequisition.shanchu' })}</Button>
                </Popconfirm>
              </>
            )}
            {record.innerStatus === 4 && (
              <Popconfirm
                title={translate('web.resource.deal.shifoutijiaogaibaojiadan')}
                okText={intl.formatMessage({ id: 'dealAbility.shi' })}
                cancelText={intl.formatMessage({ id: 'dealAbility.fou' })}
                onConfirm={() => fetchSubmitQuote(record.quoteId)}
              >
                <Button type="link">{translate('web.common.submit')}</Button>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ])

  const fetchData = (params) => {
    const payload = {
      ...params,
    }

    if (!payload.innerStatus && !payload.outerStatus) {
      payload.innerStatusList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }

    if (payload.outerStatus && typeof payload.outerStatus === 'string') {
      payload.outerStatusList = payload.outerStatus.split(',')
      payload.outerStatus = undefined
    }

    if (payload.billStartTime) {
      payload.billStartTime = moment(payload.billStartTime).format('YYYY-MM-DD HH:mm:ss')
    }

    if (payload.billEndTime) {
      payload.billEndTime = moment(payload.billEndTime).format('YYYY-MM-DD HH:mm:ss')
    }

    return new Promise((resolve) => {
      postTradeAskPurchaseQuotePage(payload, { ctlType: 'none' }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return <StandardFormTable actionRef={tableRef} columns={columns} request={fetchData} autoScrollX />
}

export default QuoteList
