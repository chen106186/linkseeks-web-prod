import React, { useEffect, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import { Empty, Pagination, Skeleton } from 'antd'
import { getQueryString } from '@/utils/getUrlParam'
import { useLocation } from 'react-router-dom'
import {
  getCommodityWebMemberLogisticsWebMemberLogisticsList,
  getCommodityWebMemberProcessWebMemberProcessList,
} from '@apps/apis'
import { LinkTo } from '@/utils'
import { LAYOUT_TYPE } from '@/types/global'
import HelmetProvider from '@/context/helmetProvider'
import SearchItem from './SearchItem'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

const PortalSearchResult: React.FC = () => {
  const { mallInfo, mallUrl, currentCity, layoutType } = useGlobalConext()
  const [searchList, setSearchList] = useState<any>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { search } = useLocation()
  const [inLoading, setInLoading] = useState<boolean>(true)
  const inLoadingList = [1, 2, 3, 4]
  const { linkPrefix } = useLink()

  /**
   * 获取加工门户
   */
  const fnGetSearchProcessList = () => {
    const searchMessageDesc = localStorage.getItem('search')
    let searchMessage = {}
    if (searchMessageDesc) {
      searchMessage = JSON.parse(searchMessageDesc)
      localStorage.setItem('search', '')
    }

    const data: any = {
      categoryId: getQueryString('categoryId', search || ''),
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      yearProcessAmount: '',
      current: current,
      pageSize: pageSize,
    }
    setInLoading(true)
    getCommodityWebMemberProcessWebMemberProcessList(data)
      .then((res) => {
        setSearchList(res.data.data)
        setTotalCount(res.data.totalCount)
      })
      .finally(() => {
        setInLoading(false)
      })
  }

  /**
   * 获取物流门户
   */
  const fnGetSearchLogisticList = () => {
    const data: any = {
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      yearProcessAmount: getQueryString('provinceCodeDischarge', search || ''),
      cityCodeDischarge: getQueryString('cityCodeDischarge', search || ''),
      categoryId: getQueryString('categoryId', search || ''),
      tonnage: getQueryString('tonnage', search || ''),
      current: current,
      pageSize: pageSize,
    }
    setInLoading(true)
    getCommodityWebMemberLogisticsWebMemberLogisticsList(data)
      .then((res) => {
        setSearchList(res.data.data)
        setTotalCount(res.data.totalCount)
        setInLoading(false)
      })
      .finally(() => {
        setInLoading(false)
      })
  }

  const fnChangePagintion = (page: any, pageSize: any) => {
    setCurrent(page)
    setPageSize(pageSize)
  }

  useEffect(() => {
    if (layoutType === LAYOUT_TYPE.process) {
      fnGetSearchProcessList()
    } else if (layoutType === LAYOUT_TYPE.logistics) {
      fnGetSearchLogisticList()
    }
  }, [current])

  return (
    <HelmetProvider title={'门户搜索'}>
      <div className={styles['logistucs-main']}>
        <div className={styles['login-main']}>
          <div className={styles['login-warp']}>
            <a href="/" style={{ display: 'inlineBlock' }}>
              <img src={mallInfo?.logoUrl || mallUrl?.defaultEnterprise?.logoUrl} alt="" />
            </a>
          </div>
        </div>
        <div>
          <div className={styles['search-tips']}>
            在“{layoutType === LAYOUT_TYPE.process ? '加工服务' : '物流服务'}”搜索到
            <span className={styles['search-number']}>{totalCount}</span>条
            {layoutType === LAYOUT_TYPE.process ? '加工企业' : '物流公司'}信息
          </div>
          <ul className={styles['search-list-warp']}>
            {!inLoading ? (
              <>
                {searchList.map((item: any) => {
                  return (
                    <li
                      className={styles['search-list-item']}
                      key={item.id + 'search'}
                      onClick={() => LinkTo(linkPrefix(`/portal/aboutUs/${item.id}`))}
                    >
                      <SearchItem searchSelect={item} />
                    </li>
                  )
                })}
                {searchList.length === 0 && (
                  <div style={{ padding: '50px 0' }}>
                    <Empty description={<div>暂无数据</div>} />
                  </div>
                )}
              </>
            ) : (
              <>
                {inLoadingList.map((key: number) => {
                  return (
                    <div className={styles['skeleton-warp']} key={key}>
                      <Skeleton />
                    </div>
                  )
                })}
              </>
            )}
          </ul>
          <div style={{ textAlign: 'right' }} className={styles['pagination-warp']}>
            <Pagination
              hideOnSinglePage={true}
              showSizeChanger={false}
              showQuickJumper
              total={totalCount}
              onChange={fnChangePagintion}
            />
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default PortalSearchResult
