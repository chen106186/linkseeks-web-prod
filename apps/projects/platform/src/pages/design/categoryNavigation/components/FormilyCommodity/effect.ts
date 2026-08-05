// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (
  serachParams: any,
  API: (data: any) => Promise<any>,
  context: any,
  fieldName: string,
) => {
  context.getFieldState(fieldName, (state) => {
    API({
      current: '1',
      pageSize: '100',
      name: state.props['x-component-props'].searchValue,
      ...serachParams,
    }).then((res) => {
      console.log('123io1u23io1u23iou12 3o', res)
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption =
          res.data?.data?.map((item) => {
            return { name: item.name, id: item.id }
          }) || []
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (
  serachParams: any,
  API: (data: any) => Promise<any>,
  context: any,
  fieldName: string,
) => {
  context.getFieldState(fieldName, (state) => {
    API({
      ...serachParams,
    }).then((res) => {
      // getProductPlatformGetCategoryTree().then(res => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption =
          res.data?.map((item) => {
            return { title: item.name, id: item.id }
          }) || []
      })
    })
  })
}
