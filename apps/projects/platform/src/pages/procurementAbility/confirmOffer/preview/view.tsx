import React, { useState, useEffect, Fragment } from 'react'
import { Tag, Badge, Tooltip } from 'antd'
import { Context } from '../../components/detail/components/context'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import PeripheralLayout from '../../components/detail'
import ProgressLayout from '../../components/detail/components/progressLayout'
import BasicLayout from '../../components/detail/components/basicLayout'
import ConditionLayout from '../../components/detail/components/conditionLayout'
import ContrastLyout from '../../components/detail/components/contrastLyout'
import RecordLyout from '../../components/detail/components/recordLyout'
import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../../constants'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { getPurchaseConfirmQuotedPriceDetails } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'

const ICONSTYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}
const intl = getIntl()
const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'conditionLayout', title: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) },
  { id: 'contrastLyout', title: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const ContrastPreview = () => {
  const { id, turn } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'table.purchase.dementNo' }), extra: data.purchaseInquiryNo },
          { label: intl.formatMessage({ id: 'table.purchase.details' }), extra: data.details },
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
          {
            label: (
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips' })}>
                {intl.formatMessage({ id: 'table.purchase.purchaseType' })}:<QuestionCircleOutlined style={ICONSTYLE} />
              </Tooltip>
            ),
            extra:
              data.purchaseType === 1
                ? intl.formatMessage({ id: 'detail.purchase.purchaseType1' })
                : intl.formatMessage({ id: 'detail.purchase.purchaseType2' }),
            colon: true,
          },
          {
            label: (
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips1' })}>
                {intl.formatMessage({ id: 'detail.purchase.priceMethod' })}:<QuestionCircleOutlined style={ICONSTYLE} />
              </Tooltip>
            ),
            extra:
              data.priceContrast === 1
                ? intl.formatMessage({ id: 'detail.purchase.priceContrast1' })
                : intl.formatMessage({ id: 'detail.purchase.priceContrast2' }),
            colon: true,
          },
          { label: intl.formatMessage({ id: 'detail.purchase.memberName' }), extra: data.memberName },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
            extra: formatTimeString(data.createTime),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.areas' }),
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
          {
            label: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
            extra: formatTimeString(data.deliveryTime),
          },
          { label: intl.formatMessage({ id: 'detail.purchase.address' }), extra: data.address },
          {
            label: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
            extra: formatTimeString(data.offerEndTime),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.offerAsk' }), extra: data.offer },
          { label: intl.formatMessage({ id: 'detail.purchase.paymentType' }), extra: data.paymentType },
          { label: intl.formatMessage({ id: 'detail.purchase.taxesAsk' }), extra: data.taxes },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.logisticsAsk' }), extra: data.logistics },
          { label: intl.formatMessage({ id: 'detail.purchase.packRequireAsk' }), extra: data.packRequire },
          { label: intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' }), extra: data.otherRequire },
        ],
      },
    ])
  }

  const handleGetDataSource = async (trunId: string) => {
    const parmas = {
      id,
      turn: trunId,
    }
    await getPurchaseConfirmQuotedPriceDetails({ ...parmas })
      .then((res) => {
        if (res.code === 1000) {
          const { data } = res
          setDataSource(data)
          handleBasicEffect(data)
          handleConditionEffect(data)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    handleGetDataSource(turn)
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
            <ContrastLyout preview={true} effect={{ id, turn }} />
            <RecordLyout />
          </Fragment>
        }
      />
    </Context.Provider>
  )
}
export default ContrastPreview
