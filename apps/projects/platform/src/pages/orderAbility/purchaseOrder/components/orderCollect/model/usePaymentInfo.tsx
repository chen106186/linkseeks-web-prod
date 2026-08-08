import { paymentInformationColumns } from '../constant'
import { PayInfoCell, EditableRow } from '../components/payInfoTableCell'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useEffect, useState, useRef } from 'react'

export const usePaymentInfo = (
  ctx: ISchemaFormActions | ISchemaFormAsyncActions,
  memberId: any,
  memberRoleId: any,
  orderProducts: any,
): any => {
  const paywayData = useRef<any>({})
  const [columns, setColumns] = useState<any[]>(paymentInformationColumns)
  // const { schemaActions, detailData } = useContext(ReadyAddOrderDetailContext)
  const components = {
    body: {
      row: EditableRow,
      cell: PayInfoCell,
    },
  }
  const initPayWayList = (data) => {
    if (!data) {
      return []
    }
    let result = []
    for (let item of data) {
      if (result.some((tempItem) => tempItem.payType === item.payType)) {
        result = result.map((resItem) => {
          if (resItem.payType === item.payType) {
            resItem.payList = [...resItem.payList, item]
          }
          return resItem
        })
      } else {
        let payVal = ''
        switch (item.payType) {
          case 1:
            payVal = '线上支付'
            break
          case 2:
            payVal = '线下支付'
            break
          case 3:
            payVal = '授信支付'
            break
          case 4:
            payVal = '货到付款'
            break
          default:
            // 不在上述范围之内 为100账结 101月结
            if (item.settlementWay === 100) payVal = '账期'
            if (item.settlementWay === 101) payVal = '月结'
            break
        }
        result.push({
          payVal,
          payType: item.id === -1 ? item.id : item.payType,
          payList:
            item.id === -1
              ? [
                  {
                    ...item,
                    way: item.settlementWay === 100 ? `账期${item.settlementDays}天` : `月结${item.settlementDate}号`,
                    payType: item.id,
                    // 具体结算方式
                    wayId: item.settlementWay,
                    id: item.settlementWay,
                  },
                ]
              : [item],
        })
      }
    }
    console.log(result, 'result')
    return result
  }

  // useEffect(() => {
  //   getPayPayWayList().then(res => {
  //     const { code, data } = res
  //     if (code === 1000) {
  //       const newColumns = [...columns]
  //       newColumns[5].formItemProps.options = initPayWayList(data)
  //       paywayData.current = data

  //       setColumns(newColumns)
  //     }
  //   })
  // }, [])

  useEffect(() => {
    // 当选择报价单/会员/商品时有memberId传入时 调用支付方式api
    if (memberId) {
      getPayLists(memberId, memberRoleId)
    }
  }, [memberId])

  useEffect(() => {
    if (orderProducts?.length) {
      restrictArrivalPay(columns, orderProducts)
    }
  }, [orderProducts])

  const getPayLists = (memberId, memberRoleId) => {
    // getPayPayWayList({memberId, memberRoleId}).then(res => {
    // getPayPayWayAccount({memberId, memberRoleId}).then(res => {
    //   const { code, data } = res
    //   if (code === 1000) {
    //     const newColumns = [...columns]
    //     newColumns[5].formItemProps.options = initPayWayList(data)
    //     paywayData.current = data
    //     restrictArrivalPay(newColumns, orderProducts)
    //     setColumns(newColumns)
    //   }
    // })
  }

  // 限制使用到付（多次支付和商品仅有物流）
  const restrictArrivalPay = (cols, pros) => {
    if (pros?.length) {
      const newColumns = [...cols]
      let options = newColumns[5].formItemProps.options

      setTimeout(() => {
        let paymentDOM = document.getElementsByClassName('payRatio')
        // 多次支付也要禁用到付
        if (paymentDOM?.length > 1 || pros.filter((item) => item.deliveryType === 1).length !== pros.length) {
          if (options.filter((_item) => _item.payType === 4).length)
            options.filter((_item) => _item.payType === 4)[0].disabled = true
        } else {
          if (options.filter((_item) => _item.payType === 4).length)
            options.filter((_item) => _item.payType === 4)[0].disabled = false
        }
      }, 800)

      setColumns(newColumns)
    }
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('paymentInformationResponses')]
      const index = newData.findIndex((item) => row.payCount === item.payCount)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('paymentInformationResponses', newData)
      resolve({ item, newData })
    })
  }
  return [columns, components, handleSave]
}
