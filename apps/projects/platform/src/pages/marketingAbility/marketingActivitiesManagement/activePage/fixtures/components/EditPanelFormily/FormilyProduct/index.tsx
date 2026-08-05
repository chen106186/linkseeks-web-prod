import React, { useContext, useMemo, useState } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { useSelector } from '@apps/design-react'
import { Context as ShopContext } from '../../../common/context/shopContext'
import { Product } from '../../ProductPanel'
import ActivityProductDrawer from '../../ActivityAreaSetting/activityProductDrawer'
import {
  getMarketingAdornMerchantActivityListAdorn,
  GetMarketingAdornPlatformActivityListAdornRequest,
} from '@apps/apis'
import activityImageSvg from '@/assets/activity/ActivityImage.svg'

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
      isWithLabels?: boolean
      activityImage?: string
      /** [`${id}_${activityId}`] */
      disabledKeys?: string[]
      /** 1. 满两件、满额减、增商品、满额换购 2.满量折/满额折、赠优惠券、买商品换购 */
      minType?: 1 | 2 | (number & {})
    } & {
      [key: string]: any
    }
  }
  mutators: {
    change: (params: any) => void
  }
}

const FormilyActivityProduct: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  const { shopId } = useContext(ShopContext) || {}
  const componentProps = props.props?.['x-component-props'] || ({} as Iprops['props']['x-component-props'])
  const activityImage = componentProps.activityImage || activityImageSvg
  const disabledKeys = componentProps.disabledKeys || []
  const ignoresFilters = componentProps?.activityType ? ['activityType'] : []

  const [productVisible, setProductVisible] = useToggle()
  const cacheProductList = useMemo(() => [{ ...value }], [value])
  const productProps = useMemo(
    () => ({
      id: value?.id,
      activityId: value?.activityId,
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

  const onLabelChange = (data: { id: number; activityId: number; label: string[] }) => {
    const current = {
      ...productProps,
      label: data.label,
    }
    mutators.change(current)
  }

  const onEdit = () => {
    setProductVisible(true)
  }

  const fetchData = async (params: GetMarketingAdornPlatformActivityListAdornRequest) => {
    const withActivityType = componentProps?.activityType ? { activityType: componentProps?.activityType } : {}
    const minType = componentProps?.minType ? { minType: componentProps.minType } : {}
    const withActivityId = componentProps?.id ? { id: componentProps.id } : {}
    const common = {
      shopId: shopId?.toString(),
      innerStatusList: [8, 9],
      ...params,
      ...minType,
      ...withActivityType,
      ...withActivityId,
    }
    const isWithActivityType = common
    return await getMarketingAdornMerchantActivityListAdorn(isWithActivityType as any)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Product
        onEdit={onEdit}
        activityImage={activityImage}
        {...productProps}
        isWithLabels={componentProps.isWithLabels || false}
        onLabelChange={onLabelChange}
      />
      <ActivityProductDrawer
        ignoresFilters={ignoresFilters}
        activityImage={activityImage}
        products={cacheProductList}
        onOk={onOk}
        fetchData={fetchData}
        visible={productVisible}
        onCancel={() => setProductVisible(false)}
        mode="radio"
        disabledList={disabledKeys}
      />
    </div>
  )
}

FormilyActivityProduct.isFieldComponent = true
export default FormilyActivityProduct
