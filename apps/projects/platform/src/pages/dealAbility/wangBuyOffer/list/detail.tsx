import React, { Fragment, useEffect, useState } from 'react'
import { Button, Space } from 'antd'
import { Card } from '@linkseeks/ui'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/components/DetailLayout/components/context'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import moment from 'moment'
import { getTradeAskPurchaseQuoteAskPurchaseDetail } from '@apps/apis'
import { sourcingStatusList } from '../../wangBuy/constats'
import Material from '../components/material'
import TradingConditions from '../components/tradingConditions'
import CirculationTable from '../../wangBuy/list/components/circulation'
import { downloadFileByNameAndUrl } from '@apps/utils'
import { PageHeaderWrapper } from '@apps/components'

const intl = getIntl()

const DemandDetailed = () => {
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const { id, number } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.xuqiudanhao',
              defaultMessage: '需求单号',
            }),
            extra: data.askPurchaseNo,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.waibuzhuangtai',
              defaultMessage: '外部状态',
            }),
            extra: data.status && intl.formatMessage({ id: sourcingStatusList[data.status] }),
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.caigoushangmingcheng',
              defaultMessage: '采购商名称',
            }),
            extra: data.contactName,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.xuqiudanzhaiyao',
              defaultMessage: '需求单摘要',
            }),
            extra: data.name,
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
      getTradeAskPurchaseQuoteAskPurchaseDetail({ askPurchaseId: id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          handleBasicEffect(res.data)
          setDataSource(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper title={`${dataSource.name} | ${dataSource.askPurchaseNo}`}>
        <Space style={{ width: '100%', display: 'flex' }} direction="vertical" size={16}>
          <BasicLayout effect={basicEffect} span={12} />
          <Material askPurchaseGoodsResponses={dataSource.askPurchaseGoodsResponses} />
          <TradingConditions dataSource={dataSource} />
          <Card
            id="conditionLayout"
            title={intl.formatMessage({
              id: 'transaction_components.fujian',
              defaultMessage: '附件',
            })}
          >
            <div>
              {dataSource?.enclosureUrls?.map((item: any) => {
                return (
                  <Button type="link" onClick={() => downloadFileByNameAndUrl(item.url, item.name)}>
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </Card>
          {dataSource?.outerRecords && (
            <CirculationTable
              title={intl.formatMessage({
                id: 'transaction_components.waibuliuzhuan',
                defaultMessage: '外部流转',
              })}
              tableMessage={dataSource?.outerRecords}
            />
          )}
        </Space>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}
export default DemandDetailed
