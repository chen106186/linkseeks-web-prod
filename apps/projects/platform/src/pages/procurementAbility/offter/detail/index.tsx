import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { formatTimeString } from '@/utils'
import { Tag, Badge, Button, Typography } from 'antd'
import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import ProgressLayout from '../../components/detail/components/progressLayout'
import BasicLayout from '../../components/detail/components/basicLayout'
import OtherLayout from '../../components/detail/components/otherLayout'
import BidInfoLayout from '../../components/detail/components/bidInfoLayout'
import RecordLyout from '../../components/detail/components/recordLyout'
import ModalOperate from '../../components/modalOperate'

import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../../constants'
import { CheckCircleOutlined, LinkOutlined } from '@ant-design/icons'
import BidLayout from '../../components/detail/components/bidLayout'
import BidResultLayout from '../../components/detail/components/bidResultLayout'
import { isEmpty } from 'lodash'
import {
  getPurchaseQuotedPriceDetails,
  getPurchaseQuotedPriceMaterielDetailed,
  getPurchaseQuotedPriceProductlistListContract,
  postPurchaseQuotedPriceExamine1,
  postPurchaseQuotedPriceExamine2,
} from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
const TABLINK1 = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'contrastLyout', title: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
  { id: 'otherLyout', title: intl.formatMessage({ id: 'detail.purchase.offerExplain' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const TABLINK2 = {
  0: [
    { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
    { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
    { id: 'bidLayout', title: intl.formatMessage({ id: 'detail.purchase.bidLayout' }) },
    { id: 'bidInfoLayout', title: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
    { id: 'otherLyout', title: intl.formatMessage({ id: 'detail.purchase.offerExplain' }) },
    { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
  ],
  1: [
    { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
    { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
    { id: 'bidLayout', title: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }) },
    { id: 'bidResultLayout', title: intl.formatMessage({ id: 'detail.purchase.bidLayout' }) },
    { id: 'bidInfoLayout', title: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
    { id: 'otherLyout', title: intl.formatMessage({ id: 'detail.purchase.offerExplain' }) },
    { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
  ],
}

const QuoteDetails = () => {
  const { id, number, turn, preview } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [otherEffect, setOtherEffect] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)

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
          {
            label: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
            extra: (
              <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState] || 'default'}>{data.externalStateName}</Tag>
            ),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
            extra: (
              <Badge
                status={OFFTER_INTERNALSTATE_COLOR[data.interiorState] || 'default'}
                text={data.interiorStateName}
              />
            ),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.purchaseInquiryNo' }), extra: data.purchaseInquiryNo },
          { label: intl.formatMessage({ id: 'table.purchase.member' }), extra: data.memberName },
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
    console.log(data)
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
          { label: intl.formatMessage({ id: 'detail.purchase.offerExplain' }), extra: data.otherRequire },
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
    await getPurchaseQuotedPriceDetails({ id, number, current: '1', pageSize: '1' })
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

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'auditOffterOne':
        fetchSoure = postPurchaseQuotedPriceExamine1
        break
      case 'auditOffterTwo':
        fetchSoure = postPurchaseQuotedPriceExamine2
        break
    }
    return fetchSoure
  }

  /** 获取报价信息当前点击的轮次 */
  const handleGetKey = (count: number) => {
    handleOtherCallBack(dataSource.quotedPriceTurnList, count)
  }

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.quotedPriceNo}
        detail={dataSource.quotedDetails}
        tabLink={
          pathPci === 'offter' && dataSource.externalState === 99 ? TABLINK2[dataSource.isPrize ? 1 : 0] : TABLINK1
        }
        effect={
          <>
            {path === 'detail' && !preview && (
              <Button onClick={() => setVisible(true)} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
              </Button>
            )}
          </>
        }
        components={
          <Fragment>
            <ProgressLayout />
            <BasicLayout effect={basicEffect} />
            {pathPci === 'offter' && dataSource.externalState === 99 && (
              <>
                <BidLayout />
                {dataSource.isPrize === 1 && <BidResultLayout fetch={getPurchaseQuotedPriceProductlistListContract} />}
              </>
            )}
            <BidInfoLayout getKey={handleGetKey} fetch={getPurchaseQuotedPriceMaterielDetailed} effect={{ turn, id }} />
            <OtherLayout effect={otherEffect} />
            <RecordLyout />
          </Fragment>
        }
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
        modalType="audit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
    </Context.Provider>
  )
}
export default QuoteDetails
