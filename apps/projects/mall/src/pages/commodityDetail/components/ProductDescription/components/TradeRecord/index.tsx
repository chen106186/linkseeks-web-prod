import React, { useEffect, useState } from 'react'
import { Table, message } from 'antd'
import moment from 'moment'
import { getOrderCommonProductHistoryPage } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'
import { useGlobalConext } from '@/context/globalProvider'

interface TradeRecordPropsType {
  productId: number | undefined
  setCount: Function
  mallId?: number
}

const TradeRecord: React.FC<TradeRecordPropsType> = (props) => {
  const translate = getWebIntl()
  const { productId, setCount, mallId } = props
  const { userInfo } = useGlobalConext()
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [recordList, setRecordList] = useState<any[]>([])

  useEffect(() => {
    if (productId && userInfo) {
      fetchRecordsList()
    }
  }, [productId, current])

  const fetchRecordsList = () => {
    const param: any = {
      current,
      pageSize,
      shopId: mallId,
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
      title: translate('web.resource.mall.maijia'),
      width: '33%',
      render: (_: any, record: any) => (
        <div className={styles.columns_item}>
          <div className={styles.columns_item_name}>{record.buyerMemberName}</div>
          {record.levelTag && <div className={styles.columns_item_member}>{record.levelTag}</div>}
        </div>
      ),
    },
    {
      title: translate('web.resource.mall.chengjiaoshuliang'),
      dataIndex: 'quantity',
      width: '33%',
    },
    {
      title: translate('web.resource.mall.jiaoyishijian'),
      dataIndex: 'createTime',
      width: '33%',
      render: (tradingTime: moment.MomentInput) => moment(tradingTime).format('YYYY-MM-DD HH:mm'),
    },
  ]
  const handleChange = (pagination: any) => {
    const { current } = pagination
    setCurrent(current)
  }

  return (
    <div id="trade_record" className={styles.trade_record}>
      <div className={styles.trade_record_title}>{translate('web.resource.mall.jiaoyijilu')}</div>
      <div className={styles.trade_record_container}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recordList}
          locale={{ emptyText: translate('web.resource.mall.zanwujiaoyijilu') }}
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
