/**
 * 选择商品弹窗
 */
import {
  getProductCommodityCommonGetCommodityListBySellerToRule,
  getProductCommodityGetCommodityList,
} from '@apps/apis'
import { ColumnType } from 'antd/lib/table'
import React, { memo, forwardRef } from 'react'
import CommonTableDrawer from '../CommonTableDrawer'
import { schema } from './schema'
import { fetchBrand, fetchCategoryData, fetchTreeData, useAsyncCascader } from '../effects'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Cascader } from 'antd'
import { getIntl } from '@linkseeks/i18n'

interface PropsType {
  handleOk?: (data: any) => void
  onQueryAll?: (value?: any) => void
  otherParams?: Object
}

const intl = getIntl()

const tableColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.id', defaultMessage: '商品ID' }),
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: intl.formatMessage({ id: 'commodity.products.columns.name', defaultMessage: '商品名称' }),
    dataIndex: 'name',
    key: 'name',
    width: 300,
    render: (name, record) => {
      return `${name}${record?.commodityAttribute ? `/${record?.commodityAttribute}` : ''}`
    },
  },
  {
    title: intl.formatMessage({ id: 'commodity.goods.columns.customerCategory', defaultMessage: '品类' }),
    dataIndex: 'customerCategoryName',
    key: 'customerCategoryName',
  },
  {
    title: intl.formatMessage({ id: 'commodity.goods.columns.brand', defaultMessage: '品牌' }),
    dataIndex: 'brandName',
    key: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'constants.order.13', defaultMessage: '跨境电商进口' }),
    dataIndex: 'isCrossBorder',
    key: 'isCrossBorder',
    render: (t) =>
      t
        ? intl.formatMessage({ id: 'processRuleSetting.shi', defaultMessage: '是' })
        : intl.formatMessage({ id: 'processRuleSetting.fou', defaultMessage: '否' }),
  },
  {
    title: intl.formatMessage({
      id: 'commodity.products.fastModifyPrice.columns.priceType',
      defaultMessage: '商品定价',
    }),
    dataIndex: 'priceTypeName',
    key: 'priceTypeName',
  },
]

const TableGoodsDrawer = ({ handleOk, onQueryAll, otherParams = {}, ...rest }: PropsType, ref) => {
  return (
    <CommonTableDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'commodity.products.addDirectChannel.tab.1', defaultMessage: '选择商品' })}
      queryAllLabel={intl.formatMessage({ id: 'editor.bottom.link.type.commodity', defaultMessage: '全部商品' })}
      onOk={handleOk}
      onQueryAll={onQueryAll}
      tableColumns={tableColumns}
      fetchTableApi={getProductCommodityCommonGetCommodityListBySellerToRule}
      fnTableParams={(params: any) => {
        const customerCategoryId = params?.customerCategoryId?.length
          ? params?.customerCategoryId[params?.customerCategoryId?.length - 1]
          : ''
        customerCategoryId && (params.customerCategoryId = customerCategoryId)
        return { ...params, ...otherParams }
      }}
      controlSchema={schema}
      controlComponents={{ Cascader }}
      controlEffects={($, actions) => {
        useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        useAsyncCascader('customerCategoryId', fetchCategoryData)
        useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
      }}
      {...rest}
    />
  )
}

export default memo(forwardRef(TableGoodsDrawer))
