import React, { useContext, useMemo, useState } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { useSelector } from '@apps/design-react'
import { context } from '../../common/context/context'
import { Product } from '@/pages/marketingManage/marketing/activePage/components/ProductPanel'
import ActivityProductDrawer from '@/pages/marketingManage/marketing/activePage/components/ActivityAreaSetting/activityProductDrawer'
import {
  GetMarketingAdornPlatformActivityListAdornRequest,
  getMarketingAdornPlatformActivityListAdorn,
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
    } & {
      [key: string]: any
    }
  }
  mutators: {
    change: (params: any) => void
  }
}

/** 秒杀 */
const FormilyActivityProduct: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  /** 1 级分类 id */
  const { activeKey } = useSelector<any, 'activeKey'>(['activeKey'])
  const fixtureContext = useContext(context)
  const ignoresFilters = ['activityType']

  const componentProps = props.props?.['x-component-props'] || {}

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

  const fetchData = async (params: GetMarketingAdornPlatformActivityListAdornRequest) => {
    const withActivityType = componentProps?.activityType ? { activityType: componentProps?.activityType } : {}
    const common = {
      ...params,
      shopId: fixtureContext?.shopId.toString(),
      categoryId: activeKey,
      ...withActivityType,
    }
    const isWithActivityType = common
    return await getMarketingAdornPlatformActivityListAdorn(isWithActivityType as any)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Product onEdit={onEdit} {...productProps} isWithLabels={componentProps.isWithLabels || false} />
      <ActivityProductDrawer
        ignoresFilters={ignoresFilters}
        activityImage={activityImage}
        products={cacheProductList as any}
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
