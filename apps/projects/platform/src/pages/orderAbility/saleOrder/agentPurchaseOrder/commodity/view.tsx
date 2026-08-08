/*
 * @Author: GHua
 * @Date: 2022-03-29 17:42:11
 * @LastEditTime: 2022-04-16 14:45:42
 * @LastEditors: Please set LastEditors
 * @Description: 代客下单（购物车下单）- 商品列表
 */
import React, { useEffect, useState } from 'react'
import { Button, Pagination, Spin, message } from 'antd'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import MallHeader from '../components/MallHeader'
import SortBar from '../components/SortBar'
import ProductList from '../components/ProductList'
import CommonFilter from '../components/CommonFilter'
import FilterBar from '../components/FilterBar'
import {
  postProductShopSelfGetCustomerCommodityList,
  getProductShopSelfGetCustomerAttributeByCategoryId,
  getProductShopStoreGetCustomerAttributeByCategoryId,
  postProductShopStoreGetCustomerCommodityList,
} from '@apps/apis'
import useAgentInfo from '../hooks/useAgentInfo'
import useFilter from '../hooks/useFilter'
import useFilterParams from '../hooks/useFilterParams'
import usePurchaseOrder from '../hooks/usePurchaseOrder'
import styles from './index.less'
import SearchNoResult from '../components/SearchNoResult'
import { authService } from '@apps/services'
import { COMMODITY_SHOW_TYPE } from '../constants'
import { CommodityItemType } from '../components/ProductList/types'
import { AttributeType, FILTER_PARAM, FILTER_SEARCH_TYPE, FILTER_TYPE } from '../components/CommonFilter/types'
import { LAYOUT_TYPE } from '@/constants'
import { LocaleProvide } from '@apps/design-ui'

const AgentCommodity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<CommodityItemType[]>([])
  const [attributeList, setAttributeList] = useState<AttributeType[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [totalCount, setTotalCount] = useState<number>(0)
  const REQUEST_FILTER_TYPE = FILTER_SEARCH_TYPE.silence
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const intl = useIntl()
  const layoutType = agentPurchaseOrderInfo?.isSelf ? LAYOUT_TYPE.own : LAYOUT_TYPE.mall
  const mallId = agentPurchaseOrderInfo?.shopId
  const userInfo = authService.getAuth()
  const location: any = useLocation()
  const { purchaseCount } = usePurchaseOrder({
    orderId: agentPurchaseOrderInfo?.orderId,
    mallId: agentPurchaseOrderInfo?.shopId,
    customerMemberId: agentPurchaseOrderInfo?.memberId,
    customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    customerMemberLevel: agentPurchaseOrderInfo?.memberLevel,
  })
  const { categoryList, brandList } = useFilter({
    filterTypeList: [FILTER_TYPE.category, FILTER_TYPE.brand],
    mallId,
    layoutType,
    storeId: agentPurchaseOrderInfo?.storeId,
  })
  const { filterParam, filterList, dispatchFilterParam } = useFilterParams({
    filterType: REQUEST_FILTER_TYPE,
    layoutType,
    categoryList,
    brandList,
    attributeList,
  })

  useEffect(() => {
    fetchCommodityList()
  }, [filterParam])

  const fetchCommodityList = (currentParam?: number, size?: number) => {
    let param: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      priceTypeList: [1],
      // provinceCode: DEFAULT_CITY.provinceCode,
      // cityCode: DEFAULT_CITY.cityCode,
      customerMemberId: agentPurchaseOrderInfo?.memberId,
      customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    }

    if (location.query?.carriageType) {
      param.carriageType = location.query.carriageType
    }

    if (filterParam) {
      param = Object.assign(param, filterParam)
    }

    setLoading(true)
    const headers: any = {
      shopId: agentPurchaseOrderInfo?.shopId,
    }

    let postFn
    switch (layoutType) {
      case LAYOUT_TYPE.mall:
        param.storeId = agentPurchaseOrderInfo?.storeId
        postFn = postProductShopStoreGetCustomerCommodityList
        break
      case LAYOUT_TYPE.own:
        param.memberId = userInfo?.memberId
        postFn = postProductShopSelfGetCustomerCommodityList
        break
      default:
        break
    }

    postFn &&
      postFn(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            message.destroy()
            setCommodityList(res.data.data as CommodityItemType[])
            setTotalCount(res.data.totalCount)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
  }

  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fetchCommodityList(page, size)
  }

  const handleFilter = (values: FILTER_PARAM | undefined) => {
    dispatchFilterParam(values)
  }

  const fetchAttributeList = (categoryId: string) => {
    const headers = {
      shopId: mallId,
    }

    const params: any = {
      categoryId,
    }

    if (layoutType === LAYOUT_TYPE.own) {
      params.memberId = userInfo?.memberId
    } else if (layoutType === LAYOUT_TYPE.mall) {
      params.storeId = agentPurchaseOrderInfo?.storeId
    }

    const API_MAP = {
      [LAYOUT_TYPE.mall]: getProductShopStoreGetCustomerAttributeByCategoryId,
      [LAYOUT_TYPE.own]: getProductShopSelfGetCustomerAttributeByCategoryId,
    }

    API_MAP[layoutType](params, { headers } as any).then((res) => {
      if (res.code === 1000) {
        setAttributeList(res.data as AttributeType[])
      }
    })
  }

  useEffect(() => {
    if (filterList && filterList.length > 0) {
      const categoryFilter = filterList.filter(
        (item) => item.type === FILTER_TYPE.category || item.type === FILTER_TYPE.customerCategory,
      )[0]
      const hasAttrFilter = filterList.filter((item) => item.type === FILTER_TYPE.attribute)[0]
      const state = categoryFilter && categoryFilter.isLast && !hasAttrFilter
      // 如果是最后一级品类则显示属性
      if (state) {
        fetchAttributeList(categoryFilter.key)
      } else {
        if (
          filterList.every((item) => item.type !== FILTER_TYPE.category && item.type !== FILTER_TYPE.customerCategory)
        ) {
          setAttributeList([])
        }
      }
    } else {
      setAttributeList([])
    }
  }, [filterList])

  return (
    <LocaleProvide locale={intl.i18n.language as any}>
      <div className={styles.commodity}>
        <MallHeader
          logo={agentPurchaseOrderInfo?.logoUrl}
          purchaseCount={purchaseCount}
          purchaseOrderPath={'/orderAbility/saleOrder/agentPurchaseOrder/purchaseOrder'}
          searchOptions={[]}
          onCommoditySearch={(value: string): void => {
            dispatchFilterParam({
              ...filterParam,
              name: value,
            })
          }}
        />
        <div className={styles.commodity_container}>
          <CommonFilter
            filterType={REQUEST_FILTER_TYPE}
            filterParam={filterParam}
            onFilter={handleFilter}
            filterConfig={[
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
                type: FILTER_TYPE.price,
              },
              {
                type: FILTER_TYPE.carriageType,
              },
            ]}
          />
          <div className={styles.commodity_main}>
            <div className={styles.tool_bar_wrap}>
              <SortBar
                filterParam={filterParam}
                filterType={REQUEST_FILTER_TYPE}
                showType={showType}
                current={current}
                totalCount={totalCount}
                pageSize={pageSize}
                onShowTypeChange={(type) => setShowType(type)}
                onPageChange={(page) => handlePageChange(page)}
                onFilterChange={handleFilter}
              />
              <FilterBar
                filterList={filterList}
                categoryList={categoryList}
                brandList={brandList}
                attributeList={attributeList}
                onFilterChange={(values) => {
                  dispatchFilterParam(values)
                }}
              />
            </div>
            {(commodityList.length === 0 || !commodityList) && !loading ? (
              <SearchNoResult search="" />
            ) : (
              <>
                <Spin spinning={loading}>
                  <ProductList
                    dataSource={commodityList}
                    layoutType={LAYOUT_TYPE.shop}
                    type={showType}
                    paramType="search"
                    jumpType="history"
                    target="_self"
                    isStore={false}
                    path="/orderAbility/saleOrder/agentPurchaseOrder/commodityDetail"
                  />
                </Spin>
                {totalCount > 10 ? (
                  <div className={styles.pagination_wrap}>
                    <Pagination
                      showQuickJumper={{
                        goButton: (
                          <Button style={{ position: 'relative', top: '-2px', marginLeft: 12 }}>
                            {intl.formatMessage({ id: 'agentOrder.btn.sure' })}
                          </Button>
                        ),
                      }}
                      showTotal={(total) => (
                        <span style={{ color: '#91959B' }}>
                          {intl.formatMessage({ id: 'agentOrder.text.common' })} {Math.ceil(total / pageSize)}{' '}
                          {intl.formatMessage({ id: 'agentOrder.text.page' })}
                        </span>
                      )}
                      onChange={handlePageChange}
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
    </LocaleProvide>
  )
}

export default AgentCommodity
