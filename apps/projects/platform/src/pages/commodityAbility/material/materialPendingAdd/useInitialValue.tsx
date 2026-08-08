import { getProductMaterielGetMateriel, GetProductMaterielGetMaterielResponse } from '@apps/apis'
import React, { useEffect, useMemo, useState } from 'react'

export type Options = {
  id: string
  /** 货源清单 */
  state?: {
    dataSource?: {
      code: string
      memberId: number
      memberName: string
      memberRoleId: number
      unitId: string
      name: string
      /** 规格 */
      type: string
    }
  }
  query?: {
    type: 'sourceData'
  }
}

function useInitialValue(options: Options) {
  const { id, state, query } = options
  const [initialValue, setInitialValue] = useState<null | GetProductMaterielGetMaterielResponse>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }
    async function getData() {
      setLoading(true)
      const { data, code } = await getProductMaterielGetMateriel({ id: id })
      if (code === 1000) {
        setInitialValue(data)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const formatInitialValue = useMemo(() => {
    if (!initialValue) {
      if (query.type === 'sourceData') {
        return {
          ...state?.dataSource,
        }
      }
      return null
    }
    const category = initialValue.customerCategory?.fullId?.split('.').map((_item) => _item.replace(/0+/, ''))
    const customerAttribute = {}
    initialValue?.materialAttributeList.forEach((_item) => {
      /** 1-单选、2-多选、3-输入 */
      const isInput = _item.customerAttribute?.type === 3
      const res = isInput
        ? `${_item.customerAttributeValueList?.[0]?.value}`
        : `${_item.customerAttributeValueList?.[0]?.id}-${_item.customerAttributeValueList?.[0]?.value}`
      customerAttribute[`customerAttribute-${_item.customerAttribute.id}`] = res
    })

    return {
      ...initialValue,
      brand: initialValue?.brand?.id,
      category: category,
      materialGroup: initialValue?.materialGroup?.fullId?.split('.').map((_item) => _item.replace(/0+/, '')),
      urls: initialValue.urls?.map((_item) => {
        return {
          file: { name: _item.name, url: _item.url },
          description: _item.description,
        }
      }),
      materielPic: initialValue.materielPic?.map((_item) => ({
        name: _item,
        url: _item,
      })),
      remark: initialValue?.remake,
      unitConversions: initialValue?.unitConversions,
      // contactMemberPhone:initialValue.contactMemberPhone,
      // contactMemberName:initialValue.contactMemberName,
      // materialsManufacturer:initialValue.materialsManufacturer,
      // materialsOrigin:initialValue. materialsOrigin,
      // materialsDeliverPeriod:initialValue.materialsDeliverPeriod,
      // materialsDeparture:initialValue.materialsDeparture,
      ...customerAttribute,
    }
  }, [initialValue])

  return { loading, initialValue, formatInitialValue }
}

export default useInitialValue
