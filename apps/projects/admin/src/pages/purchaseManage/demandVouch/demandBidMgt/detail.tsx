import React, { useState, useEffect, Fragment } from 'react'
import { Tag, Tooltip } from 'antd'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { Context } from '../../purchaseAbility/components/detail/components/context'
import PeripheralLayout from '../../purchaseAbility/components/detail'
import ProgressLayout from '../../purchaseAbility/components/detail/components/progressLayout'
import BasicLayout from '../../purchaseAbility/components/detail/components/basicLayout'
import ConditionLayout from '../../purchaseAbility/components/detail/components/conditionLayout'
import ContrastLyout from '../../purchaseAbility/components/detail/components/contrastLyout1'
import RecordLyout from '../../purchaseAbility/components/detail/components/recordLyout'
import { OFFTER_EXTERNALSTATE_COLOR } from '../../purchaseAbility/constants'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { getPurchaseQuotedPricePlatformDetails } from '@apps/apis'

const ICONSTYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}

const TABLINK = [
  { id: 'progressLayout', title: '流转进度' },
  { id: 'basicLayout', title: '基本信息' },
  { id: 'conditionLayout', title: '交易条件' },
  { id: 'contrastLyout', title: '报价信息' },
  { id: 'recordLyout', title: '流转记录' },
]

const ContrastPrice = () => {
  const { id, turn, number } = useQuery()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [link] = useState<string>(pathname.split('/')[pathname.split('/').length - 1])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '需求单号', extra: data.purchaseInquiryNo },
          { label: '需求摘要', extra: data.details },
          {
            label: '外部状态',
            extra: <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState]}>{data.externalStateName}</Tag>,
          },
        ],
      },
      {
        col: [
          {
            label: (
              <Tooltip
                placement="top"
                title="有固定采购金额：采购金额固定，合同期内不可超过采购金额，无固定采购金额：采购金额不固定，可在合同期内按需采购"
              >
                采购类型
                <QuestionCircleOutlined style={ICONSTYLE} />
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
                <QuestionCircleOutlined style={ICONSTYLE} />
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
          { label: '单据时间', extra: formatTimeString(data.createTime) },
          {
            label: '适用地市',
            extra: (
              <div>
                {data.areas &&
                  data.areas.map((it: any, idx: number) => (
                    <p key={`areas${idx + 1}`}>{`${it.province}/${it.city}`}</p>
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
          { label: '报价截止时间', extra: data.offerEndTime && formatTimeString(data.offerEndTime) },
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

  const handleGetDataSource = async () => {
    const parmas: any = {
      id,
      number,
    }
    await getPurchaseQuotedPricePlatformDetails({ ...parmas }).then((res) => {
      if (res.code === 1000) {
        const { data } = res
        setDataSource(data)
        handleBasicEffect(data)
        handleConditionEffect(data)
      }
    })
  }

  useEffect(() => {
    handleGetDataSource()
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
            <ConditionLayout effect={conditionEffect} />
            {dataSource.purchaseInquiryId && (
              <ContrastLyout preview query={{ id: dataSource.purchaseInquiryId, turn }} />
            )}
            <RecordLyout />
          </Fragment>
        }
      />
    </Context.Provider>
  )
}
export default ContrastPrice
