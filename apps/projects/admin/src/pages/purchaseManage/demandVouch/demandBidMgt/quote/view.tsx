import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { Tag, Typography } from 'antd'
import { Context } from '../../../purchaseAbility/components/detail/components/context'
import PeripheralLayout from '../../../purchaseAbility/components/detail'
import BasicLayout from '../../../purchaseAbility/components/detail/components/basicLayout'
import OtherLayout from '../../../purchaseAbility/components/detail/components/otherLayout'
import BidInfoLayout from '../../../purchaseAbility/components/detail/components/bidInfoLayout'

import { OFFTER_EXTERNALSTATE_COLOR } from '../../../purchaseAbility/constants'
import { LinkOutlined } from '@ant-design/icons'
import { getPurchaseConfirmQuotedPriceMaterielDetailed, getPurchaseQuotedPricePlatformDetails } from '@apps/apis'
import { downloadFileByNameAndUrl } from '@apps/utils'

const TABLINK = [
  { id: 'basicLayout', title: '基本信息' },
  { id: 'contrastLyout', title: '报价信息' },
  { id: 'otherLyout', title: '其他说明' },
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
          { label: '报价单号', extra: data.quotedPriceNo },
          { label: '报价摘要', extra: data.quotedDetails },
          { label: '报价会员', extra: data.createMemberName },
          {
            label: '外部状态',
            extra: <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState]}>{data.externalStateName}</Tag>,
          },
        ],
      },
      {
        col: [
          { label: '对应需求单号', extra: data.purchaseInquiryNo },
          { label: '联系人姓名', extra: data.contacts },
          { label: '联系人手机', extra: data.tel },
        ],
      },
      {
        col: [
          { label: '报价截止时间', extra: formatTimeString(data.offerEndTime) },
          { label: '单据时间', extra: formatTimeString(data.createTime) },
        ],
      },
    ])
  }

  const handleOtherEffect = (data: any) => {
    setOtherEffect([
      {
        col: [
          { label: '交付说明', extra: data.deliveryDetails },
          { label: '付款说明', extra: data.payDetails },
          { label: '税费说明', extra: data.taxes },
        ],
      },
      {
        col: [
          { label: '物流说明', extra: data.logistics },
          { label: '包装说明', extra: data.packRequire },
          { label: '其他说明', extra: data.otherRequire },
        ],
      },
      {
        col: [
          {
            label: '附件',
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
    await getPurchaseQuotedPricePlatformDetails({ id, number, current: '1', pageSize: '1' }).then((res: any) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      setDataSource(data)
      handleBasicEffect(data)
      handleOtherCallBack(data.quotedPriceTurnList || [], turn)
    })
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  /** 获取报价信息当前点击的轮次 */
  const handleGetKey = (count: number) => {
    handleOtherCallBack(dataSource.quotedPriceTurnList || [], count)
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
