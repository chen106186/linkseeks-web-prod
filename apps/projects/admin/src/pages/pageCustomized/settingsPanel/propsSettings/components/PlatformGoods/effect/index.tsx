import React, { useEffect } from 'react'
import { ISchemaFormActions, FormEffectHooks, IFormActions } from '@apps/formily'
import {
  getCommodityAdornWebPlatformFindBrandList,
  getCommodityWebCategoryWebFindEnterpriseCategoryTree,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
const { onFieldValueChange$ } = FormEffectHooks

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (context: any, fieldName: string, param: any) => {
  context.getFieldState(fieldName, (state) => {
    // console.log(state.props['x-component-props'].searchValue, 'pagesearchvalue') // 此处可以实时获取到输入并暂存在schema props的值
    getCommodityAdornWebPlatformFindBrandList(param).then((res) => {
      context.setFieldState(fieldName, (state) => {
        const newData = res.data.data.map((item) => {
          return {
            id: item.brandId,
            name: item.brandName,
          }
        })
        state.props['x-component-props'].dataoption = newData || []
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getCommodityWebCategoryWebFindEnterpriseCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
