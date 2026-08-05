import { getProductSelectGetSelectCategory, getProductSelectGetSelectPlatformBrand } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getProductSelectGetSelectCategory)
  const { data: dataBrand } = useRequestApi(getProductSelectGetSelectPlatformBrand)

  const selectData = useMemo(
    () => ({
      customerCategoryId: data?.map((item) => ({ label: item.name, value: item.id })),
      brandId: dataBrand?.map((item) => ({ label: item.name, value: item.id })),
    }),
    [data, dataBrand],
  )

  return selectData
}

export default useSelectOptions
