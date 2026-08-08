import React, { useState, useEffect } from 'react'
import { OrderModalType } from '@/constants'
import { useLocation, useQuery } from '@linkseeks/router-core'
import { ISchemaFormActions } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

interface DetailOrderLocationState {
  // 进货单商品列表
  productList?: any[]
  // 下单模式
  modelType?: OrderModalType
}

interface DetailOptionsProps {
  addSchemaAction: ISchemaFormActions
}

const mockDefaultValue: DetailOrderLocationState = {
  productList: [
    {
      id: 1,
      name: '甲商品',
      customerCategoryName: '假品类',
      brandName: '假品牌',
    },
  ],
  modelType: 5,
}

export const useDetailOrder = (options: DetailOptionsProps) => {
  const { addSchemaAction } = options
  const formilyUtils = useLinkageUtils()
  // const [productDataSource, setProductDataSource] = useState
  const locationState = useLocation<DetailOrderLocationState>().state || {}
  const { productList } = locationState
  const { modelType } = useQuery()
  // 是否显示选择商品按钮
  const [showProBtn, setShowProBtn] = useState(false)
  // 是否显示供应会员字段
  const [showMemberType, setShowMemberType] = useState(false)

  const [visibleMember, setVisibleMember] = useState(false)

  // 商品列表, 如果路由state中 带有productList, 说明是进货单下单, 需要回显进货单商品数据
  const [proList, setProList] = useState<any[]>(() => productList || [])

  // 回显数据写在这
  useEffect(() => {
    // 页面中有传入下单模式， 需要手动回显数据
    if (modelType) {
      addSchemaAction.setFieldValue('orderModel', parseInt(modelType))
    }
    // 在有传入商品列表时 需手动回显
    if (proList.length > 0) {
      addSchemaAction.setFieldValue('orderProductRequests', proList)
      addSchemaAction.setFieldValue('orderThe', proList[0].name)
    }
  }, [modelType, productList])

  return {
    showProBtn,
    setShowProBtn,
    showMemberType,
    setShowMemberType,
    proList,
    modelType,
    visibleMember,
    setVisibleMember,
  }
}
