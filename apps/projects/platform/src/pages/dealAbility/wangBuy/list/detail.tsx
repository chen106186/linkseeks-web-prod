import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Card, message, Modal } from '@linkseeks/ui'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/components/DetailLayout/components/context'
import PeripheralLayout from '@/components/DetailLayout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import ConditionLayout from './components/conditionLayout'
import moment from 'moment'
import {
  getTradeAskPurchaseDetail,
  GetTradeAskPurchaseDetailResponse,
  postTradeAskPurchasePageQuote,
  PostTradeAskPurchasePageQuoteResponseDetail,
  postTradeAskPurchaseAwardBid,
  postTradeAskPurchaseAwardBidAudit,
} from '@apps/apis'
import { innerStatusList } from '../constats'
import MaterialTable from './components/material'
import Docking from './components/docking'
import CirculationTable from './components/circulation'
import { downloadFileByNameAndUrl } from '@apps/utils'
import BasiceTable from '../offer/components/basiceTable'
import PriceComparisonInfo from './components/priceComparisonInfo'
import { history } from '@linkseeks/router-manager'
import ModalAudit from '@/components/ModalAudit'

const intl = getIntl()

const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout1' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'conditionLayout', title: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const DemandDetailed: React.FC = () => {
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const { id, comparePrices } = useQuery()
  const [dataSource, setDataSource] = useState<GetTradeAskPurchaseDetailResponse>()
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [askPurchaseQuoteGoodsResponses, setAskPurchaseQuoteGoodsResponses] = useState<
    PostTradeAskPurchasePageQuoteResponseDetail[]
  >([])
  const [selectQuoteId, setSelectQuoteId] = useState<number>()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const auditRef = useRef<any>()

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.xuqiudanhao',
              defaultMessage: '需求单号',
            }),
            extra: data.askPurchaseNo,
          },
          {
            label: '需求单状态',
            extra: data.status && innerStatusList[data.status],
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.xuqiudanzhaiyao',
              defaultMessage: '需求单摘要',
            }),
            extra: data.name,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.danjushijian',
              defaultMessage: '单据时间',
            }),
            extra: format(data.billTime),
          },
        ],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.deliveryTime', defaultMessage: '交付日期' }),
            extra: format(data.deliveryTime),
          },
          {
            label: '报价截止时间',
            extra: format(data.offerEndTime),
          },
          {
            label: '联系人',
            extra: data.contactName,
          },
          {
            label: '联系人电话',
            extra: data.contactMobile,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.address', defaultMessage: '交付地址' }),
            extra: data.deliverAddress,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.offerAsk', defaultMessage: '报价要求' }),
            extra: data.quoteRequire,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.taxesAsk', defaultMessage: '税费要求' }),
            extra: data.taxesRequire,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.logisticsAsk', defaultMessage: '物流要求' }),
            extra: data.logisticsRequire,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.packRequireAsk', defaultMessage: '包装要求' }),
            extra: data.packageRequire,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.paymentType', defaultMessage: '付款方式' }),
            extra: data.paymentWay,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.otherRequireAsk', defaultMessage: '其他要求' }),
            extra: data.otherRequire,
          },
        ],
      },
    ])
  }

  /**
   * 查询报价信息
   */
  const fetchQuoteList = () => {
    postTradeAskPurchasePageQuote({ askPurchaseId: id }, { ctlType: 'none' })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setAskPurchaseQuoteGoodsResponses(res.data.data || [])
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const fetchDataSource = async () => {
    const params = {
      id,
    }
    await getTradeAskPurchaseDetail({ ...params }).then((res) => {
      if (res.code !== 1000) {
        // history.goBack()
        return
      }
      const { data } = res
      setDataSource(data)
      handleBasicEffect(data)
      handleConditionEffect(data)
    })
  }

  useEffect(() => {
    fetchDataSource()
    if (comparePrices) {
      fetchQuoteList()
    }
  }, [])
  const fnGetShopIdList = () => {
    const list = dataSource?.askPurchaseShopResponses?.map((item) => {
      return {
        shopId: item.shopId,
        shopName: item.shopName,
      }
    })
    return list
  }

  /** 提交授标审核 */
  const handleAwardBid = async () => {
    if ([3, 6, 7].includes(dataSource?.status!)) {
      if (!selectQuoteId) {
        message.info('请选择授标的供应商')
        return
      }
      setSubmitLoading(true)
      const res = await postTradeAskPurchaseAwardBid({ id, quoteId: selectQuoteId })
      if (res.code === 1000) {
        history.goBack()
      } else {
        message.error(res.message)
      }
      setSubmitLoading(false)
    } else if (dataSource?.status === 8) {
      Modal.confirm({
        title: '是否确认授标',
        onOk: () => {
          postTradeAskPurchaseAwardBidAudit({ id })
            .then((res) => {
              if (res.code === 1000) {
                history.goBack()
              } else {
                message.error(res.message)
              }
            })
            .finally(() => {
              setSubmitLoading(false)
            })
        },
      })
    } else {
      setVisible(true)
    }
  }

  const handleAudit = () => {
    auditRef.current
      .formref()
      .validateFields()
      .then((values) => {
        setSubmitLoading(true)
        postTradeAskPurchaseAwardBidAudit({ id, agree: values.state, reason: values.auditOpinion })
          .then((res) => {
            if (res.code === 1000) {
              history.goBack()
            } else {
              message.error(res.message)
            }
          })
          .finally(() => {
            setSubmitLoading(false)
          })
      })
  }

  return dataSource ? (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource?.askPurchaseNo}
        effect={
          comparePrices && (
            <Button type="primary" loading={submitLoading} onClick={handleAwardBid}>
              {dataSource?.status === 8 ? '确认授标' : '审核'}
            </Button>
          )
        }
        tabLink={TABLINK}
        components={
          <Fragment>
            <BasicLayout effect={basicEffect} span={12} />
            {!comparePrices && <MaterialTable tableMessage={dataSource?.askPurchaseGoodsResponses} />}
            {comparePrices && (
              <>
                <BasiceTable askPurchaseQuoteGoodsResponses={askPurchaseQuoteGoodsResponses} />
                <PriceComparisonInfo
                  showAwardBid={[3, 6, 7].includes(dataSource?.status!)}
                  id={id}
                  status={dataSource?.status!}
                  selectQuoteId={selectQuoteId}
                  onSelectQuoteId={(quoteId) => setSelectQuoteId(quoteId)}
                />
              </>
            )}
            <ConditionLayout effect={conditionEffect} />
            <Card
              id="conditionLayout"
              title={intl.formatMessage({
                id: 'transaction_components.fujian',
                defaultMessage: '附件',
              })}
            >
              <div>
                {dataSource?.enclosureUrls?.map((item: any) => {
                  return (
                    <Button type="link" onClick={() => downloadFileByNameAndUrl(item.url, item.name)}>
                      {item.name}
                    </Button>
                  )
                })}
              </div>
            </Card>
            <Docking
              type={dataSource?.publishType}
              tableMessage={dataSource?.askPurchaseMemberResponses}
              selectKey={fnGetShopIdList()}
            />

            <CirculationTable
              title={intl.formatMessage({
                id: 'transaction_components.neibuliuzhuan',
                defaultMessage: '内部流转',
              })}
              tableMessage={dataSource?.innerRecords}
            />
            <ModalAudit
              formref={auditRef}
              modalTypes={{
                title: '审核',
                visible: visible,
                destroyOnClose: true,
                onOk: () => handleAudit(),
                onCancel: () => setVisible(false),
                confirmLoading: submitLoading,
              }}
            />
          </Fragment>
        }
      />
    </Context.Provider>
  ) : null
}

export default DemandDetailed
