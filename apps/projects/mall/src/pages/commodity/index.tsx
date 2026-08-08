import React, { useEffect, useMemo, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import CommonFilter from '@/components/CommonFilter'
import { FILTER_PARAM } from '@/components/CommonFilter/types'
import { deleteCommonlyUse, fetchCommonlyUseList, getCommonlyUsedUrl } from '@/hooks/utils/commonlyUseFn'
import {
  GetProductShopOftenSelectGetOftenSelectListResponseDetail,
  postProductShopOftenSelectSaveOrUpdateOftenSelect,
} from '@apps/apis'
import HelmetProvider from '@/context/helmetProvider'
import { FILTER_TYPE } from '@/types/commodity'
import useFilterParams from '@/hooks/useFilterParams'
import { useLoaderData, useLocation, useParams } from 'react-router-dom'
import FilterBar from '@/components/FilterBar'
import SearchNoResult from '@/components/SearchNoResult'
import { Button, Pagination, Spin } from 'antd'
import { COMMODITY_SHOW_TYPE, COMMODITY_TYPE } from '@/constants'
import { getWebIntl } from '@/utils/locales'
import ProductList from '@/components/ProductList'
import SortBar from '@/components/SortBar'
import { CommodityLoaderReturn } from '@/loaders/commodityLoader'
import { LAYOUT_TYPE } from '@/types/global'
import FilterMro from '@/components/FilterMro'
import useCommodity from './hooks'
import styles from './index.module.less'
import useFilter from '@/hooks/useFilter'

interface IProps {
  /** 价格类型 */
  priceType?: 1 | 2 | 3 | 4
}

const Commodity: React.FC<IProps> = (props) => {
  const { priceType = 1 } = props
  const { mallInfo, userInfo, layoutType, isMro } = useGlobalConext()
  const { categoryList, brandList, initMroCategoryTree, initMroFilterSelected, attributeList, filterList } =
    useLoaderData() as CommodityLoaderReturn
  const { filter = '' } = useParams()
  const { pathname } = useLocation()
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(
    isMro ? COMMODITY_SHOW_TYPE.list : COMMODITY_SHOW_TYPE.gird,
  ) // 展示方式：1：矩阵排列； 2:列表排列
  const [commonlyUseList, setCommonlyUseList] = useState<GetProductShopOftenSelectGetOftenSelectListResponseDetail[]>(
    [],
  )
  const [checkPrice, setCheckPrice] = useState<boolean>(priceType === 1 ? true : false)
  const translate = getWebIntl()

  const { filterParam, mroCategoryTree, mroFilterSelected, setMroFilter, dispatchFilterParam } = useFilterParams({
    filterList,
    initMroCategoryTree,
    initMroFilterSelected,
  })

  const { commodityList, loading, totalCount, current, pageSize, onPageChange } = useCommodity({
    filterParam,
    priceType,
    filterList,
    mroFilterSelected,
    checkPrice,
  })

  useFilter({
    pathname,
    filterList,
  })

  const getCommonlyUseList = async () => {
    setCommonlyUseList(await fetchCommonlyUseList())
  }

  useEffect(() => {
    if (userInfo) {
      getCommonlyUseList()
    }
  }, [])

  const handleFilter = (values: FILTER_PARAM | undefined) => {
    dispatchFilterParam(values)
  }

  const handleSaveFilter = (name: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const param: any = {
        name,
      }
      for (const filterItem of filterList) {
        switch (filterItem.type) {
          case FILTER_TYPE.category:
            param.customerCategoryId = filterItem.key
            param.customerCategoryName = filterItem.filter ? filterItem.filter : filterItem.title
            break
          case FILTER_TYPE.customerCategory:
            param.customerCategoryId = filterItem.key
            param.customerCategoryName = filterItem.filter ? filterItem.filter : filterItem.title
            break
          case FILTER_TYPE.brand:
            param.brandId = filterItem.key
            param.brandName = filterItem.title
            break
          case FILTER_TYPE.commodityType:
            param.priceType = Number(filterItem.key)
            break
          case FILTER_TYPE.minPrice:
            param.min = filterItem.key
            break
          case FILTER_TYPE.maxPrice:
            param.max = filterItem.key
            break
          case FILTER_TYPE.province:
            param.provinceCode = filterItem.key
            param.provinceName = filterItem.title
            break
          case FILTER_TYPE.city:
            param.cityCode = filterItem.key
            param.cityName = filterItem.title
            break
          case FILTER_TYPE.attribute:
            param.customerAttributeList = filterItem.key
            break
          default:
            break
        }
      }
      postProductShopOftenSelectSaveOrUpdateOftenSelect(param).then((res) => {
        if (res.code === 1000) {
          getCommonlyUseList()
          resolve(true)
        } else {
          reject()
        }
      })
    })
  }

  const seoTitle = useMemo(() => {
    if (
      filterList &&
      filterList.length > 0 &&
      filterList.some((item) => ['category', 'brand', 'customerCategory'].includes(item.type))
    ) {
      const seoTextList: string[] = []
      let categoryFilter: string = ''
      filterList.forEach((item) => {
        switch (item.type) {
          case 'category':
            categoryFilter = item.title.split(' > ').reverse().join(' ')
            seoTextList.push(categoryFilter)
            break
          case 'brand':
            seoTextList.unshift(item.title)
            break
          case 'customerCategory':
            categoryFilter = item.title.split(' > ').reverse().join(' ')
            seoTextList.push(categoryFilter)
            break
          default:
            break
        }
      })

      return `${seoTextList.join(' ')}-${mallInfo?.name}`
    }
    return `${
      priceType === 1 ? translate('web.resource.mall.spotCommodity') : translate('web.resource.mall.nav-inquiry')
    }-${mallInfo?.name}`
  }, [mallInfo])

  return (
    <HelmetProvider title={seoTitle}>
      <div className={styles.commodity}>
        <div className={styles.commodity_container}>
          {isMro === false && (
            <CommonFilter
              filterParam={filterParam}
              layoutType={layoutType}
              filter={filter}
              onFilter={handleFilter}
              filterConfig={[
                {
                  type: FILTER_TYPE.commonlyUsed,
                  source: commonlyUseList,
                  onDelete: async (id: number) => {
                    await deleteCommonlyUse(id)
                    getCommonlyUseList()
                  },
                  onClick: async (id: number) => {
                    const url = await getCommonlyUsedUrl(id, pathname, filter)
                    if (url && typeof url === 'string') {
                      window.location.href = url
                    }
                  },
                },
                {
                  type: FILTER_TYPE.categoryAndAttr,
                  source: categoryList,
                  attributeList,
                },
                {
                  type: FILTER_TYPE.brand,
                  source: brandList,
                },
                {
                  type: priceType === 1 ? FILTER_TYPE.price : FILTER_TYPE.nullFilter,
                },
                {
                  type: priceType === 1 ? FILTER_TYPE.carriageType : FILTER_TYPE.nullFilter,
                },
              ]}
            />
          )}
          <div className={styles.commodity_main}>
            {isMro && (filterParam?.categoryId ?? filterParam?.customerCategoryId) && mroCategoryTree?.length > 0 && (
              <FilterMro
                layoutType={layoutType}
                mroCategoryTree={mroCategoryTree}
                mroFilterSelected={mroFilterSelected}
                setMroFilter={setMroFilter}
              />
            )}
            <div className={styles.tool_bar_wrap}>
              <SortBar
                isMro={isMro}
                filterParam={filterParam}
                showType={showType}
                current={current}
                totalCount={totalCount}
                pageSize={pageSize}
                checkPrice={checkPrice}
                onShowTypeChange={(type) => setShowType(type)}
                onPageChange={(page) => onPageChange(page)}
                onCheckPriceChange={(state) => setCheckPrice(state)}
                onFilterChange={handleFilter}
                layoutType={layoutType}
              />
              <FilterBar
                filterList={filterList}
                categoryList={categoryList}
                brandList={brandList}
                attributeList={attributeList}
                mroCategoryTree={mroCategoryTree}
                filterLoading={false}
                onFilterChange={(values) => {
                  dispatchFilterParam(values)
                }}
                onFilterSave={(name) => handleSaveFilter(name)}
                layoutType={layoutType}
              />
            </div>
            {(commodityList.length === 0 || !commodityList) && !loading ? (
              <SearchNoResult search="" />
            ) : (
              <>
                <Spin spinning={loading}>
                  <ProductList
                    dataSource={commodityList}
                    layoutType={layoutType}
                    type={showType}
                    isMro={isMro}
                    isStore={layoutType !== LAYOUT_TYPE.own}
                    path={priceType === COMMODITY_TYPE.inquiry ? `/inquiry/detail` : `/commodity/detail`}
                  />
                </Spin>
                {totalCount > 10 ? (
                  <div className={styles.pagination_wrap}>
                    <Pagination
                      showQuickJumper={{
                        goButton: (
                          <Button style={{ position: 'relative', top: '-2px', marginLeft: 12 }}>
                            {translate('web.common.confirm')}
                          </Button>
                        ),
                      }}
                      showTotal={(total) => (
                        <span style={{ color: '#91959B' }}>
                          {translate('web.common.gong')} {Math.ceil(total / pageSize)} {translate('web.common.page')}
                        </span>
                      )}
                      onChange={onPageChange}
                      current={current}
                      pageSize={pageSize}
                      total={totalCount}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default Commodity
