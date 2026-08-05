import React, { Fragment, useEffect, useState } from 'react'
import { Tag, Badge, Tooltip, Typography } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { GlobalConfig } from '@/global/config'
import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import ProgressLayout from '../../components/detail/components/progressLayout'
import BasicLayout from '../../components/detail/components/basicLayout'
import ConditionLayout from '../../components/detail/components/conditionLayout'
import RecordLyout from '../../components/detail/components/recordLyout'
import { formatTimeString } from '@/utils'

import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../../constants'
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import MaterialLayout from '../../components/detail/components/materialLayout'
import DemandLayout from '../../components/detail/components/demandLayout'
import {
  getCommodityShopListShopByReq,
  getPurchasePurchaseInquiryDetails,
  getPurchasePurchaseInquiryProductlistList,
} from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'
import { downloadFileByNameAndUrl } from '@apps/utils'

const ICON_STYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}
const intl = getIntl()
const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout1' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'conditionLayout', title: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) },
  { id: 'demandLayout', title: intl.formatMessage({ id: 'detail.purchase.demandLayout' }) },
  { id: 'recordLyout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const DemandDetailed = () => {
  const { id, number } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [areas, setAreas] = useState<any>([])
  const [storeList, setStoreList] = useState<Array<any>>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'table.purchase.dementNo' }), extra: data.purchaseInquiryNo },
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
          {
            label: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
            extra: formatTimeString(data.createTime),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'table.purchase.details' }), extra: data.details },
          {
            label: (
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips' })}>
                {intl.formatMessage({ id: 'table.purchase.purchaseType' })}:
                <QuestionCircleOutlined style={ICON_STYLE} />
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
                {intl.formatMessage({ id: 'detail.purchase.priceMethod' })}:
                <QuestionCircleOutlined style={ICON_STYLE} />
              </Tooltip>
            ),
            extra:
              data.priceContrast === 1
                ? intl.formatMessage({ id: 'detail.purchase.priceContrast1' })
                : intl.formatMessage({ id: 'detail.purchase.priceContrast2' }),
            colon: true,
          },
          { label: intl.formatMessage({ id: 'detail.purchase.memberName' }), extra: data.createMemberName },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.areas' }),
            extra: (
              <div>
                {data.areas.map((it: any, idx: number) => (
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
            label: intl.formatMessage({ id: 'detail.purchase.offerEndTime' }),
            extra: formatTimeString(data.offerEndTime),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.file' }),
            extra: (
              <>
                {data.transactionUurls &&
                  data.transactionUurls.map((item: any, index: number) => (
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
    let shopList = await fetchShopList()
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    await getPurchasePurchaseInquiryDetails({ ...params })
      .then((res) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        const { data } = res
        const areas: string[] = []
        if (data.areas) {
          data.areas.forEach((item) => {
            areas.push(`${item.province}/${item.city}`)
          })
          setAreas(areas)
        }
        if (data.shopIds) {
          const ids = data.shopIds
          const filterStore = shopList.filter((item) => ids.indexOf(item.id) !== -1)
          setStoreList([...filterStore])
        }
        setDataSource(data)
        handleBasicEffect(data)
        handleConditionEffect(data)
      })
      .catch((error) => {
        console.warn(error)
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
            <MaterialLayout id={id} number={number} fetch={getPurchasePurchaseInquiryProductlistList} />
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
