import React, { useContext, useMemo, useState } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { useSelector } from '@apps/design-react'
import { context } from '../../common/context/context'
import { Product } from '@/pages/marketingAbility/marketingActivitiesManagement/activePage/fixtures/components/ProductPanel'
import ActivityProductDrawer from '@/pages/marketingAbility/marketingActivitiesManagement/activePage/fixtures/components/ActivityAreaSetting/activityProductDrawer'
import {
  getMarketingAdornMerchantActivityListAdorn,
  GetMarketingAdornMerchantActivityListAdornRequest,
} from '@apps/apis'
import activityImage from '@/assets/activity/ActivityImage.svg'

interface Iprops {
  value: {
    id: number
    productName: string
    activityId: number
    activityList: any[]
    productImgUrl: string
    price: number
    label: string[]
  }
  props: {
    ['x-component-props']: {
      activityType: number
      isWithLabels: boolean
    } & {
      [key: string]: any
    }
  }
  mutators: {
    change: (params: any) => void
  }
}

/** 活动商品组件 */
const FormilyActivityProduct: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  /** 1 级分类 id */
  const { activeKey } = useSelector<any, 'activeKey'>(['activeKey'])
  const fixtureContext = useContext(context)
  /** 是否是自营商城 */
  const isSelfMall = useMemo(() => fixtureContext.isSelfMall, [fixtureContext.isSelfMall])
  const ignoresFilters = ['activityType']
  const componentProps = props.props?.['x-component-props'] || ({} as { activityType?: number; isWithLabels: boolean })

  const [productVisible, setProductVisible] = useToggle()
  /** @tofixed activityId */
  const cacheProductList = useMemo(() => [{ ...value }], [value])
  const productProps = useMemo(
    () => ({
      id: value?.id,
      productName: value?.productName,
      activityList: value?.activityList,
      productImgUrl: value?.productImgUrl,
      price: value?.price,
      label: value?.label,
    }),
    [value],
  )

  const onOk = (data) => {
    const first = data[0]
    mutators.change(first)
    setProductVisible(false)
  }

  const onEdit = () => {
    setProductVisible(true)
  }

  const fetchData = async (params: GetMarketingAdornMerchantActivityListAdornRequest) => {
    const withActivityType = componentProps?.activityType ? { activityType: componentProps?.activityType } : {}
    /** 自营商城，b端，c端需要带一级品类，不明白为啥要这么设计 */
    const withCategoryId = isSelfMall ? { categoryId: activeKey } : {}
    const common = {
      ...params,
      shopId: fixtureContext?.shopId.toString(),
      innerStatusList: [8, 9],
      ...withCategoryId,
      ...withActivityType,
    }
    const isWithActivityType = common
    return await getMarketingAdornMerchantActivityListAdorn(isWithActivityType as any)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Product onEdit={onEdit} {...productProps} isWithLabels={componentProps.isWithLabels || false} />
      <ActivityProductDrawer
        ignoresFilters={ignoresFilters}
        activityImage={activityImage}
        products={cacheProductList}
        onOk={onOk}
        fetchData={fetchData}
        visible={productVisible}
        onCancel={() => setProductVisible(false)}
        mode="radio"
      />
    </div>
  )
}

FormilyActivityProduct.isFieldComponent = true
export default FormilyActivityProduct
