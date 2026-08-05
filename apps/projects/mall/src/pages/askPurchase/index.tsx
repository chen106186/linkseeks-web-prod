import React, { useState, useEffect } from 'react'
import { Pagination, Empty, Spin } from 'antd'
import FilterBar from '@/components/FilterBar'
import { postTradeAskPurchasePageByShopId } from '@apps/apis'
import useFilterParams from '@/hooks/useFilterParams'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { useLocation, useParams } from 'react-router-dom'
import { getQueryString } from '@/utils/getUrlParam'
import HelmetProvider from '@/context/helmetProvider'
import OfferCard from './components/OfferCard'
import FilterTop from './components/FilterTop'
import styles from './index.module.less'

const AskPurchase: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [purchaseList, setPurchaseList] = useState<any>([])
  const [totalCount, setTotalCount] = useState(0)
  const [current, setCurrent] = useState('1')
  const [pageSize, setPageSize] = useState('10')
  const [loading, setLoading] = useState(true)
  const translate = getWebIntl()
  const { search } = useLocation()

  const fnGetPurchaseList = () => {
    const overdue = getQueryString('Unexpired', search) || ''
    const Reputation = getQueryString('Reputation', search) || ''
    const keyword = getQueryString('keyword', search) || ''

    const data: any = {
      current: current,
      pageSize: pageSize,
      shopId: mallInfo?.id,

      status: overdue ? 2 : null,
      order: Reputation == '3' ? 'ASC' : Reputation == '4' ? 'DESC' : null,
      keyword: decodeURIComponent(keyword),
    }
    setLoading(true)

    postTradeAskPurchasePageByShopId(data, { ctlType: 'none' }).then((res: any) => {
      if (res.data.data) {
        setPurchaseList(res.data.data.filter((item) => item.status !== 12))
      } else {
        setPurchaseList([])
      }
      setTotalCount(res.data.totalCount)
      setLoading(false)
    })
  }

  const fnChangeOagin = (cur: any, size: any) => {
    setCurrent(cur)
    setPageSize(size)
  }

  /**
   *
   * @param changeType 修改类型 add || down
   * 修改页码
   */
  const fnChangePage = (changeType: string) => {
    let newNumber
    if (changeType === 'add') {
      newNumber = Number(current) + 1
    } else if (changeType === 'down') {
      newNumber = Number(current) - 1
    }
    setCurrent(newNumber + '')
  }

  useEffect(() => {
    fnGetPurchaseList()
  }, [current, pageSize, search])

  return (
    <HelmetProvider title={`${translate('web.resource.mall.nav-askPurchase')}-${mallInfo?.name}`}>
      <div className={styles.purchaseInquiry}>
        <div className={styles.mall_container}>
          <Spin spinning={loading}>
            <div className={styles.purchaseInquiry_container}>
              <div className={styles.purchaseInquiry_main}>
                <FilterTop
                  totalPage={Math.ceil(totalCount / Number(pageSize))}
                  newPage={Number(current)}
                  totalCount={totalCount}
                  fnChangePage={fnChangePage}
                />
                <ul className={styles['card-warp']} style={{ marginTop: '12px' }}>
                  {purchaseList.map((item: any) => {
                    return (
                      <li key={item.id} className={styles['card-item']}>
                        <OfferCard data={item}></OfferCard>
                      </li>
                    )
                  })}
                  {!loading && purchaseList.length === 0 && (
                    <li style={{ paddingTop: '100px', margin: '0 auto' }}>
                      <Empty description={<div>{translate('web.common.zanwushuju')}</div>} />
                    </li>
                  )}
                </ul>
                <div className={styles['pagination-warp']}>
                  <Pagination
                    total={totalCount}
                    showSizeChanger={false}
                    showQuickJumper
                    pageSize={Number(pageSize)}
                    current={Number(current)}
                    hideOnSinglePage={true}
                    onChange={fnChangeOagin}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default AskPurchase
