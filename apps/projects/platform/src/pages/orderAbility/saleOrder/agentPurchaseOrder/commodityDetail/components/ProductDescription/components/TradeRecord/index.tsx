import React, { useEffect, useState } from 'react'
import { Table, message } from 'antd'
import { formatTimeString } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import { getOrderCommonProductHistoryPage } from '@apps/apis'
import styles from './index.less'
interface TradeRecordPropsType {
  productId: number | undefined
  setCount: Function
  storeId: number
}

const TradeRecord: React.FC<TradeRecordPropsType> = (props) => {
  const { productId, setCount, storeId } = props
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [recordList, setRecordList] = useState<any[]>([])
  const intl = useIntl()

  useEffect(() => {
    if (productId) {
      fetchRecordsList()
    }
  }, [productId, current])

  const fetchRecordsList = () => {
    const param: any = {
      current,
      pageSize,
      shopId: storeId,
      productId: productId,
    }
    getOrderCommonProductHistoryPage(param)
      .then((res: any) => {
        message.destroy()
        if (res.code === 1000) {
          setTotalCount(res.data.totalCount)
          initData(res.data.data)
          setCount(res.data.totalCount)
        }
      })
      .catch(() => {
        message.destroy()
      })
  }

  const initData = (data: any) => {
    if (!data) {
      return
    }
    const result = data.map((item: { id: any }, index: number) => {
      item.id = current * 10 + index
      return item
    })
    setRecordList(result)
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'TradeRecord.index.Buyers' }),
      width: '33%',
      render: (_: any, record: any) => (
        <div className={styles.columns_item}>
          <div className={styles.columns_item_name}>{record.buyerMemberName}</div>
          {record.levelTag && <div className={styles.columns_item_member}>{record.levelTag}</div>}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'TradeRecord.index.NumberTransactions' }),
      dataIndex: 'quantity',
      width: '33%',
    },
    {
      title: intl.formatMessage({ id: 'TradeRecord.index.TradingTime' }),
      dataIndex: 'createTime',
      width: '33%',
      render: (tradingTime: moment.MomentInput) => formatTimeString(tradingTime, 'YYYY-MM-DD HH:mm'),
    },
  ]
  const handleChange = (pagination: any) => {
    const { current } = pagination
    setCurrent(current)
  }

  return (
    <div id="trade_record" className={styles.trade_record}>
      <div className={styles.trade_record_title}>
        {intl.formatMessage({ id: 'Interested.index.TransactionRecord' })}
      </div>
      <div className={styles.trade_record_container}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recordList}
          locale={{ emptyText: intl.formatMessage({ id: 'TradeRecord.index.NoTransactionRecord' }) }}
          onChange={handleChange}
          pagination={{
            current: current,
            pageSize: pageSize,
            total: totalCount,
            showQuickJumper: true,
          }}
        />
      </div>
    </div>
  )
}

export default TradeRecord
