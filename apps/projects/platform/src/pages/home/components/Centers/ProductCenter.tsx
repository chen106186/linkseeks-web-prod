import React, { useCallback, useMemo } from 'react'
import { Space } from 'antd'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'
import { getProductReportGetCommodity, GetProductReportGetCommodityResponse } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
interface Iprops {}

const ADD_BRAND = '/commodityAbility/trademark/trademarkApply/add'
const ADD_PRODUCT = '/commodityAbility/commodity/products/add'
const ADD_REPOSITORIES = '/commodityAbility/repositories/add'
const ADD_CATEGORY = '/commodityAbility/classAndProperty/class'
const ADD_MATERIAL = '/commodityAbility/material/materialPendingAdd/add'

// 商品中心：根据当前用户+当前角色是否有此商品能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 1、创建品牌：判断当前用户是否有品牌申请权限，有则显示创建品牌按钮，点击跳转能力中心-商品能力-品牌管理-新增品牌
// 2、创建商品：判断当前用户是否有商品发布权限，有则显示创建商品按钮，点击跳转能力中心-商品能力-商品管理-新增商品
// 3、设置库存：判断当前用户是否有仓位库存管理权限，有则显示设置库存按钮，点击跳转能力中心-商品能力-仓位管理--新增仓位库存

const ProductCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref } = useViewRequest<
    GetProductReportGetCommodityResponse,
    any
  >(getProductReportGetCommodity as any, {})
  const intl = useIntl()
  const translate = useWebIntl()
  const { userAuth, hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('commodityAbility')
  const { StaticsDataList } = Layout
  const KEY_TITLE = {
    materialAuditList: intl.formatMessage({ id: 'home.wuliaoshenhe', defaultMessage: '物料审核' }),
    materialChangeAuditList: intl.formatMessage({ id: 'home.wuliaobiangengshenhe', defaultMessage: '物料变更审核' }),
    brandManagementList: intl.formatMessage({ id: 'home.pinpaiguanli', defaultMessage: '品牌管理' }),
    commodityManagementList: intl.formatMessage({ id: 'home.shangpinguanli', defaultMessage: '商品管理' }),
  }

  const extraList = useMemo(
    () => [
      {
        title: translate('web.resource.home.createBrand'),
        authUrl: ADD_BRAND,
      },
      {
        title: translate('web.resource.home.createCategory'),
        authUrl: ADD_CATEGORY,
      },
      {
        title: translate('web.resource.home.createProduct'),
        authUrl: ADD_PRODUCT,
      },
      {
        title: translate('web.resource.home.createMaterial'),
        authUrl: ADD_MATERIAL,
      },
      {
        title: translate('web.resource.home.setInventory'),
        authUrl: ADD_REPOSITORIES,
      },
    ],
    [],
  )

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.productCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.productCenter.layoutTips' })}
      loading={loading}
      isError={isError}
      extra={
        <Space>
          {extraList.map((_item) => {
            return (
              <Authorize url={_item.authUrl} key={_item.authUrl}>
                <div>
                  <Link to={_item.authUrl}>{_item.title}</Link>
                </div>
              </Authorize>
            )
          })}
        </Space>
      }
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
    </Layout>
  )
}

export default ProductCenter
