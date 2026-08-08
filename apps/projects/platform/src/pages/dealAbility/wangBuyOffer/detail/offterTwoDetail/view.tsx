import React, { Fragment, useEffect, useState } from 'react'
import { Tag, Badge, Tooltip, Typography, Card, Button } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/components/DetailLayout/components/context'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import PeripheralLayout from '@/components/DetailLayout'
import moment from 'moment'
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { getTradeAskPurchaseAskPurchaseQuoteDetail, getTradeAskPurchaseQuoteDetail } from '@apps/apis'
import {
  innerStatusList,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE_COLOR,
  statusList,
} from '../../../wangBuy/constats'
import OffterTable from '../../../wangBuy/offer/components/offterTable'
import Supplier from '../../../wangBuy/offer/components/supplier'
import AuditProcess from '@/components/AuditProcess'
import isEmpty from 'lodash/isEmpty'
import { useAuth } from '@apps/services'
// import OffterTable from '../components/offterTable'
// import Supplier from '../components/supplier'

const ICON_STYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}
const intl = getIntl()
const TABLINK = []

const DemandDetailed = () => {
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const { id, number } = useQuery()
  const { getAuth } = useAuth()
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [purchaseDetail, setPurchaseDetail] = useState<any>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.xuqiudanhao',
              defaultMessage: '需求单号',
            }),
            extra: data.quoteNo,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.waibuzhuangtai',
              defaultMessage: '外部状态',
            }),
            extra: data.status && intl.formatMessage({ id: statusList[data.status] }),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.neibuzhuangtai',
              defaultMessage: '内部状态',
            }),
            extra: data.status && intl.formatMessage({ id: innerStatusList[data.status] }),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiadanzhaiyao',
              defaultMessage: '报价单摘要',
            }),
            extra: data.name,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.duiyingxuqiudanhao',
              defaultMessage: '对应需求单号',
            }),
            extra: data.askPurchaseNo,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.gongyingshangmingcheng',
              defaultMessage: '供应商名称',
            }),
            extra: data.memberName,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.lianxirenxingming',
              defaultMessage: '联系人姓名',
            }),
            extra: data.contactName,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.lianxirendianhua',
              defaultMessage: '联系人电话',
            }),
            extra: data.contactMobile,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.bizhong',
              defaultMessage: '币种',
            }),
            extra: data.currencyName,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiajiezhishijian',
              defaultMessage: '报价截止时间',
            }),
            extra: format(data.createTime),
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
          handleBasicEffect(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  return (
    <Context.Provider value={purchaseDetail}>
      <PeripheralLayout
        no={purchaseDetail.quoteNo}
        tabLink={TABLINK}
        components={
          <>
            {purchaseDetail.simpleProcessDefVO && (
              <AuditProcess
                id="auditProcess"
                customTitleKey="taskName"
                customKey="taskStep"
                // initRadioValue={!isEmpty(purchaseDetail.innerRecords) ? 'inner' : 'outer'}
                initRadioValue={'inner'}
                innerVerifyCurrent={Number(purchaseDetail.simpleProcessDefVO?.currentStep) - 1}
                innerVerifySteps={purchaseDetail.simpleProcessDefVO?.tasks}
              />
            )}
            <BasicLayout effect={basicEffect} />
            <OffterTable askPurchaseQuoteGoodsResponses={purchaseDetail.askPurchaseQuoteGoodsResponses} />
            <Supplier purchaseDetail={purchaseDetail} />
            <Card
              id="conditionLayout"
              title={intl.formatMessage({
                id: 'transaction_components.fujian',
                defaultMessage: '附件',
              })}
            >
              <div>
                {purchaseDetail?.enclosureUrls?.map((item: any) => {
                  return <Button type="link">{item.name}</Button>
                })}
              </div>
            </Card>
          </>
        }
      />
    </Context.Provider>
  )
}
export default DemandDetailed
