import React, { Fragment, useEffect, useState } from 'react'
import { Tag, Tooltip } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { GlobalConfig } from '@/global/config'
import { Context } from '../../../purchaseAbility/components/detail/components/context'
import PeripheralLayout from '../../../purchaseAbility/components/detail'
import ProgressLayout from '../../../purchaseAbility/components/detail/components/progressLayout'
import BasicLayout from '../../../purchaseAbility/components/detail/components/basicLayout'
import ConditionLayout from '../../../purchaseAbility/components/detail/components/conditionLayout'
import RecordLyout from '../../../purchaseAbility/components/detail/components/recordLyout'
import { formatTimeString } from '@/utils'

import { OFFTER_EXTERNALSTATE_COLOR } from '../../../purchaseAbility/constants'
import { QuestionCircleOutlined } from '@ant-design/icons'
import MaterialLayout from '../../../purchaseAbility/components/detail/components/materialLayout'
import DemandLayout from '../../../purchaseAbility/components/detail/components/demandLayout'
import {
  getPurchaseQuotedPriceProductlistList,
  getPurchaseQuotedPricePurchaseInquiryDetails,
  getCommodityShopListShopByReq,
} from '@apps/apis'

const ICON_STYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}

const TABLINK = [
  { id: 'progressLayout', title: '流转进度' },
  { id: 'basicLayout', title: '基本流程' },
  { id: 'materialLayout', title: '采购物料' },
  { id: 'conditionLayout', title: '交易条件' },
  { id: 'demandLayout', title: '需求对接' },
  { id: 'recordLyout', title: '流转记录' },
]

const DemandDetailed = () => {
  const { id, number } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [storeList, setStoreList] = useState<any[]>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '需求单号', extra: data.purchaseInquiryNo },
          {
            label: '外部状态',
            extra: <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState]}>{data.externalStateName}</Tag>,
          },
          // { label: '内部状态', extra: <Badge status={OFFTER_INTERNALSTATE_COLOR[data.interiorState]} text={OFFTER_INTERNALSTATE[data.interiorState]} /> },
          { label: '单据时间', extra: formatTimeString(data.createTime) },
        ],
      },
      {
        col: [
          { label: '需求摘要', extra: data.details },
          {
            label: (
              <Tooltip
                placement="top"
                title="有固定采购金额：采购金额固定，合同期内不可超过采购金额，无固定采购金额：采购金额不固定，可在合同期内按需采购"
              >
                采购类型
                <QuestionCircleOutlined style={ICON_STYLE} />
              </Tooltip>
            ),
            extra: data.purchaseType === 1 ? '有固定采购金额' : '无固定采购金额',
            colon: true,
          },
          {
            label: (
              <Tooltip
                placement="top"
                title="密封比价：只能看到供应商是否有报价，不能看到供应商的报价明细，只能解封后才能看到报价明细，非密封比价：可以在供应商报完价后立即看到报价明细，无须解封"
              >
                比价方式
                <QuestionCircleOutlined style={ICON_STYLE} />
              </Tooltip>
            ),
            extra: data.priceContrast === 1 ? '密封比价' : '非密封比价',
            colon: true,
          },
          { label: '会员名称', extra: data.createMemberName },
        ],
      },
      {
        col: [
          {
            label: '适用地市',
            extra: (
              <div>
                {data.areas &&
                  data.areas.map((item: any, index: number) => (
                    <p key={`areas${index + 1}`}>{`${item.province}/${item.city}`}</p>
                  ))}
              </div>
            ),
          },
        ],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          { label: '交付日期', extra: data.deliveryTime && formatTimeString(data.deliveryTime) },
          { label: '交付地址', extra: data.address },
          { label: '截止日期', extra: data.offerEndTime && formatTimeString(data.offerEndTime) },
        ],
      },
      {
        col: [
          { label: '报价要求', extra: data.offer },
          { label: '付款方式', extra: data.paymentType },
          { label: '税费要求', extra: data.taxes },
        ],
      },
      {
        col: [
          { label: '物流要求', extra: data.logistics },
          { label: '包装要求', extra: data.packRequire },
          { label: '其他要求', extra: data.otherRequire },
        ],
      },
    ])
  }

  const fetchShopList = (): Promise<any[]> => {
    return new Promise((resolve) => {
      getCommodityShopListShopByReq({ type: '2' })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  const fetchDataSource = async () => {
    const shopList = await fetchShopList()
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    await getPurchaseQuotedPricePurchaseInquiryDetails({ ...params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      if (data.shopIds) {
        const ids = data.shopIds
        const filterStore = shopList.filter((item) => ids.indexOf(item.id) !== -1)
        setStoreList([...filterStore])
      }
      setDataSource(data)
      handleBasicEffect(data)
      handleConditionEffect(data)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.purchaseInquiryNo}
        tabLink={TABLINK}
        components={
          <Fragment>
            <ProgressLayout />
            <BasicLayout effect={basicEffect} />
            <MaterialLayout id={id} number={number} fetch={getPurchaseQuotedPriceProductlistList} />
            <ConditionLayout effect={conditionEffect} />
            <DemandLayout storeList={storeList} />
            <RecordLyout />
          </Fragment>
        }
      />
    </Context.Provider>
  )
}
export default DemandDetailed
