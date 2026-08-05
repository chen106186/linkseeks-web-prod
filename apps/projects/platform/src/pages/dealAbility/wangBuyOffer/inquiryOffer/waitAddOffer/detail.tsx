import { useRef, useMemo, useEffect, useState } from 'react'
import { Card, Button, Space } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/components/DetailLayout/components/context'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import moment from 'moment'
import { history } from '@linkseeks/router-manager'
import {
  getTradeAskPurchaseAskPurchaseQuoteDetail,
  getTradeAskPurchaseQuoteDetail,
  postTradeAskPurchaseQuoteAuditLevel1,
  postTradeAskPurchaseQuoteAuditLevel2,
} from '@apps/apis'
import { useAuth } from '@apps/services'
import ModalAudit from '@/components/ModalAudit'
import AuditProcess from '@/components/AuditProcess'
import { downloadFileByNameAndUrl } from '@apps/utils'
import { PageHeaderWrapper } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import OffterTable from '../../../wangBuy/offer/components/offterTable'
import CirculationTable from '../../../wangBuy/list/components/circulation'

const intl = getIntl()

const DemandDetailed = () => {
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const { id, verify } = useQuery()
  const { getAuth } = useAuth()
  const [purchaseDetail, setPurchaseDetail] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const ref = useRef<any>({})
  const translate = useWebIntl()

  const handleSubmit = () => {
    if (verify) {
      setConfirmLoading(true)
      ref.current
        .formref()
        .validateFields()
        .then((values) => {
          const obj = {
            ids: [id],
            agree: values.state,
            remark: values.auditOpinion,
          }

          const API_MAP = {
            '1': postTradeAskPurchaseQuoteAuditLevel1,
            '2': postTradeAskPurchaseQuoteAuditLevel2,
          }
          API_MAP[verify](obj)
            .then((res) => {
              if (res.code === 1000) {
                setVisible(false)
                history.goBack()
              }
            })
            .finally(() => {
              setConfirmLoading(false)
            })
        })
    }
  }

  useEffect(() => {
    if (id) {
      const userInfo = getAuth()
      const fn = {
        1: getTradeAskPurchaseQuoteDetail,
        2: getTradeAskPurchaseAskPurchaseQuoteDetail,
      }

      fn[userInfo?.memberRoleType]({ id: id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setPurchaseDetail(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  const basicEffcect = useMemo(() => {
    if (purchaseDetail) {
      return [
        {
          col: [
            {
              label: translate('web.resource.deal.duiyingxuqiudanhao'),
              extra: purchaseDetail.askPurchaseNo,
            },
            {
              label: translate('web.resource.deal.gongyingshangmingcheng'),
              extra: purchaseDetail.memberName,
            },
          ],
        },
        {
          col: [
            {
              label: translate('web.resource.mall.baojiajiezhishijian'),
              extra: format(purchaseDetail.createTime),
            },
            {
              label: translate('web.resource.afterAbility.applyTime'),
              extra: purchaseDetail.billTime && format(purchaseDetail.billTime),
            },
          ],
        },
      ]
    }
    return []
  }, [purchaseDetail])

  const quotationEffcect = useMemo(() => {
    if (purchaseDetail) {
      return [
        {
          col: [
            {
              label: translate('web.resource.order.baojiadanhao'),
              extra: purchaseDetail.quoteNo,
            },
            {
              label: translate('web.resource.mall.lianxirendianhua'),
              extra: purchaseDetail.contactMobile,
            },
            {
              label: translate('web.resource.deal.bizhong'),
              extra: purchaseDetail.currencyName,
            },
          ],
        },
        {
          col: [
            {
              label: translate('web.resource.order.baojiadanzhaiyao'),
              extra: purchaseDetail.name,
            },
            {
              label: translate('web.resource.logistics.lianxirenxingming'),
              extra: purchaseDetail.contactName,
            },
          ],
        },
      ]
    }
    return []
  }, [purchaseDetail])

  const otherQuotationEffcect = useMemo(() => {
    if (purchaseDetail) {
      return [
        {
          col: [
            {
              label: translate('web.resource.deal.jiaofushuoming'),
              extra: purchaseDetail.deliverRemark,
            },
            {
              label: translate('web.resource.mall.shuifeishuoming'),
              extra: purchaseDetail.taxesRemark,
            },
            {
              label: translate('web.resource.deal.baozhuangshuoming'),
              extra: purchaseDetail.packageRemark,
            },
          ],
        },
        {
          col: [
            {
              label: translate('web.resource.deal.fukuanshuoming'),
              extra: purchaseDetail.paymentRemark,
            },
            {
              label: translate('web.resource.deal.wuliushuoming'),
              extra: purchaseDetail.logisticsRemark,
            },
            {
              label: translate('web.resource.deal.qitashuoming'),
              extra: purchaseDetail.otherRemark,
            },
          ],
        },
      ]
    }
    return []
  }, [purchaseDetail])

  return (
    <Context.Provider value={purchaseDetail}>
      <PageHeaderWrapper
        backDom
        title={`${translate('web.resource.deal.baojiadanxiangqing')} | ${purchaseDetail.quoteNo}`}
        extra={
          verify && (
            <Button type="primary" onClick={() => setVisible(true)}>
              {translate('web.common.approved')}
            </Button>
          )
        }
      >
        <Space style={{ display: 'flex', width: '100%' }} size={16} direction="vertical">
          {purchaseDetail.simpleProcessDefVO && (
            <AuditProcess
              id="auditProcess"
              customTitleKey="taskName"
              customKey="taskStep"
              initRadioValue={'inner'}
              innerVerifyCurrent={Number(purchaseDetail.simpleProcessDefVO?.currentStep) - 1}
              innerVerifySteps={purchaseDetail.simpleProcessDefVO?.tasks}
            />
          )}
          <BasicLayout title={translate('web.common.jibenxinxi')} effect={basicEffcect} span={12} />
          <BasicLayout title={translate('web.resource.deal.baojiadanxinxi')} effect={quotationEffcect} span={12} />
          <OffterTable askPurchaseQuoteGoodsResponses={purchaseDetail.askPurchaseQuoteGoodsResponses} />
          <BasicLayout
            title={translate('web.resource.deal.qitabaojiashuoming')}
            effect={otherQuotationEffcect}
            span={12}
          />
          <Card
            id="conditionLayout"
            title={intl.formatMessage({
              id: 'transaction_components.fujian',
              defaultMessage: '附件',
            })}
          >
            <div>
              {purchaseDetail?.enclosureUrls?.map((item: any) => {
                return (
                  <Button type="link" onClick={() => downloadFileByNameAndUrl(item.url, item.name)}>
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </Card>
          {purchaseDetail?.innerRecords && (
            <CirculationTable
              title={intl.formatMessage({
                id: 'transaction_components.neibuliuzhuan',
                defaultMessage: '内部流转',
              })}
              tableMessage={purchaseDetail?.innerRecords}
            />
          )}
        </Space>
      </PageHeaderWrapper>
      <ModalAudit
        formref={ref}
        modalTypes={{
          title: translate('web.common.approved'),
          visible: visible,
          destroyOnClose: true,
          onOk: () => handleSubmit(),
          onCancel: () => setVisible(false),
          confirmLoading: confirmLoading,
        }}
      />
    </Context.Provider>
  )
}
export default DemandDetailed
