import React, { useContext, useMemo, useState } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { clearSelectedStatus, useSelector } from '@apps/design-react'
import { context } from '../../common/context/context'
import { useFilterSameOption } from '../../common/hooks/useFilterSameOption'
import { Product } from '@/pages/marketingManage/marketing/activePage/components/ProductPanel'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'

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

/** 销量排行 */
const FormilyCommodity: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  /** 1 级分类 id */
  const { activeKey } = useSelector<any, 'activeKey'>(['activeKey'])
  const fixtureContext = useContext(context)
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
    mutators.change(data)
    setProductVisible(false)
  }

  const onEdit = () => {
    setProductVisible(true)
  }

  const onClose = () => {
    setProductVisible(false)
  }

  const filterParam = useMemo(() => {
    return {
      shopId: fixtureContext?.shopId.toString(),
      categoryId: activeKey,
      idNotInList: [productProps?.id].concat(disabledSaleRankingKeys).filter(Boolean),
    }
  }, [fixtureContext?.shopId.toString(), activeKey, productProps, disabledSaleRankingKeys])

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
        visible={productVisible}
        onClose={onClose}
        onConfirm={onOk}
        filterParam={filterParam}
        selectId={productProps?.id?.toString()}
      />
    </div>
  )
}

FormilyCommodity.isFieldComponent = true
export default FormilyCommodity
