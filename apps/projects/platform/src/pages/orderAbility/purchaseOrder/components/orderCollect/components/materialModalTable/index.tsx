/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addContractOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'

export interface MaterialModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
}

export const materialColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: '物料编号',
    dataIndex: 'materielNo',

    key: 'materielNo',
  },
  {
    title: '物料名称',
    dataIndex: 'materielName',

    key: 'materielName',
  },
  {
    title: '品类',
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: '品牌',
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: '合同剩余',
    dataIndex: 'contractFreeCount',

    key: 'contractFreeCount',
  },
  // {
  //   title: '供方库存',
  //   dataIndex: 'supplierInventory',
  //
  //   key: 'supplierInventory'
  // },
]

// eslint-disable-next-line @typescript-eslint/type-annotation-spacing
const MaterialModalTable: React.FC<MaterialModalTableProps> = (props) => {
  const { type = 'checkbox', schemaAction, confirmModal, currentRef, sectionProps, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const addMaterialProcessField = (value, origin) => {
    const tempOriginData = [...origin]
    if (Array.isArray(value)) {
      const processData = value.map((v) => {
        const temp: any = {}
        temp.id = v.id
        temp.code = v.materielNo
        temp.name = v.materielName
        temp.type = v.type
        temp.category = v.category
        temp.brand = v.brand
        temp.unit = v.unit
        temp.relevanceProductId = v.associatedDataId
        temp.relevanceProductName = v.associatedGoods
        temp.relevanceProductNo = v.associatedMaterielNo
        temp.relevanceProductType = v.associatedType
        temp.relevanceProductCategory = v.associatedCategory
        temp.relevanceProductBrand = v.associatedBrand
        temp.price = v.price
        temp.inventory = v.bidCount
        temp.taxInclusive = v.isHasTax
        temp.taxRate = v.taxRate
        // @ 配送方式 默认物流
        temp.logistics = 1
        return temp
      })
      const originIds = tempOriginData.map((item) => item.id)
      processData.map((item) => {
        if (!originIds.includes(item.id)) {
          tempOriginData.push(item)
        }
      })
      console.log(tempOriginData, 'tempOriginData')
      return tempOriginData
    }
  }

  const handleConfirm = async () => {
    // 判断所选择的商品是否属于同一个工作流
    console.log(rowSelectionCtl, 'rowSelectionCtl')
    // @ts-ignore
    const res = await postOrderIsWorkFlow(
      {
        memberId: schemaAction.getFieldValue('supplyMembersId'),
        memberRoleId: schemaAction.getFieldValue('supplyMembersRoleId'),
        productIds: rowSelectionCtl.selectRow.map((item) => item.associatedDataId),
        orderModel: schemaAction.getFieldValue('orderModel'),
      },
      { ctlType: 'none' },
    )

    if (res.code === 1000) {
      const productData = schemaAction.getFieldValue('orderProductRequests')
      schemaAction.setFieldValue(
        'orderProductRequests',
        addMaterialProcessField(rowSelectionCtl.selectRow, productData),
      )
      confirmModal?.()
      setVisible(false)
    }
    // else {
    //   message.error(res.message)
    // }
  }

  const fetchMaterialList = (values) => {
    const contractId = schemaAction.getFieldValue('contractId')
    const params = {
      ...values,
      contractId,
    }
    return fetchOrderApi.getContractPurchaseMaterielList(params)
  }

  return (
    <ModalTable
      modalTitle="选择采购物料"
      width={900}
      columns={materialColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={fetchMaterialList}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true }}
      modalType="none"
      tableProps={{
        rowKey: 'id',
        onRow: (record) => ({
          onClick: () => {
            rowSelectionCtl.appendSelectRow(record)
            rowSelectionCtl.appendSelectRowKeys(record.id)
          },
        }),
      }}
      formilyProps={{
        ctx: {
          schema: addContractOrderModalSchema(),
          components: { ModalSearch: Search, Submit },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
          },
        },
      }}
      {...restProps}
    />
  )
}

MaterialModalTable.defaultProps = {}

export default MaterialModalTable
