import React, { useEffect, useState } from 'react'
import { Card, Space, Table, Descriptions, Radio, Button, RadioGroup } from '@linkseeks/ui'
import {
  getTradeAskPurchasePriceComparisonInfo,
  GetTradeAskPurchasePriceComparisonInfoResponse,
  getTradeAskPurchaseQuoteRankList,
  GetTradeMobileAskPurchaseQuoteRankListResponse,
} from '@apps/apis'
import { ColumnsType } from 'antd/lib/table'
import rank1Icon from './icons/rank1.png'
import rank2Icon from './icons/rank2.png'
import rank3Icon from './icons/rank3.png'
import styles from './index.less'

interface IProps {
  id: string
  onSelectQuoteId: (quoteId: number) => void
  showAwardBid: boolean
  status: number
  selectQuoteId?: number
}

type PriceComparisonItemType = GetTradeAskPurchasePriceComparisonInfoResponse[0]['quoteGoodsPCRespList'][0]

const PriceComparisonInfo: React.FC<IProps> = (props) => {
  const { id, showAwardBid, selectQuoteId, status, onSelectQuoteId } = props
  const [priceComparisonList, setPriceComparisonList] = useState<GetTradeAskPurchasePriceComparisonInfoResponse>([])
  const [rankList, setRankList] = useState<GetTradeMobileAskPurchaseQuoteRankListResponse>([])
  const [columns, setColumns] = useState<ColumnsType<any>>([])

  const getIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return rank1Icon
      case 2:
        return rank2Icon
      case 3:
        return rank3Icon
      default:
        return rank3Icon
    }
  }

  const getObjByKey = (memberName: string, list: PriceComparisonItemType[]): PriceComparisonItemType | undefined => {
    return list.find((item) => item.memberName === memberName)
  }

  useEffect(() => {
    if (rankList && rankList.length > 0) {
      const columnsList: ColumnsType<any> = [
        {
          title: '采购物料',
          dataIndex: 'goods',
          width: 200,
          render: (_, record) => {
            return record.goodsNo ? (
              <Descriptions column={1}>
                <Descriptions.Item labelStyle={{ width: 80 }} label="物料编号">
                  {record.goodsNo}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="物料名称">
                  {record.goodsName}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="规格型号">
                  {record.specification}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="品类">
                  {record.categoryName}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="品牌">
                  {record.brandName}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              ''
            )
          },
        },
        {
          title: '采购数量',
          dataIndex: 'num',
          width: 120,
          render: (num, record) => (num ? `${num}（${record.unit}）` : ''),
        },
      ]
      for (const item of rankList) {
        columnsList.push({
          title: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img style={{ width: 16, height: 16, marginRight: 8 }} src={getIcon(item.rank)} />
              <span>{item.memberName}</span>
            </div>
          ),
          dataIndex: 'memberName',
          render: (_, record) => {
            return !record.bottom ? (
              <Descriptions column={1}>
                <Descriptions.Item labelStyle={{ width: 80 }} label="是否含税">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.includeTax === 1 ? '是' : '否'}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="税率">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.taxRate || 0}%
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="单价（含税）">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.unitPriceWithTax || 0}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="单价（不含税）">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.unitPriceWithoutTax || 0}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="含税总价">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.totalPriceWithTax || 0}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="不含税总价">
                  {getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.totalPriceWithoutTax || 0}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="报价有效期">
                  <div>
                    <div>{getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.quoteStartTime} -</div>
                    <div>{getObjByKey(item.memberName, record.quoteGoodsPCRespList)?.quoteEndTime}</div>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Descriptions column={1}>
                <Descriptions.Item labelStyle={{ width: 80 }} label="报价小计">
                  ￥{item.totalAmount}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="报价排名">
                  {item.rank}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ width: 80 }} label="授标">
                  {showAwardBid ? (
                    <Radio value={item.quoteId}>授标</Radio>
                  ) : item.awardBid ? (
                    <Button type="secondary">授标</Button>
                  ) : null}
                  <Radio value={0} style={{ visibility: 'hidden' }}></Radio>
                </Descriptions.Item>
              </Descriptions>
            )
          },
        })
      }
      setColumns(columnsList)
    }
  }, [rankList, showAwardBid, priceComparisonList])

  const fetchQuoteRankList = () => {
    getTradeAskPurchaseQuoteRankList({ id }).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setRankList(res.data)
        if (status === 6 || status === 7) {
          const awardBidQuoteId = res.data.find((item) => item.awardBid)?.quoteId
          if (awardBidQuoteId) {
            onSelectQuoteId(awardBidQuoteId)
          }
        }
      }
    })
  }

  /**
   * 查询比价信息
   */
  const fetchPriceComparisonInfo = () => {
    getTradeAskPurchasePriceComparisonInfo({ id }).then((res) => {
      if (res.code === 1000 && res.data.length > 0) {
        setPriceComparisonList(res.data.concat([{ bottom: true } as any]))
      }
    })
  }

  useEffect(() => {
    fetchPriceComparisonInfo()
    fetchQuoteRankList()
  }, [])

  return (
    <Card title="比价信息">
      <RadioGroup value={selectQuoteId} onChange={(e) => onSelectQuoteId(e.target.value)}>
        <Table
          className={styles['priceComparisonInfo-table']}
          columns={columns}
          pagination={false}
          dataSource={priceComparisonList}
        />
      </RadioGroup>
    </Card>
  )
}

export default PriceComparisonInfo
