import React from 'react'
import { getProductSelectGetSelectCategory } from '@apps/apis'

// 高级筛选schema中用于输入搜索需求发布品类的Effect
export const searchSelectGetSelectCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectCategory({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
