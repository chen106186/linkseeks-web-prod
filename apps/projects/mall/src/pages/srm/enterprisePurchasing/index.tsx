import React, { useEffect, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import { useLoaderData, useLocation, useParams } from 'react-router-dom'
import { getQueryString } from '@/utils/getUrlParam'
import {
  getCommodityWebMemberPurchaseWebActiveMemberPurchase,
  GetCommodityWebMemberPurchaseWebActiveMemberPurchaseResponse,
  getCommodityWebMemberPurchaseWebMemberPurchaseList,
  getCommodityWebMemberPurchaseWebNewAddMemberPurchase,
  GetCommodityWebMemberPurchaseWebNewAddMemberPurchaseResponse,
} from '@apps/apis'
import { Empty, Pagination, Skeleton } from 'antd'
import HelmetProvider from '@/context/helmetProvider'
import EnterprisesCard from './EnterprisesCard'
import styles from './index.module.less'
import CommonFilter from '@/components/CommonFilter'
import { FILTER_TYPE } from '@/types/commodity'
import SortBar from '@/components/SortBar'
import FilterBar from '@/components/FilterBar'
import { CommodityLoaderReturn } from '@/loaders/commodityLoader'
import useFilterParams from '@/hooks/useFilterParams'
import { FILTER_PARAM } from '@/components/CommonFilter/types'
import { LAYOUT_TYPE } from '@/types/global'

const EnterprisePurchasing = () => {
  const { mallInfo, currentCity, layoutType } = useGlobalConext()
  const { filterList, categoryList } = useLoaderData() as CommodityLoaderReturn
  const { filterParam, mroCategoryTree, dispatchFilterParam } = useFilterParams({
    filterList,
  })
  const { filter = '' } = useParams()
  const [totalCount, setTotalCount] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [purchaseList, setPurchaseList] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const { search } = useLocation()
  const [activePurchase, setActivePurchase] = useState<GetCommodityWebMemberPurchaseWebActiveMemberPurchaseResponse>()
  const [newJoinShopList, setNewJoinShopList] = useState<GetCommodityWebMemberPurchaseWebNewAddMemberPurchaseResponse>(
    [],
  )
  /**
   * 获取一级品类详细信息
   */
  const fnGetPurchaseList = (currentParam?: number, size?: number) => {
    const keyword = getQueryString('keyword', search) || ''
    let param: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      memberName: keyword,
    }

    if (filterParam) {
      param = Object.assign(param, filterParam)
      if (filterParam.orderType) {
        param.sortCreditPoint = filterParam.orderType === 1 ? 'DESC' : 'ASC'
      }
    }
    setLoading(true)

    const headers: any = {
      shopId: mallInfo?.id,
    }

    getCommodityWebMemberPurchaseWebMemberPurchaseList(param, { headers }).then((res) => {
      if (res.code === 1000) {
        setPurchaseList(res.data.data)
        setTotalCount(res.data.totalCount)
        setLoading(false)
      }
    })
  }

  const fetchActivePurchase = () => {
    getCommodityWebMemberPurchaseWebActiveMemberPurchase().then((res) => {
      if (res.code === 1000) {
        setActivePurchase(res.data)
      }
    })
  }

  const fetchNewJoinShopList = () => {
    getCommodityWebMemberPurchaseWebNewAddMemberPurchase().then((res) => {
      if (res.code === 1000) {
        setNewJoinShopList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchActivePurchase()
    fetchNewJoinShopList()
  }, [])

  /**
   *
   * @param cur 当前页面
   * @param size 每页显示
   * 修改页码
   */
  const fnChangeOagin = (cur: any, size: any) => {
    setCurrent(cur)
    setPageSize(size)
  }

  useEffect(() => {
    if (filterList.length === 0 && !filterParam) {
      setCurrent(1)
      fnGetPurchaseList(1)
    }
  }, [filterList, filterParam])

  useEffect(() => {
    if (filterParam) {
      setCurrent(1)
      fnGetPurchaseList(1)
    }
  }, [filterParam])

  const handleFilter = (values: FILTER_PARAM | undefined) => {
    dispatchFilterParam(values)
  }

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fnGetPurchaseList(page, size)
  }

  return (
    <HelmetProvider title={'名企采购'}>
      <div className={styles.purchaseInquiry}>
        <div className={styles.mall_container}>
          <div className={styles.purchaseInquiry_container}>
            <CommonFilter
              filterParam={filterParam}
              layoutType={layoutType}
              filter={filter}
              onFilter={handleFilter}
              filterConfig={[
                {
                  type: FILTER_TYPE.category,
                  source: categoryList,
                },
                {
                  type: FILTER_TYPE.activePurchase,
                  source: activePurchase,
                },
                {
                  type: FILTER_TYPE.newJoinPurchase,
                  source: newJoinShopList,
                },
              ]}
            />
            <div className={styles.purchaseInquiry_main}>
              <SortBar
                filterParam={filterParam}
                current={current}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={(page) => onPageChange(page)}
                onFilterChange={handleFilter}
                layoutType={LAYOUT_TYPE.srmEnterprise}
              />
              <FilterBar
                filterList={filterList}
                categoryList={categoryList}
                mroCategoryTree={mroCategoryTree}
                filterLoading={false}
                onFilterChange={(values) => {
                  dispatchFilterParam(values)
                }}
                layoutType={LAYOUT_TYPE.srmEnterprise}
              />
              <ul className={styles['item-warp']}>
                {purchaseList.map((item: any, index: number) => {
                  return (
                    <li key={item.id + 'card'} className={styles['card-item']} style={{ marginBottom: '8px' }}>
                      <EnterprisesCard
                        id={item.id}
                        cardTitle={item.memberName}
                        starsCard={item.levelTag}
                        cardAddress={item.areas}
                        business={item.mainCategory}
                        identification={item.creditPoint}
                        companyLogo={item.logo}
                        purchaseAmount={item.purchaseAmount}
                        inquiryNum={item.inquiryNum}
                        inviteTenderNum={item.inviteTenderNum}
                        biddingNum={item.biddingNum}
                        levelTag={item.levelTag}
                      />
                    </li>
                  )
                })}

                {!loading && purchaseList.length === 0 && (
                  <li style={{ paddingTop: '100px', margin: '0 auto' }}>
                    <Empty description={<div>{'暂无数据'}</div>} />
                  </li>
                )}
                {loading && <Skeleton />}
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
        </div>
      </div>
    </HelmetProvider>
  )
}

export default EnterprisePurchasing
