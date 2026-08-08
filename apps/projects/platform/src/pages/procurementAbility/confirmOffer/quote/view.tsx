import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { Tag, Typography } from 'antd'
import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import BasicLayout from '../../components/detail/components/basicLayout'
import OtherLayout from '../../components/detail/components/otherLayout'
import BidInfoLayout from '../../components/detail/components/bidInfoLayout'

import { OFFTER_EXTERNALSTATE_COLOR } from '../../constants'
import { LinkOutlined } from '@ant-design/icons'
import { getPurchaseConfirmQuotedPriceMaterielDetailed, getPurchaseConfirmQuotedPriceOrderDetails } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'
import { downloadFileByNameAndUrl } from '@apps/utils'

const intl = getIntl()
const TABLINK = [
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'contrastLyout', title: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
  { id: 'otherLyout', title: intl.formatMessage({ id: 'detail.purchase.otherRequire' }) },
]

const QuoteDetails = () => {
  const { id, number, turn } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [otherEffect, setOtherEffect] = useState<any>([])

  const forEachQuotedPriceTurnList = (data: any, key: number) => {
    let params: any = {}
    data.forEach((item) => {
      if (Number(item.turn) === Number(key)) {
        params = { ...item }
      }
    })
    return params
  }

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.quotedPriceNo' }), extra: data.quotedPriceNo },
          { label: intl.formatMessage({ id: 'detail.purchase.quotedDetails1' }), extra: data.quotedDetails },
          { label: intl.formatMessage({ id: 'detail.purchase.quotedMenber' }), extra: data.createMemberName },
          {
            label: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
            extra: (
              <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState] || 'default'}>{data.externalStateName}</Tag>
            ),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.purchaseInquiryNo' }), extra: data.purchaseInquiryNo },
          { label: intl.formatMessage({ id: 'detail.purchase.contacts' }), extra: data.contacts },
          { label: intl.formatMessage({ id: 'detail.purchase.telPhone' }), extra: data.tel },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
            extra: formatTimeString(data.offerEndTime),
          },
          {
            label: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
            extra: formatTimeString(data.createTime),
          },
        ],
      },
    ])
  }

  const handleOtherEffect = (data: any) => {
    setOtherEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.deliveryDetails' }), extra: data.deliveryDetails },
          { label: intl.formatMessage({ id: 'detail.purchase.payDetails' }), extra: data.payDetails },
          { label: intl.formatMessage({ id: 'detail.purchase.taxes' }), extra: data.taxes },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.logistics' }), extra: data.logistics },
          { label: intl.formatMessage({ id: 'detail.purchase.packRequire' }), extra: data.packRequire },
          { label: intl.formatMessage({ id: 'detail.purchase.otherRequire' }), extra: data.otherRequire },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.file' }),
            extra: (
              <>
                {data.enclosureUrls &&
                  data.enclosureUrls.map((item: any, index: number) => (
                    <Typography.Link
                      style={{ display: 'block', paddingBottom: '8px' }}
                      key={`link_${index + 1}`}
                      onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                    >
                      <LinkOutlined style={{ marginRight: '5px' }} />
                      {item.name}
                    </Typography.Link>
                  ))}
              </>
            ),
          },
        ],
      },
    ])
  }

  const handleOtherCallBack = useCallback((data: any, key: number) => {
    handleOtherEffect(forEachQuotedPriceTurnList(data, key))
  }, [])

  const fetchDataSource = useCallback(async () => {
    await getPurchaseConfirmQuotedPriceOrderDetails({ id, number, current: '1', pageSize: '1' })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
        setDataSource(data)
        handleBasicEffect(data)
        handleOtherCallBack(data.quotedPriceTurnList, turn)
      })
      .catch((error) => {
        console.warn(error)
      })
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  /** 获取报价信息当前点击的轮次 */
  const handleGetKey = (count: number) => {
    handleOtherCallBack(dataSource.quotedPriceTurnList, count)
  }

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.quotedPriceNo}
        detail={dataSource.quotedDetails}
        tabLink={TABLINK}
        components={
          <Fragment>
            <BasicLayout effect={basicEffect} />
            <BidInfoLayout
              getKey={handleGetKey}
              fetch={getPurchaseConfirmQuotedPriceMaterielDetailed}
              effect={{ turn, id }}
            />
            <OtherLayout effect={otherEffect} />
          </Fragment>
        }
      />
    </Context.Provider>
  )
}
export default QuoteDetails
