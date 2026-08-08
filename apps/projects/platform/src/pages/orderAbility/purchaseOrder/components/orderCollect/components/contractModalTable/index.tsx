import React, { useEffect, useState } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { contractColumns } from '../../constant'
import { OrderModalType } from '@/constants/order'
import { getContractManagePageCompleteList } from '@apps/apis'

export interface ContractModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
}

// 选择采购合同弹窗
const ContractModalTable: React.FC<ContractModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })

  const [originType, setOriginType] = useState<number>()

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      /** 这里分 询价 竞价 招标 三种采购合同类型 */
      let sourceType = null
      switch (schemaAction.getFieldValue('orderModel')) {
        case OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER:
          sourceType = 3
          break
        case OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER:
          sourceType = 1
          break
        case OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER:
          sourceType = 2
          break
      }
      setOriginType(sourceType)
    }
  }, [visible])

  const handleConfirm = async () => {
    const item = rowSelectionCtl.selectRow[0]
    if (item) {
      schemaAction.setFieldValue('quotationNo', item.contractNo)
      schemaAction.setFieldValue('contractNo', item.sourceNo)
      schemaAction.setFieldValue('sourceType', item.sourceType)
      schemaAction.setFieldValue('purchaseType', 1)
      const { data } = await fetchOrderApi.getContractPurchaseMaterielList({
        shopId: schemaAction.getFieldValue('shopId'),
        contractId: item.id,
        current: 1,
        pageSize: 999,
      })
      if (!data) {
        return false
      }

      // // 判断所选择的商品是否属于同一个工作流
      // const res = await postOrderIsWorkFlow({
      //   memberId: data[0].memberId,
      //   memberRoleId: data[0].memberRoleId,
      //   productIds: data.map(item => item.productId),
      //   orderModel: schemaAction.getFieldValue('orderModel')
      // }, { ctlType: 'none' })

      // 字段转换
      let newData = data.map((v: any) => {
        let temp: any = {}
        temp.id = v.id
        temp.code = v.materielNo
        temp.name = v.materielName
        temp.type = v.type
        temp.category = v.category
        temp.brand = v.brand
        temp.unit = v.unit
        // temp.relevanceGoods = v.associatedGoods;
        temp.relevanceProductId = v.associatedDataId
        temp.relevanceProductName = v.associatedGoods
        temp.relevanceProductNo = v.associatedMaterielNo
        temp.relevanceProductType = v.associatedType
        temp.relevanceProductCategory = v.associatedCategory
        temp.relevanceProductBrand = v.associatedBrand
        temp.price = v.price
        temp.inventory = v.bidCount
        // temp.purchaseCount = v.purchaseCount;
        temp.taxInclusive = v.isHasTax
        temp.taxRate = v.taxRate
        // @ 配送方式 默认物流
        temp.logistics = 1

        // 会员信息冗余
        temp.memberId = item.partyBMemberId
        temp.memberRoleId = item.partyBRoleId
        return temp
      })
      // 把地址信息冗余给商品字段render
      // schemaAction.setFieldValue('orderProductRequests', await filterProductDataById([], data))
      schemaAction.setFieldValue('orderProductRequests', newData)
      schemaAction.setFieldValue('supplyMembersName', item.partyBName)
      schemaAction.setFieldValue('supplyMembersId', item.partyBMemberId)
      schemaAction.setFieldValue('supplyMembersRoleId', item.partyBRoleId)
      schemaAction.setFieldValue('orderThe', item.contractAbstract)
      schemaAction.setFieldValue('contractId', item.id)
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle="选择采购合同"
      columns={contractColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={async (params) =>
        (
          await getContractManagePageCompleteList(
            { ...params, sourceType: originType },
            { useCache: true, ttl: 10 * 1000 },
          )
        ).data
      }
      rowSelection={rowSelection}
      modalType="contractByDefault"
      searchName="contractNo"
      tableProps={{
        rowKey: 'id',
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      {...restProps}
    />
  )
}

ContractModalTable.defaultProps = {}

export default ContractModalTable
