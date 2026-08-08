import React, { useEffect, useState } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import PeripheralLayout from '@/components/DetailLayout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import { Context } from '@/components/DetailLayout/components/context'
import { getTradeAskPurchaseDetail, postTradeAskPurchasePageQuote } from '@apps/apis'
import { innerStatusList } from '../../constats'
import BasiceTable from '../components/basiceTable'

const intl = getIntl()

const DemandDetailed: React.FC = () => {
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const { id } = useQuery()
  const [dataSource, setDataSource] = useState<any>({})
  const [askPurchaseQuoteGoodsResponses, setAskPurchaseQuoteGoodsResponses] = useState<any>([])
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
            label: '需求单状态',
            extra: data.status && innerStatusList[data.status],
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
      getTradeAskPurchaseDetail({ id: id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setDataSource(res.data)
          handleBasicEffect(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })

      postTradeAskPurchasePageQuote({ askPurchaseId: id, innerStatusList: [5, 8, 9] as any }, { ctlType: 'none' })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setAskPurchaseQuoteGoodsResponses(res.data.data || [])
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])
  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.askPurchaseNo}
        tabLink={[]}
        components={
          <>
            <BasicLayout effect={basicEffect} />
            <BasiceTable askPurchaseQuoteGoodsResponses={askPurchaseQuoteGoodsResponses} />
          </>
        }
      />
    </Context.Provider>
  )
}
export default DemandDetailed
