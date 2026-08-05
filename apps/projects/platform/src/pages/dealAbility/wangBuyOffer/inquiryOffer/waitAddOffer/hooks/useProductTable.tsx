import { useEffect, useMemo, useRef, useState } from 'react'
import { useModalTable } from './useModalTable'
import { ModalFormTable } from '@apps/components'
import {
  getProductCustomerGetMemberCustomerCategoryTree,
  GetProductCustomerGetMemberCustomerCategoryTreeResponse,
  getProductSelectGetMemberBrand,
  GetProductSelectGetMemberBrandResponse,
} from '@apps/apis'
import { authService } from '@apps/services'

// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  const keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  const newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const useProductTable = () => {
  const productRef = useRef<any>({})
  const productTableRef = ModalFormTable.useTableRef()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const [customerCategoryList, setCustomerCategoryList] = useState<Array<{ label: string; value: string }>>([])
  const [brandList, setBrandList] = useState<Array<{ label: string; value: number }>>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const userInfo = authService.getAuth()

  const fetchCategoryList = () => {
    const params = {
      memberId: userInfo.memberId,
      memberRoleId: userInfo.memberRoleId,
    }
    getProductCustomerGetMemberCustomerCategoryTree(params).then((res) => {
      if (res.code === 1000) {
        setCustomerCategoryList(
          res.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        )
      }
    })
  }

  const fetchBrandList = () => {
    const params = {
      memberId: userInfo.memberId,
      memberRoleId: userInfo.memberRoleId,
    }
    getProductSelectGetMemberBrand(params).then((res) => {
      if (res.code === 1000) {
        setBrandList(
          res.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        )
      }
    })
  }

  useEffect(() => {
    fetchCategoryList()
    fetchBrandList()
  }, [])

  const searchSelectMaps = useMemo(() => {
    return {
      customerCategoryId: customerCategoryList,
      brandId: brandList,
    }
  }, [customerCategoryList, brandList])

  return {
    productRef,
    productTableRef,
    searchSelectMaps,
    selectedIds,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
