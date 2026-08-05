import React, { useMemo, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import CommonFilter from '@/components/CommonFilter'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '@/components/CommonFilter/types'
import HelmetProvider from '@/context/helmetProvider'
import { FILTER_TYPE } from '@/types/commodity'
import useFilterParams from '@/hooks/useFilterParams'
import { useLoaderData, useParams } from 'react-router-dom'
import FilterBar from '@/components/FilterBar'
import SearchNoResult from '@/components/SearchNoResult'
import { Button, Pagination, Spin } from 'antd'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import useLink from '@/hooks/useLink'
import { getWebIntl } from '@/utils/locales'
import ProductList from '@/components/ProductList'
import styles from './index.module.less'
import SortBar from '@/components/SortBar'
import useCommodity from './hooks'
import { CommodityLoaderReturn } from '@/loaders/commodityLoader'
import { LAYOUT_TYPE } from '@/types/global'

const Integral: React.FC = (props) => {
  const { mallInfo, layoutType, isMro } = useGlobalConext()
  const { categoryList, brandList, attributeList, filterList } = useLoaderData() as CommodityLoaderReturn
  const { filter = '' } = useParams()
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(
    isMro ? COMMODITY_SHOW_TYPE.list : COMMODITY_SHOW_TYPE.gird,
  ) // 展示方式：1：矩阵排列； 2:列表排列
  const translate = getWebIntl()

  const REQUEST_FILTER_TYPE = FILTER_SEARCH_TYPE.url
  const { linkPrefix } = useLink()

  const { filterParam, dispatchFilterParam } = useFilterParams({
    filterList,
    attributeList,
    // mroCategoryTree: undefined,
  })

  const { commodityList, loading, totalCount, current, pageSize, onPageChange } = useCommodity({
    filterParam,
  })

  const handleFilter = (values: FILTER_PARAM | undefined) => {
    dispatchFilterParam(values)
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
    return `${translate('web.resource.marketing.jifenshangpin')}-${mallInfo?.name}`
  }, [mallInfo])

  return (
    <HelmetProvider title={seoTitle}>
      <div className={styles.commodity}>
        <div className={styles.commodity_container}>
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
                type: FILTER_TYPE.points,
              },
            ]}
          />
          <div className={styles.commodity_main}>
            <div className={styles.tool_bar_wrap}>
              <SortBar
                isMro={isMro}
                isIntegral
                filterParam={filterParam}
                showType={showType}
                current={current}
                totalCount={totalCount}
                pageSize={pageSize}
                onShowTypeChange={(type) => setShowType(type)}
                onPageChange={(page) => onPageChange(page)}
                onFilterChange={handleFilter}
                layoutType={layoutType}
              />
              <FilterBar
                filterList={filterList}
                categoryList={categoryList}
                brandList={brandList}
                attributeList={attributeList}
                filterLoading={false}
                onFilterChange={(values) => {
                  dispatchFilterParam(values)
                }}
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
                    path={`/integral/detail`}
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

export default Integral
