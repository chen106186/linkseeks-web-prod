import React, { useEffect, useState } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { useModalTable } from '../../model/useModalTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { contractColumns } from '../../constant'
import { OrderModalType } from '@/constants/order'
import { getContractManagePageCompleteList } from '@apps/apis'

export interface ContractModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
  setContractValue?: (value) => any
}

// 选择采购合同弹窗
const ContractModalTable: React.FC<ContractModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, setContractValue, ...restProps } = props
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
      /** 这里分 询价 竞价 招标 请购单 框架 四种采购合同类型 */
      let sourceType = null
      const contract = schemaAction.getFieldValue('contract')
      switch (schemaAction.getFieldValue('orderMode')) {
        case OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER:
          sourceType = 3
          break
        case OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER:
          sourceType = 1
          break
        case OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER:
          sourceType = 2
          break
        case OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER:
          sourceType = 4
          break
        case OrderModalType.FRAME_CONTRACT_ORDER:
          sourceType = 5
          break
      }
      if (contract) {
        rowSelectionCtl.setSelectedRowKeys([contract.id || contract.contractId])
      }
      setOriginType(sourceType)
    }
  }, [visible])

  const handleConfirm = () => {
    const item = rowSelectionCtl.selectRow[0]
    if (item) {
      const productValue = schemaAction.getFieldValue('products')
      // 有值才置空，否则会触发错误提示
      if (productValue && productValue.length) {
        schemaAction.setFieldValue('products', [])
      }
      setContractValue(item)
      schemaAction.setFieldValue('contractNo', item.contractNo)
      schemaAction.setFieldValue('contract', item)
      schemaAction.setFieldValue('vendorMemberName', item.partyBName)
      schemaAction.setFieldValue('vendorMemberId', item.partyBMemberId)
      schemaAction.setFieldValue('vendorRoleId', item.partyBRoleId)
      schemaAction.setFieldValue('digest', item.contractAbstract)
      // fillProductsOfContractIntoTable(item)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    confirmModal && confirmModal()
    setVisible(false)
  }

  return (
    <ModalTable
      modalTitle={'选择采购合同'}
      columns={contractColumns}
      width={1240}
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
