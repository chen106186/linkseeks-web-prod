import React, { useContext, useMemo, useState } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { useSelector } from '@apps/design-react'
import { context } from '../../common/context/context'
import { Product } from '@/pages/marketingAbility/marketingActivitiesManagement/activePage/fixtures/components/ProductPanel'
import CommodityDrawer from '../CommodityDrawer'
import { authService } from '@apps/services'
import { useFilterSameOption } from '../../common/hooks/useFilterSameOption'
import { searchBrandOptionEffect, searchCustomerCategoryOptionEffect } from './effect'
import {
  getProductCommodityTemplateGetBrandList,
  getProductCommodityTemplateGetFirstCategoryListByMemberId,
} from '@apps/apis'
import { getMarketingAdornGoodsListAdorn } from '@apps/apis'

type ComponentTypeProps = {
  activityType: number
  commodityKey: 'saleRanking' | 'suggestProduct'
  isWithLabels?: boolean
} & {
  [key: string]: any
}
interface Iprops {
  value: {
    id: number
    name: string
    activityId: number
    activityList: any[]
    mainPic: string
    /** 金额 */
    max: number
    label: string[]
  }
  props: {
    ['x-component-props']: ComponentTypeProps
  }
  mutators: {
    change: (params: any) => void
  }
}

/** 普通商品 */
const FormilyCommodity: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  const userAuth = authService.getAuth()
  /** 1 级分类 id */
  const { activeKey } = useSelector<any, 'activeKey'>(['activeKey'])
  const fixtureContext = useContext(context)
  /** 是否是自营商城 */
  const isSelfMall = useMemo(() => fixtureContext.isSelfMall, [fixtureContext.isSelfMall])
  /** 获取已经选择的id */
  const sameKeyState = useFilterSameOption()
  const componentProps = props.props?.['x-component-props'] || ({} as ComponentTypeProps)
  const disabledSaleRankingKeys = useMemo(
    () => sameKeyState[`tabItem_${activeKey}_${componentProps.commodityKey}`],
    [sameKeyState, activeKey],
  )

  const [productVisible, setProductVisible] = useToggle()
  const productProps = useMemo(
    () => ({
      id: value?.id,
      productName: value?.name,
      activityList: value?.activityList,
      productImgUrl: value?.mainPic,
      price: value?.max,
      label: value?.label || [],
    }),
    [value],
  )

  const onOk = (data) => {
    console.log(data)
    mutators.change(data)
    setProductVisible(false)
  }

  const onEdit = () => {
    setProductVisible(true)
  }

  const onClose = () => {
    setProductVisible(false)
  }

  const formatSearchParams = (params) => {
    const idInList = typeof params.id !== 'undefined' && params.id ? { idInList: [params.id] } : {}
    const { id, categoryId, ...rest } = params
    const idNotInList = Array.from(new Set([productProps?.id].concat(disabledSaleRankingKeys).filter(Boolean))).join(
      ',',
    )
    const common = {
      shopId: fixtureContext?.shopId.toString(),
      customerCategoryId: categoryId || activeKey,
      memberId: userAuth.memberId,
      memberRoleId: userAuth.memberRoleId,
      idNotInList: idNotInList,
      ...rest,
      ...idInList,
    }
    return common
  }

  const restProps = useMemo(() => {
    const data = {
      shopId: fixtureContext.shopId,
      memberId: userAuth.memberId,
      memberRoleId: userAuth.memberRoleId,
    }
    return isSelfMall
      ? {
          service: getMarketingAdornGoodsListAdorn,
          formEffects: ($, actions) => {
            $('onFieldChange', 'brandId').subscribe((_) => {
              searchBrandOptionEffect(
                { shopId: fixtureContext.shopId, customerCategoryId: activeKey },
                getProductCommodityTemplateGetBrandList,
                actions,
                'brandId',
              )
            })
            $('onFieldChange', 'categoryId').subscribe((_) => {
              searchCustomerCategoryOptionEffect(
                data,
                getProductCommodityTemplateGetFirstCategoryListByMemberId,
                actions,
                'categoryId',
              )
            })
          },
        }
      : {
          formEffects: ($, actions) => {
            $('onFieldChange', 'brandId').subscribe((_) => {
              searchBrandOptionEffect(
                { shopId: fixtureContext.shopId, customerCategoryId: activeKey },
                getProductCommodityTemplateGetBrandList,
                actions,
                'brandId',
              )
            })
            $('onFieldChange', 'categoryId').subscribe((_) => {
              searchCustomerCategoryOptionEffect(
                data,
                getProductCommodityTemplateGetFirstCategoryListByMemberId,
                actions,
                'categoryId',
              )
            })
          },
        }
  }, [isSelfMall])

  const onLabelChange = (data) => {
    mutators.change({ ...value, label: data.label })
  }

  return (
    <div>
      <Product
        onEdit={onEdit}
        {...productProps}
        isWithLabels={componentProps.isWithLabels || false}
        onLabelChange={onLabelChange}
      />
      <CommodityDrawer
        {...restProps}
        visible={productVisible}
        onClose={onClose}
        onConfirm={onOk}
        formatedFilterParams={formatSearchParams}
        selectId={productProps?.id?.toString()}
      />
    </div>
  )
}

FormilyCommodity.isFieldComponent = true
export default FormilyCommodity
