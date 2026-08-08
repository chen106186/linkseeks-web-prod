import { paymentInformationColumns } from '../constant'
import { PayInfoCell, EditableRow } from '../components/payInfoTableCell'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useEffect, useState, useRef } from 'react'
import { getOrderBuyerCreatePayTypes, postOrderBuyerCreatePaymentFind } from '@apps/apis'

export const usePaymentInfo = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, products: any = []): any => {
  const paywayData = useRef<any>({})
  const [columns, setColumns] = useState<any[]>(paymentInformationColumns)
  const markRef = useRef<boolean>(true)
  const components = {
    body: {
      row: EditableRow,
      cell: PayInfoCell,
    },
  }

  useEffect(() => {
    // 商品有传入时 调用支付方式api
    if (products.length && markRef.current) {
      // getPayLists(products[0].memberId, products[0].memberRoleId)
      // 设置支付方式
      const newColumns = [...columns]
      newColumns[5].formItemProps.options = initPayWayList(products[0].memberId, products[0].memberRoleId)
      setColumns(newColumns)
      markRef.current = false
    }
  }, [products])

  const initPayWayList = (memberId, memberRoleId) => {
    let result = []
    getOrderBuyerCreatePayTypes({ vendorMemberId: memberId, vendorRoleId: memberRoleId }).then((res) => {
      const { data = [], code } = res
      for (let item of data) {
        result.push({
          payTypeName: item.payTypeName,
          payType: item.payType,
          payChannels: [...item.payChannels],
        })
      }
    })
    return result
  }

  const getPayLists = (memberId, memberRoleId) => {
    postOrderBuyerCreatePaymentFind(
      {
        memberId,
        roleId: memberRoleId,
        shopId: products[0]['shopId'],
        orderMode: products[0]['orderMode'],
        products: products.map((item) => ({
          productId: item.commodityId,
          skuId: item.id,
          crossBorder: item.isCrossBorder,
        })),
      },
      { ctlType: 'none' },
    ).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        // 设置支付方式
        const newColumns = [...columns]
        newColumns[5].formItemProps.options = initPayWayList(memberId, memberRoleId)
        paywayData.current = data
        setColumns(newColumns)
      }
    })
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('payments')]
      const index = newData.findIndex((item) => row.batchNo === item.batchNo)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('payments', newData)
      resolve({ item, newData })
    })
  }
  return [columns, components, handleSave]
}
