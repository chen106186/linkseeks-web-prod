import React, { Fragment, useEffect, useState } from 'react'
import { Tag, Badge, Tooltip, Typography, Input } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/components/DetailLayout/components/context'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import PeripheralLayout from '@/components/DetailLayout'
import moment from 'moment'
import { OFFTER_EXTERNALSTATE_COLOR, OFFTER_INTERNALSTATE_COLOR } from '../../../wangBuy/constats'
import OffterTable from '../../../wangBuy/offer/components/offterTable'
import Supplier from '../../../wangBuy/offer/components/supplier'

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
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [areas, setAreas] = useState<any>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiadanhao',
              defaultMessage: '报价单号',
            }),
            extra: data.purchaseInquiryNo,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.waibuzhuangtai',
              defaultMessage: '外部状态',
            }),
            extra: (
              <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState] || 'default'}>{data.externalStateName}</Tag>
            ),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.neibuzhuangtai',
              defaultMessage: '内部状态',
            }),
            extra: (
              <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState] || 'default'}>{data.externalStateName}</Tag>
            ),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiadanzhaiyao',
              defaultMessage: '报价单摘要',
            }),
            extra: (
              <Input maxLength={30} placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })} />
            ),
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
            extra: (
              <Badge
                status={OFFTER_INTERNALSTATE_COLOR[data.interiorState] || 'default'}
                text={data.interiorStateName}
              />
            ),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.gongyingshangmingcheng',
              defaultMessage: '供应商名称',
            }),
            extra: format(data.createTime),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.lianxirenxingming',
              defaultMessage: '联系人姓名',
            }),
            extra: format(data.createTime),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.lianxirendianhua',
              defaultMessage: '联系人电话',
            }),
            extra: format(data.createTime),
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
            extra: (
              <Badge
                status={OFFTER_INTERNALSTATE_COLOR[data.interiorState] || 'default'}
                text={data.interiorStateName}
              />
            ),
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
            extra: format(data.createTime),
          },
        ],
      },
    ])
  }

  useEffect(() => {
    // fetchDataSource()
    handleBasicEffect({})
  }, [])

  // 废弃组件，不应该使用该页面，后续可进行删除
  return (
    <Context.Provider value={dataSource}>
      {/* <PeripheralLayout
        no={dataSource.purchaseInquiryNo}
        tabLink={TABLINK}
        components={
          <>
            <BasicLayout effect={basicEffect} />
            <OffterTable />
            <Supplier />
          </>
        }
      /> */}
    </Context.Provider>
  )
}
export default DemandDetailed
