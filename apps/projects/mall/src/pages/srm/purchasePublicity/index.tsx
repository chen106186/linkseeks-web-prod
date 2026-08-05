import React, { useState, useEffect } from 'react'
import { Button, Pagination, Empty, Carousel } from 'antd'
import OfferCard from './components/OfferCard'
import FilterBar from '@/components/FilterBar'
import SkeletonCard from '@/components/SkeletonCard'
import { getWebIntl } from '@/utils/locales'
import {
  getPurchasePurchaseNoticeList,
  getManageMemberAdvertFindAllByColumnType,
  getManageContentAdvertFindAllByColumnType,
} from '@apps/apis'
import styles from './index.module.less'
import { getQueryString } from '@/utils/getUrlParam'
import { mallService } from '@apps/services'
import { LAYOUT_TYPE, MallInfoType } from '@/types/global'
import { useGlobalConext } from '@/context/globalProvider'
import { useLoaderData, useLocation, useParams } from 'react-router-dom'
import HelmetProvider from '@/context/helmetProvider'
import CommonFilter from '@/components/CommonFilter'
import useFilterParams from '@/hooks/useFilterParams'
import { CommodityLoaderReturn } from '@/loaders/commodityLoader'
import { FILTER_PARAM, FILTER_TYPE } from '@/components/CommonFilter/types'
import SortBar from '@/components/SortBar'

const PurchasePublicity: React.FC = () => {
  const { mallInfo, shopInfo, currentCity } = useGlobalConext()
  const { filterList, categoryList } = useLoaderData() as CommodityLoaderReturn
  const { filterParam, mroCategoryTree, dispatchFilterParam } = useFilterParams({
    filterList,
  })
  const { filter = '' } = useParams()
  const [purchaseList, setPurchaseList] = useState<any>([])
  const [totalCount, setTotalCount] = useState(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [advertFindList, setAdvertFindList] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const { search } = useLocation()
  const translate = getWebIntl()

  /**
   * 获取采购公示列表
   */
  const fnGetPurchaseList = (currentParam?: number, size?: number) => {
    const overdue = getQueryString('overdue', search) || ''
    const ids = getQueryString('ids', search) || ''
    const keyword = getQueryString('keyword', search) || ''

    let data: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      overdue: overdue,
      ids: ids,
      keyword: decodeURIComponent(keyword),
      memberId: shopInfo?.memberId,
      memberRoleId: shopInfo?.roleId,
    }

    if (filterParam) {
      data = Object.assign(data, filterParam)
    }

    setLoading(true)
    const headers = {
      type: mallInfo ? mallInfo.type : '1',
      shopId: mallInfo ? mallInfo.id + '' : '1',
    }
    getPurchasePurchaseNoticeList(data, { headers }).then((res: any) => {
      if (res.data.data) {
        setPurchaseList([...res.data.data])
      } else {
        setPurchaseList([])
      }
      setTotalCount(res.data.totalCount)
      setLoading(false)
    })
  }
  /**
   * 获取广告业
   */
  const fnGetFindAllByColumnTyp = () => {
    const SrmDataSource: MallInfoType = mallService.getMall()

    let data: any = {
      columnType: '7',
    }
    setLoading(true)

    if (SrmDataSource?.isSelf) {
      data = {
        columnType: '7',
        memberId: SrmDataSource?.memberId,
        memberRoleId: SrmDataSource?.memberRoleId,
      }
      getManageMemberAdvertFindAllByColumnType(data).then((res) => {
        setAdvertFindList(res.data)
      })
    } else {
      getManageContentAdvertFindAllByColumnType(data).then((res: any) => {
        setAdvertFindList(res.data)
      })
    }
  }

  useEffect(() => {
    fnGetFindAllByColumnTyp()
  }, [])

  /**
   *
   * @param areas 适用地区数组
   * 获取适用地区字符串
   */
  const fnGetArea = (areas: Array<any>) => {
    if (!areas || areas.length == 0) {
      return ''
    }
    const areasDesc = areas.map((item: any) => {
      return item.province + '/' + item.city
    })
    return areasDesc.join(',')
  }

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fnGetPurchaseList(page, size)
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

  return (
    <HelmetProvider title={translate('web.resource.mall.caigougongshi')}>
      <div className={styles.purchaseInquiry}>
        <div className={styles.mall_container}>
          <div className={styles.purchaseInquiry_container}>
            <CommonFilter
              filterParam={filterParam}
              layoutType={LAYOUT_TYPE.srm}
              filter={filter}
              onFilter={handleFilter}
              filterConfig={[
                {
                  type: FILTER_TYPE.projectKeyword,
                },
                {
                  type: FILTER_TYPE.sourceType,
                },
              ]}
            />
            <div className={styles.purchaseInquiry_main}>
              {advertFindList.length > 0 && (
                <Carousel style={{ width: '944px' }}>
                  {advertFindList.map((item: any) => {
                    return (
                      <div>
                        <ul
                          className={styles['purchase-banner']}
                          key={item.id}
                          style={{ backgroundImage: `url(${item.imageUrl})` }}
                        >
                          <li>
                            <Button className={styles['banner-btn']}>
                              {translate('web.resource.mall.lijiqianggou')}
                              <a href={item.link} className="all-jump"></a>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    )
                  })}
                </Carousel>
              )}

              <div className={styles.tool_bar_wrap}>
                <SortBar
                  filterParam={filterParam}
                  current={current}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={(page) => onPageChange(page)}
                  onFilterChange={handleFilter}
                  layoutType={LAYOUT_TYPE.srmPublicity}
                />
                <FilterBar
                  filterList={filterList}
                  categoryList={categoryList}
                  mroCategoryTree={mroCategoryTree}
                  filterLoading={false}
                  onFilterChange={(values) => {
                    dispatchFilterParam(values)
                  }}
                  layoutType={LAYOUT_TYPE.srmPublicity}
                />
              </div>
              <ul className={styles['card-warp']} style={{ marginTop: '12px' }}>
                {purchaseList.length != 0 &&
                  purchaseList.map((item: any) => {
                    return (
                      <li key={item.id} className={styles['card-item']}>
                        <OfferCard
                          cardContent={item.name}
                          cardCompany={item.content}
                          cardData={item.createTime}
                          id={item.id}
                          // inShop={shopMessage ? true : false}
                          type={item.type}
                        />
                      </li>
                    )
                  })}
                {loading && purchaseList.length === 0 && <SkeletonCard />}
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
                  onChange={onPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default PurchasePublicity
