import React from 'react'
import CommonFilter from '@/components/CommonFilter'
import { FILTER_SEARCH_TYPE, FILTER_TYPE } from '@/components/CommonFilter/types'
import { useLoaderData, useLocation, useParams } from 'react-router-dom'
import { LAYOUT_TYPE } from '@/types/global'
import useHistory from '@/hooks/useHistory'
import cx from 'classnames'
import useFilterParams from '@/hooks/useFilterParams'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import { CaretDownOutlined, CaretUpOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import FilterBar from '@/components/FilterBar'
import { Button, Pagination, Spin } from 'antd'
import SearchNoResult from '@/components/SearchNoResult'
import HelmetProvider from '@/context/helmetProvider'
import { CommodityLoaderReturn } from '@/loaders/commodityLoader'
import StoreList from './list'
import useStores from './hooks'
import styles from './index.module.less'

const Stores: React.FC = () => {
  const { categoryList, filterList } = useLoaderData() as CommodityLoaderReturn
  const { filter = '' } = useParams()
  const { pathname, search } = useLocation()
  const translate = getWebIntl()

  const REQUEST_FILTER_TYPE = FILTER_SEARCH_TYPE.url
  const history = useHistory()

  const { filterParam } = useFilterParams({ filterList })

  const { loading, current, pageSize, totalCount, shopList, popularShopList, newJoinShopList, onPageChange } =
    useStores({ filterParam })

  const changeOrderTypeUrl = (url: string, type: string | null) => {
    let newUrl = url
    if (!type) {
      return removeURLArg(newUrl, 'sortCreditPoint')
    }
    if (url.indexOf('sortCreditPoint') > -1) {
      newUrl = changeURLArg(newUrl, 'sortCreditPoint', type)
    } else {
      newUrl += `${search ? `&` : '?'}sortCreditPoint=${type}`
    }
    return newUrl
  }

  /**
   * 排序
   */
  const handleSort = () => {
    let url = `${pathname}${search}`
    const sortCreditPoint = getQueryString('sortCreditPoint', search)
    if (search.indexOf('sortCreditPoint') > -1) {
      if (sortCreditPoint === 'DESC') {
        url = changeOrderTypeUrl(url, 'ASC')
      } else {
        url = changeOrderTypeUrl(url, 'DESC')
      }
    } else {
      url = changeOrderTypeUrl(url, 'DESC')
    }

    history.push(url)
  }

  const judgeIsActive = (type: string) => {
    if (filterParam?.sortCreditPoint === type) {
      return true
    }
    return false
  }

  return (
    <HelmetProvider title={translate('web.resource.mall.nav-stores')}>
      <div className={styles.commodity}>
        <div className={styles.mall_container}>
          <div className={styles.commodity_container}>
            <CommonFilter
              filterParam={filterParam}
              layoutType={LAYOUT_TYPE.shopList}
              filter={filter}
              filterConfig={[
                {
                  type: FILTER_TYPE.category,
                  source: categoryList,
                },
                {
                  type: FILTER_TYPE.activeStores,
                  source: popularShopList,
                },
                {
                  type: FILTER_TYPE.newJoin,
                  source: newJoinShopList,
                },
              ]}
            />
            <div className={styles.commodity_main}>
              <div className={styles.tool_bar_wrap}>
                <div className={styles.tool_bar}>
                  <div className={styles.tool_bar_left}>
                    <div className={styles.tool_bar_filter_item} onClick={() => handleSort()}>
                      <span className={judgeIsActive('ASC') || judgeIsActive('DESC') ? styles.active : ''}>
                        {translate('web.resource.mall.xinyong')}
                      </span>
                      <div className={styles.price_filter_box}>
                        <CaretUpOutlined
                          translate={undefined}
                          className={cx(styles.icon, judgeIsActive('ASC') ? styles.active : '')}
                        />
                        <CaretDownOutlined
                          translate={undefined}
                          className={cx(styles.icon, judgeIsActive('DESC') ? styles.active : '')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.tool_bar_right}>
                    <div className={styles.count}>
                      <span>{translate('web.common.gong')}</span>
                      <label>{totalCount}</label>
                      <span>{translate('web.resource.member.gongyingshang')}</span>
                    </div>
                    <div className={styles.pageBox}>
                      <LeftOutlined
                        translate={undefined}
                        className={cx(styles.pageBoxIcon, current === 1 ? styles.disabled : '')}
                        onClick={() => {
                          if (current > 1) {
                            onPageChange(current - 1)
                          }
                        }}
                      />
                      <div className={styles.pageBox_main}>
                        <span>{current}</span>
                        <span>/</span>
                        <span>{Math.ceil(totalCount / pageSize) || 1}</span>
                      </div>
                      <RightOutlined
                        translate={undefined}
                        className={cx(
                          styles.pageBoxIcon,
                          current >= Math.ceil(totalCount / pageSize) ? styles.disabled : '',
                        )}
                        onClick={() => {
                          if (current < Math.ceil(totalCount / pageSize)) {
                            onPageChange(current + 1)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <FilterBar
                  filterList={filterList}
                  filterLoading={false}
                  categoryList={categoryList}
                  layoutType={LAYOUT_TYPE.shopList}
                />
              </div>
              {(shopList.length === 0 || !shopList) && !loading ? (
                <SearchNoResult search="" type={2} />
              ) : (
                <>
                  <Spin spinning={loading}>
                    <StoreList shopList={shopList} />
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
      </div>
    </HelmetProvider>
  )
}

export default Stores
